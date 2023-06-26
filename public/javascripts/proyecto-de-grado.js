import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocompletar from './modules/autocompletar';
import textoBusqueda from './modules/textoBusqueda';
import crearMapa from './modules/mapa';

autocompletar( $('#direccion'), $('#latitud'), $('#longitud') );

textoBusqueda( $('.search') );

crearMapa( $('#map') );