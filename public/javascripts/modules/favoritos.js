import axios from 'axios';
import { $ } from './bling';

function ajaxHeart(e) {
    e.preventDefault();
    axios
        .post(this.action)
        .then(res => {
            const esFavorito = this.heart.classList.toggle('heart__button--hearted');
            $('.heart-count').textContent = res.data.favoritos.length;
            if (esFavorito) {
                this.heart.classList.add('heart__button--float');
                setTimeout(() => this.heart.classList.remove('heart_button--float'), 2000);
            }
        })
        .catch(console.error);
}

export default ajaxHeart;