const express = require('express');
const router = express.Router();
const controladorTienda = require('../controladores/controladorTienda');

router.get('/', controladorTienda.homePage);

module.exports = router;
