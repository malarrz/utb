const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slugs');

const modeloTienda = new mongoose.Schema({
    nombre: {
        type: String,
        trim: true, //Quita los espacios al comienzo y al final del String.
        required: 'Coloca el nombre de la tienda'

    },
    slug: String,
    descripcion: {
        type: String,
        trim: true
    },
    etiquetas: [String]
})

modeloTienda.pre('save', function(next){
    if(!this.ismodified('name')) {
        next();
        return;
    }
    this.slug = slug(this.name);
    next();
})

module.exports = mongoose.model('Tienda', modeloTienda);