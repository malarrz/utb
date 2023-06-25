const express = require('express');
const router = express.Router();
const controladorTienda = require('../controladores/controladorTienda');
const controladorUsuario = require('../controladores/controladorUsuario');
const controladorAutenticacion = require('../controladores/controladorAutenticacion');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(controladorTienda.mostrarTiendas));
router.get('/tiendas', catchErrors(controladorTienda.mostrarTiendas));  
router.get('/agregar', controladorAutenticacion.esUsuario, controladorTienda.agregarTienda);
router.post('/agregar', controladorTienda.upload, catchErrors(controladorTienda.redimensionar), 
catchErrors(controladorTienda.crearTienda));
router.post('/agregar/:id', catchErrors(controladorTienda.modificarTienda));
router.get('/tiendas/:id/editar', catchErrors(controladorTienda.editarTienda));
router.get('/tiendas/:slug', catchErrors(controladorTienda.mostrarTienda));
router.get('/etiquetas', catchErrors(controladorTienda.tiendasPorEtiqueta));
router.get('/etiquetas/:etiqueta', catchErrors(controladorTienda.tiendasPorEtiqueta))

router.get('/login', controladorUsuario.formularioLogin);
router.post('/login', controladorAutenticacion.login);
router.get('/registrarse', controladorUsuario.formularioRegistro);
router.post('/registrarse', controladorUsuario.validarRegistro, controladorUsuario.registrar, controladorAutenticacion.login);
router.get('/logout', controladorAutenticacion.logout);

router.get('/cuenta', controladorAutenticacion.esUsuario, controladorUsuario.cuenta);
router.post('/cuenta', catchErrors(controladorUsuario.actualizarCuenta));
router.post('/cuenta/reestContrasena', catchErrors(controladorAutenticacion.resetContrasena));
router.get('/cuenta/reseteo/:token', catchErrors(controladorAutenticacion.reseteo));
router.post('/cuenta/reseteo/:token', controladorAutenticacion.contrasenasConfirmadas, catchErrors(controladorAutenticacion.actualizarContrasena));

module.exports = router;