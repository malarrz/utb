const mongoose = require('mongoose');
const Tienda = mongoose.model('Tienda');
const Usuario = mongoose.model('Usuarios');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const { Store } = require('express-session');
const Usuarios = require('../modelos/Usuarios');

const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
        const isPhoto = file.mimetype.startsWith('image/');
        if (isPhoto) {
            next(null, true);
        } else {
            next({ message: 'Formato de imagen no permitido' }, false);
        }
    }
};

exports.homePage = (req, res) => {
    res.render('index');
};

exports.agregarTienda = (req, res) => {
    res.render('editarTienda', { title: 'Agregar Tienda' });
};

exports.upload = multer(multerOptions).single('foto');

exports.redimensionar = async(req, res, next) => {
    if (!req.file) {
        next();
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.foto = `${uuid.v4()}.${extension}`;
    const foto = await jimp.read(req.file.buffer);
    await foto.resize(800, jimp.AUTO);
    await foto.write(`./public/uploads/${req.body.foto}`);
    next();
}

exports.crearTienda = async (req, res) => {
    req.body.propietario = req.user._id;
    const tienda = await (new Tienda(req.body)).save();
    req.flash('success', `Se creó la tienda: <strong>${tienda.nombre}</strong>.`)
    res.redirect(`/tiendas/${tienda.slug}`);
};

exports.mostrarTiendas = async (req, res) => {
    const pag = req.params.pag || 1;
    const limite = 2;
    const salto = (pag * limite) - limite;

    const promesaTiendas = Tienda
    .find()
    .skip(salto)
    .limit(limite)
    .sort({ creado: 'desc' });

    const promesaConteo = Tienda.count();

    const [tiendas, count] = await Promise.all([promesaTiendas, promesaConteo]);
    const paginas = Math.ceil(count / limite);
    if (!tiendas.length && salto) {
        res.redirect(`/tiendas/pag/${paginas}`);
        return;
    };

    res.render('tiendas', { title: 'TIENDAS', tiendas, pag, paginas, count });
};

const confirmarPropietario = (tienda, user) => {
    if (!tienda.propietario.equals(user._id)) {
        throw Error('Debes ser el propietario de la tienda a editar');
    }
};

exports.editarTienda = async (req, res) => {
    const tienda = await Tienda.findOne({ _id: req.params.id });
    confirmarPropietario(tienda, req.user);
    res.render('editarTienda', { title: `Editando ${tienda.nombre}`, tienda});
};

exports.modificarTienda = async (req, res) => {
    const tienda = await Tienda.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true }).exec();
    req.flash('success', `Se modificó exitosamente la tienda <strong>${tienda.nombre}</strong>. <a href="/tiendas/${tienda.slug}"> VER TIENDA</a>`);
    res.redirect(`/tiendas/${tienda._id}/editar`);
};

exports.mostrarTienda = async (req, res, next) => {
    const tienda = await Tienda.findOne({ slug: req.params.slug }).populate('propietario calificaciones');
    if (!tienda) return next();
    res.render('tienda', { tienda, title: tienda.nombre });
};

exports.tiendasPorEtiqueta = async (req, res) => {
    const etiqueta = req.params.etiqueta;
    const busquedaEtiqueta = etiqueta || { $exists: true };
    const promesaEtiqueta = Tienda.organizarEtiquetas();
    const promesaTienda = Tienda.find({ etiquetas: busquedaEtiqueta });
    const [etiquetas, tiendas] = await Promise.all([promesaEtiqueta, promesaTienda]);
    res.render('etiqueta', { etiquetas, title: 'Etiquetas', etiqueta, tiendas});
};

exports.busquedaTienda = async (req, res) => {
    const tiendas = await Tienda
    .find({
        $text: {
            $search: req.query.q
        }
    }, {
        score: { $meta: 'textScore' }
    })
    .sort({
        score: { $meta: 'textScore' }
    });
    res.json(tiendas);
};

exports.mapaTiendas = async (req, res) => {
    const coordenadas = [req.query.lng, req.query.lat].map(parseFloat);
    const q = {
        location: {
            $cerca: {
                $geometry: {
                    type: 'Point',
                    coordenadas
                },
                //$maxDistance: 1000
            }
        }
    };
    const tiendas = await Tienda.find(q).select('slug nombre descripcion ubicacion foto');
    res.json(tiendas);
};

exports.paginaMapa = (req, res) => {
    res.render('mapa', {title: 'Mapa' });
};

exports.tiendaFavorita = async (req, res) => {
    const favoritos = req.user.favoritos.map(obj => obj.toString());
    const operador = favoritos.includes(req.params.id) ? '$pull' : '$addToSet';
    const usuario = await Usuarios.findByIdAndUpdate(req.user._id, { [operador]: { favoritos: req.params.id }},
        { new: true }
    );
    res.json(usuario);
};

exports.mostrarFavoritos = async (req, res) => {
    const tiendas = await Tienda.find({
        _id: { $in: req.user.favoritos }
    });
    res.render('tiendas', { title: 'Tiendas Favoritas', tiendas });
};

exports.mejoresTiendas = async (req, res) => {
    const tiendas = await Tienda.mejoresTiendas();
    res.render('mejoresTiendas', { tiendas, title: 'Las Tiendas mejores calificadas'});
}