const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuarios');
const promisify = require('es6-promisify');

exports.formularioLogin = (req, res) => {
    res.render('login', { title: "Inicio de Sesión"});
};

exports.formularioRegistro = (req, res) => {
    res.render('registrarse', { title: "Registro de nuevo usuario"});
};

exports.validarRegistro = (req, res, next) => {
    req.sanitizeBody('nombre');
    req.checkBody('nombre', "Se requiere nombre de usuario").notEmpty();
    req.checkBody('email', "Dirección de Correo Electrónico no válida").isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password', "Se necesita una contraseña").notEmpty();
    req.checkBody('confirmar-password', "Se requiere confirmar la contraseña").notEmpty();
    req.checkBody('confirmar-password', "Las contraseñas no coinciden").equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
        req.flash('error', errors.map(err => err.msg));
        res.render('registrarse', { title: 'Registro de nuevo usuario', body: req.body, flashes: req.flash() });
        return;
    }
    next();
};

exports.registrar = async (req, res, next) => {
    const usuario = new Usuario({ email: req.body.email, nombre: req.body.nombre });
    const registro = promisify(Usuario.register, Usuario);
    await registro(usuario, req.body.password);
    next();
};

exports.cuenta = (req, res) => {
    res.render('cuenta', { title: 'Edita tu cuenta' });
};

exports.actualizarCuenta = async (req, res) => {
    const actualizaciones = {
        nombre: req.body.nombre, 
        email: req.body.email
    };

    const usuario = await Usuario.findOneAndUpdate(
        { _id: req.user._id }, { $set: actualizaciones }, { new: true, runValidators: true, context: 'query' }
    );
    req.flash('success', 'Datos Actualizados');
    res.redirect('back');
};