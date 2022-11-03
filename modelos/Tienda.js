const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const modeloTienda = new mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        required: 'Coloca el nombre de la tienda'
    },
    slug: String,
    descripcion: {
        type: String,
        trim: true
    },
    etiquetas: [String],
    creado: { 
        type: Date, 
        default: Date.now
    },
    ubicacion: {
        type: { 
            type: String,
            default: 'Point'
        },
        coordenadas: [{
            type: Number,
            required: 'Colocar coordenadas'
        }],
        direccion: {
            type: String,
            required: 'Colocar dirección'
        }
    }
})

modeloTienda.pre('save', function(next) {
    if(!this.isModified('nombre')) {
        next();
        return;
    }
    this.slug = slug(this.nombre);
    next();
})

module.exports = mongoose.model('Tienda', modeloTienda);