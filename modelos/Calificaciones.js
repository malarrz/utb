const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const modeloCalificaciones = new mongoose.Schema({
    fecha: {
        type: Date,
        default: Date.now
    },
    autor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Usuarios',
        required: 'Se necesita un Usuario para la calificación'
    },
    tienda: {
        type: mongoose.Schema.ObjectId,
        ref: 'Tienda',
        required: 'Se necesita la Tienda a la cual calificar'
    },
    texto: {
        type: String,
        required: 'Tu calificación debe tener texto'
    },
    calificacion: {
        type: Number,
        min: 1,
        max: 5
    }
});

function autopopular(next) {
    this.populate('autor');
    next();
};

modeloCalificaciones.pre('find', autopopular);
modeloCalificaciones.pre('findOne', autopopular);

module.exports = mongoose.model('Calificaciones', modeloCalificaciones);