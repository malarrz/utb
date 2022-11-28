const passport = require('passport');

exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Error en la autenticación',
    successRedirect: '/',
    successFlash: 'Autenticación exitosa'
});