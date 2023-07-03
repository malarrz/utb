import axios from 'axios';
import { $ } from './bling';

const opcionesMapa = {
    center: { lat: -16.50, lng: -68.12 },
    zoom: 10
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

            const ventanaTienda = new google.maps.InfoWindow();

            const marcadores = lugares.map(place => {
                const [lugarLng, lugarLat] = place.ubicacion.coordenadas;
                const position =  { lat: lugarLat, lng: lugarLng };
                limites.extend(position);
                const marcador = new google.maps.Marker({ position, map });
                marcador.place = place;
                return marcador;
            });

            marcadores.forEach(marker => marker.addListener('click', function() {
                const html = `
                    <div class="popup">
                        <a href="/tiendas/${this.place.slug}">
                            <img src="/uploads/${this.place.foto || 'tienda.png' }" alt="${this.place.nombre}" />
                            <p>${this.place.nombre} - ${this.place.ubicacion.direccion}</p>
                        </a>
                    </div>
                `;
                ventanaTienda.setContent(html);
                ventanaTienda.open(map, this);
            }));

            map.setCenter(limites.getCenter());
            map.fitBounds(limites);
        });
};

function crearMapa(mapDiv) {
    if(!mapDiv) return;

    const map = new google.maps.Map(mapDiv, opcionesMapa);
    cargarLugares(map);

    const busqueda = $('[name="geolocacion"]');
    const autocompletar = new google.maps.places.Autocomplete(busqueda);
    autocompletar.addListener('place_changed', () => {
        const place = autocompletar.getPlace();
        cargarLugares(map, place.geometry.location.lat(), place.geometry.location.lng());
    });
};

export default crearMapa;