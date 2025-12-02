import getImagesByQuery from './js/pixabay-api.js';
import { clearGallery, showLoader, hideLoader, createGallery } from './js/render-functions.js';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');
const submitBtn = form.querySelector('button[type=submit]');
const input = form.querySelector('input[name="search-text"]');

submitBtn.disabled = true;

input.addEventListener('input', evt => {
  submitBtn.disabled = evt.target.value.trim() === '';
});

form.addEventListener('submit', evt => {
  evt.preventDefault();
  const searchWord = input.value.trim();

  if (!searchWord) {
    iziToast.warning({
      title: 'Warning',
      message: 'Please enter a search query',
      position: 'topRight',
    });
    return;
  }

  clearGallery();
  showLoader();
  submitBtn.disabled = true;

  getImagesByQuery(searchWord)
    .then(data => {
      const images = data.hits;

      if (!images.length) {
        iziToast.error({
          title: 'No results',
          message: 'Sorry, there are no images matching your search query. Please try again!',
          position: 'topRight',
        });
        return;
      }

      createGallery(images);
    })
    .catch(() => {
      iziToast.error({
        title: 'Error',
        message: 'Something went wrong. Please try again later.',
        position: 'topRight',
      });
    })
    .finally(() => {
      hideLoader();
      form.reset();
      submitBtn.disabled = true;
    });
});