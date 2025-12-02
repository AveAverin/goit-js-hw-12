import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";

const galleryContainer = document.querySelector(".gallery");
const loaderEl = document.querySelector(".loader");

const LOADER_ACTIVE_CLASS = "is-shown";

let lightboxInstance = null;

function ensureLightbox() {
  if (!lightboxInstance) {
    lightboxInstance = new SimpleLightbox(".gallery a", {
      captionsData: "alt",
      captionDelay: 250,
    });
  } else {
    lightboxInstance.refresh();
  }
}

export function createGallery(images) {
  if (!Array.isArray(images) || images.length === 0) return;

  const markup = images
    .map(
      ({ webformatURL, largeImageURL, tags, likes, views, comments, downloads }) =>
        `<li class="gallery-item">
          <a class="gallery-link" href="${largeImageURL}">
            <img class="gallery-image" src="${webformatURL}" alt="${tags}" loading="lazy" />
          </a>
          <div class="image-stats">
            <p class="stat">Likes <span>${likes}</span></p>
            <p class="stat">Views <span>${views}</span></p>
            <p class="stat">Comments <span>${comments}</span></p>
            <p class="stat">Downloads <span>${downloads}</span></p>
          </div>
        </li>`
    )
    .join("");

  galleryContainer.insertAdjacentHTML("beforeend", markup);
  ensureLightbox();
}

export function clearGallery() {
  galleryContainer.innerHTML = "";
  if (lightboxInstance) {
    lightboxInstance.destroy();
    lightboxInstance = null;
  }
}

export function showLoader() {
  if (!loaderEl) return;
  loaderEl.classList.add(LOADER_ACTIVE_CLASS);
  loaderEl.setAttribute("aria-hidden", "false");
}

export function hideLoader() {
  if (!loaderEl) return;
  loaderEl.classList.remove(LOADER_ACTIVE_CLASS);
  loaderEl.setAttribute("aria-hidden", "true");
}