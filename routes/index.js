const express = require('express');
const router = express.Router();
const controladorTienda = require('../controladores/controladorTienda');

router.get('/', controladorTienda.homePage);
router.get('/agregar', controladorTienda.agregarTienda);
router.post('/agregar', controladorTienda.crearTienda);

module.exports = router;
