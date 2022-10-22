const mongoose = require('mongoose');
const Tienda = mongoose.model('Tienda');

exports.homePage = (req, res) => {
    res.render('index');
};

exports.agregarTienda = (req, res) => {
    res.render('editarTienda', { title: 'Agregar Tienda' });
};

exports.crearTienda = async (req, res) => {
    const tienda = new Tienda(req.body);
    await tienda.save();
    res.redirect('/');
};