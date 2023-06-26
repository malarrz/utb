import axios from 'axios';
import { $ } from './bling';

const opcionesMapa = {
    center: { lat: -16.5033447, lng: -68.1290321 },
    zoom: 12
};

function cargarLugares(map, lat = -16.50, lng = -68.12) {
    axios.get(`/api/tiendas/cerca?lat=${lat}&lng=${lng}`)
        .then(res => {
            const lugares = res.data;
            if (!lugares.length) {
                alert('No se encontró ningún lugar');
                return;
            }

            const limites = new google.maps.LatLngBounds();

            const marcadores = lugares.map(place => {
                const [lugarLng, lugarLat] = place.ubicacion.coordenadas;
                const position =  { lat: lugarLat, lng: lugarLng };
                limites.extend(position);
                const marcador = new google.maps.Marker({ map, position });
                marcador.place = place;
                return marcador;
            });

            map.setCenter(limites.getCenter());
            map.fitBounds(limites);
        });
}

function crearMapa(mapDiv) {
    if(!mapDiv) return;

    const map = new google.maps.Map(mapDiv, opcionesMapa);
    cargarLugares(map);

    const busqueda = $('[name="geolocacion"]');
    const autocompletarBusqueda = new google.maps.places.Autocomplete(busqueda);
}

export default crearMapa;