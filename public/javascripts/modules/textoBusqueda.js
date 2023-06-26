import axios from 'axios';
import dompurify from 'dompurify';

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
                    busquedaResultados.innerHTML = dompurify.sanitize(resultadosBusquedaHTML(res.data));
                    return;
                }
                busquedaResultados.innerHTML = dompurify.sanitize(`<div class="search__result">No hay resultados de la búsqueda '${this.value}'</div>`);
            })
            .catch(err => {
                console.error(err);
            });
    });
    //Navegación de la búsqueda con teclado arriba, abajo, enter
    busquedaTexto.on('keyup', (e) => {
        if (![38, 40, 13].includes(e.keyCode)) {
          return;
        }
        const activeClass = 'search__result--active';
        const current = search.querySelector(`.${activeClass}`);
        const items = search.querySelectorAll('.search__result');
        let next;
        if (e.keyCode === 40 && current) {
          next = current.nextElementSibling || items[0];
        } else if (e.keyCode === 40) {
          next = items[0];
        } else if (e.keyCode === 38 && current) {
          next = current.previousElementSibling || items[items.length - 1]
        } else if (e.keyCode === 38) {
          next = items[items.length - 1];
        } else if (e.keyCode === 13 && current.href) {
          window.location = current.href;
          return;
        }
        if (current) {
          current.classList.remove(activeClass);
        }
        next.classList.add(activeClass);
      });
    }

export default textoBusqueda;