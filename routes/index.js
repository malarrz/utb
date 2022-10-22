const express = require('express');
const router = express.Router();
const controladorTienda = require('../controladores/controladorTienda');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', controladorTienda.homePage);
router.get('/agregar', controladorTienda.agregarTienda);
router.post('/agregar', catchErrors(controladorTienda.crearTienda));

module.exports = router;
