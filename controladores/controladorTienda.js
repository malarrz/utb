const mongoose = require('mongoose');
const Tienda = mongoose.model('Tienda');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const { Store } = require('express-session');

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
    const tienda = await (new Tienda(req.body)).save();
    req.flash('success', `Se creó la tienda: <strong>${tienda.nombre}</strong>.`)
    res.redirect(`/tiendas/${tienda.slug}`);
};

exports.mostrarTiendas = async (req, res) => {
    const tiendas = await Tienda.find();
    res.render('tiendas', { title: 'TIENDAS', tiendas });
};

exports.editarTienda = async (req, res) => {
    const tienda = await Tienda.findOne({ _id: req.params.id });
    res.render('editarTienda', { title: `Editando ${tienda.nombre}`, tienda});
};

exports.modificarTienda = async (req, res) => {
    //req.body.ubicacion.type = 'Point';
    const tienda = await Tienda.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true, runValidators: true }).exec();
    req.flash('success', `Se modificó exitosamente la tienda <strong>${tienda.nombre}</strong>. <a href="/tiendas/${tienda.slug}"> VER TIENDA</a>`);
    res.redirect(`/tiendas/${tienda._id}/editar`);
};

exports.mostrarTienda = async (req, res, next) => {
    const tienda = await Tienda.findOne({ slug: req.params.slug });
    if (!tienda) return next();
    res.render('tienda', { tienda, title: tienda.nombre });
};

exports.tiendasPorEtiqueta = async (req, res) => {
    const etiquetas = await Tienda.organizarEtiquetas();
    const etiqueta = req.params.etiqueta;
    res.render('etiqueta', { etiquetas, title: 'Etiquetas', etiqueta});
};