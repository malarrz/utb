import '../sass/style.scss';

import { $, $$ } from './modules/bling';
import autocompletar from './modules/autocompletar';

autocompletar( $('#direccion'), $('#latitud'), $('#longitud') );