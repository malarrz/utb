const axios = require('axios');

function resultadosBusquedaHTML(tiendas) {
    return tiendas.map(tienda => {
        return `
            <a href="/tiendas/${tienda.slug}" class="search__result">
                <strong>${tienda.nombre}</strong>
            </a>
        `;
    }).join('');
}

function textoBusqueda(search) {
    if (!search) return;

    const busquedaTexto = search.querySelector('input[name="search"]');
    const busquedaResultados = search.querySelector('.search__results');

    busquedaTexto.on('input', function() {
        if(!this.value) {
            busquedaResultados.style.display = 'none';
            return;
        }

        busquedaResultados.style.display = 'block';

        axios
            .get(`/api/search?q=${this.value}`)
            .then(res => {
                if (res.data.length) {
                    busquedaResultados.innerHTML = resultadosBusquedaHTML(res.data);
                }
            });
    });
};

export default textoBusqueda;