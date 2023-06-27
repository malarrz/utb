import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocompletar from './modules/autocompletar';
import textoBusqueda from './modules/textoBusqueda';
import crearMapa from './modules/mapa';
import ajaxHeart from './modules/favoritos';

autocompletar( $('#direccion'), $('#latitud'), $('#longitud') );

textoBusqueda( $('.search') );

crearMapa( $('#map') );

const heartForms = $$('form.heart');
heartForms.on('submit', ajaxHeart);