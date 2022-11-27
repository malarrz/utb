const express = require('express');
const router = express.Router();
const controladorTienda = require('../controladores/controladorTienda');
const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(controladorTienda.mostrarTiendas));
router.get('/tiendas', catchErrors(controladorTienda.mostrarTiendas));  
router.get('/agregar', controladorTienda.agregarTienda);
router.post('/agregar', controladorTienda.upload, catchErrors(controladorTienda.redimensionar), 
catchErrors(controladorTienda.crearTienda));
router.post('/agregar/:id', catchErrors(controladorTienda.modificarTienda));
router.get('/tiendas/:id/editar', catchErrors(controladorTienda.editarTienda));
router.get('/tiendas/:slug', catchErrors(controladorTienda.mostrarTienda));
router.get('/etiquetas', catchErrors(controladorTienda.tiendasPorEtiqueta));
router.get('/etiquetas/:etiqueta', catchErrors(controladorTienda.tiendasPorEtiqueta))

module.exports = router;
