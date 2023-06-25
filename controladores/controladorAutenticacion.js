const passport = require('passport');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Usuario = mongoose.model('Usuarios');
const promisify = require('es6-promisify');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Error en la autenticación',
    successRedirect: '/',
    successFlash: 'Autenticación exitosa'
});

exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'Acabas de cerrar sesión');
    res.redirect('/');
};

exports.esUsuario = (req, res, next) => {
    if (req.isAuthenticated()) {
        next();
        return;
    }
    req.flash('error', 'Debes iniciar sesión para continuar');
    res.redirect('/login');
};

exports.resetContrasena = async (req, res) => {
    const usuario = await Usuario.findOne({ email: req.body.email });
    if (!usuario) {
        req.flash('error', 'La Dirección de Correo Electrónico no se encuentra registrada');
        return res.redirect('/login');
    }

    usuario.tokenReseteo = crypto.randomBytes(20).toString('hex');
    usuario.tokenExpiracion = Date.now() + 1800000; // media hora para expirar
    await usuario.save();

    const urlReseteo = `http://${req.headers.host}/cuenta/reseteo/${usuario.tokenReseteo}`;
    req.flash('success', `Para reestablecer su contraseña, ingrese al siguiente link: ${urlReseteo}`);

    res.redirect('/login');
};

exports.reseteo = async (req, res) => {
    //Verificar token y si no ha expirado
    const usuario = await Usuario.findOne({
        tokenReseteo: req.params.token,
        tokenExpiracion: { $gt: Date.now() }
    });
    if (!usuario) {
        req.flash('error', 'El enlace de reseteo es inválido o ha expirado');
        return res.redirect('/login');
    }
    res.render('reseteo', { title: 'Reestablece tu Contraseña'});
};

exports.contrasenasConfirmadas = (req, res, next) => {
    if (req.body.password === req.body['confirmar-password']) {
        next();
        return;
    }
    req.flash('error', 'Las Contraseñas no coinciden');
    res.redirect('back');
};

exports.actualizarContrasena = async (req, res) => {
    const usuario = await Usuario.findOne({
        tokenReseteo: req.params.token,
        tokenExpiracion: { $gt: Date.now() }
    });
    if (!usuario) {
        req.flash('error', 'El enlace de reseteo es inválido o ha expirado');
        return res.redirect('/login');
    }

    const establecerContrasena = promisify(usuario.setPassword, usuario);
    await establecerContrasena(req.body.password);
    usuario.tokenReseteo = undefined;
    usuario.tokenExpiracion = undefined;
    const usuarioActualizado = await usuario.save();
    await req.login(usuarioActualizado);
    req.flash('success', 'Tu contraseña ha sido actualizada y se ha iniciado sesión');
    res.redirect('/');
};