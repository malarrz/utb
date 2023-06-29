const mongoose = require('mongoose');
const Calificacion = mongoose.model('Calificaciones');

exports.agregarCalificacion = async (req, res) => {
    req.body.autor = req.user._id;
    req.body.tienda = req.params.id;
    const nuevaCalificacion = new Calificacion(req.body);
    await nuevaCalificacion.save();
    req.flash('success', 'Calificación guardada');
    res.redirect('back');
};