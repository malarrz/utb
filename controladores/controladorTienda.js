const mongoose = require('mongoose');
const Tienda = mongoose.model('Tienda');

exports.homePage = (req, res) => {
    res.render('index');
};

exports.agregarTienda = (req, res) => {
    res.render('editarTienda', { title: 'Agregar Tienda' });
};

exports.crearTienda = async (req, res) => {
    const tienda = await (new Tienda(req.body)).save();
    req.flash('success', `Se creó la tienda: <strong>${tienda.nombre}</strong>.`)
    res.redirect(`/tiendas/${tienda.slug}`);
};

exports.mostrarTiendas = async (req, res) => {
    const tiendas = await Tienda.find();
    res.render('tiendas', { title: 'TIENDAS', tiendas });
};