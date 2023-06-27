const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.Promise = global.Promise;
const md5 = require('md5');
const validator = require('validator');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');

const modeloUsuario = new Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        validate: [validator.isEmail, "Dirección de correo electrónico no válido"],
        required: "La dirección de correo electrónico es necesaria"
    },
    nombre: {
        type: String,
        required: "Es necesario un nombre de usuario",
        trim: true
    },
    tokenReseteo: String,
    tokenExpiracion: Date,
    favoritos: [
        { type: mongoose.Schema.ObjectId, ref: 'Tiendas' }
    ]
});

modeloUsuario.virtual('gravatar').get(function() {
    const hash = md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=200`;
});

modeloUsuario.plugin(passportLocalMongoose, { usernameField: 'email' });
modeloUsuario.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Usuarios', modeloUsuario);
