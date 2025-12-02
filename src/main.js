import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

import getImagesByQuery, { PER_PAGE } from './js/pixabay-api.js';
import {
  createGallery,
  clearGallery,
  showLoader,
  hideLoader,
  showLoadMoreButton,
  hideLoadMoreButton,
  getGalleryFirstCardHeight,
} from './js/render-functions.js';

const form = document.querySelector('.form');
const submitBtn = form.querySelector('button[type=submit]');
const input = form.querySelector('input[name="search-text"]');
const loadMoreBtn = document.querySelector('.load-more');

let currentQuery = '';
let page = 1;
let totalHits = 0;

submitBtn.disabled = true;

input.addEventListener('input', evt => {
  submitBtn.disabled = evt.target.value.trim() === '';
});

form.addEventListener('submit', async evt => {
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

  currentQuery = searchWord;
  page = 1;
  totalHits = 0;

  clearGallery();
  hideLoadMoreButton();
  showLoader();
  submitBtn.disabled = true;

  try {
    const data = await getImagesByQuery(currentQuery, page);
    const images = data.hits;
    totalHits = data.totalHits || 0;

    if (!images.length) {
      iziToast.error({
        title: 'No results',
        message:
          'Sorry, there are no images matching your search query. Please try again!',
        position: 'topRight',
      });
      return;
    }

    createGallery(images);

    if (totalHits > page * PER_PAGE) {
      showLoadMoreButton();
    } else {
      hideLoadMoreButton();
      iziToast.info({
        title: 'Info',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
    form.reset();
    submitBtn.disabled = true;
  }
});

loadMoreBtn.addEventListener('click', async () => {
  page += 1;
  showLoader();
  hideLoadMoreButton();

  try {
    const data = await getImagesByQuery(currentQuery, page);
    const images = data.hits;
    createGallery(images);

    const loadedItems = page * PER_PAGE;
    if (loadedItems >= (data.totalHits || totalHits)) {
      hideLoadMoreButton();
      iziToast.info({
        title: 'End',
        message: "We're sorry, but you've reached the end of search results.",
        position: 'topRight',
      });
    } else {
      showLoadMoreButton();
    }

    const cardHeight = getGalleryFirstCardHeight();
    if (cardHeight) {
      window.scrollBy({
        top: cardHeight * 2,
        behavior: 'smooth',
      });
    }
  } catch (error) {
    console.error(error);
    iziToast.error({
      title: 'Error',
      message: 'Something went wrong. Please try again later.',
      position: 'topRight',
    });
  } finally {
    hideLoader();
  }
});
