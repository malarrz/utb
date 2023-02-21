const passport = require('passport');

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