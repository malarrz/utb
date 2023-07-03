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
    },
    foto: String,
    propietario: {
        type: mongoose.Schema.ObjectId,
        ref: 'Usuarios',
        required: 'La tienda debe tener un propietario'
    } 
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

//índices para búsqueda
modeloTienda.index({
    nombre: 'text',
    descripcion: 'text'
});

modeloTienda.index({ coordenadas: '2dsphere' });

modeloTienda.pre('save', async function(next) {
    if(!this.isModified('nombre')) {
        next();
        return;
    }
    this.slug = slug(this.nombre);
    const slugRegEx = new RegExp(`^(${this.slug})((-[0-9]*$)?)$`, 'i');
    const tiendaSlug = await this.constructor.find({ slug: slugRegEx });
    if(tiendaSlug.length) {
        this.slug = `${this.slug}-${tiendaSlug.length + 1}`;
    }
    next();
});

modeloTienda.statics.organizarEtiquetas = function() {
    return this.aggregate([
        { $unwind: '$etiquetas' },
        { $group: { _id: '$etiquetas', count: { $sum: 1 } } },
        { $sort: { count: -1 } }
    ]);
};

modeloTienda.statics.mejoresTiendas = function () {
    return this.aggregate([
        { $lookup: { from: 'calificaciones', localField: '_id', foreignField: 'tienda', as: 'calificaciones' }},
        { $match: { 'calificaciones.4': { $exists: true } }},
        { $project: { foto: '$$ROOT.foto', nombre: '$$ROOT.nombre', calificaciones: '$$ROOT.calificaciones', 
        slug: '$$ROOT.slug', calificacionPromedio: { $avg: '$calificaciones.calificacion' }
    } },
        { $sort: { calificacionPromedio: -1 }}
    ]);
}

modeloTienda.virtual('calificaciones', {
    ref: 'Calificaciones',
    localField: '_id',
    foreignField: 'tienda'
});

function autopopulate(next) {
    this.populate('calificaciones');
    next();
};

modeloTienda.pre('find', autopopulate);
modeloTienda.pre('findOne', autopopulate);

module.exports = mongoose.model('Tienda', modeloTienda);