import axios from 'axios';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');
const API_KEY = '35914850-286d914d1efc8c48d6a511ecc';
const URL = 'https://pixabay.com/api/';
const options = {
  root: null,
  rootMargin: '300px',
  treshold: 1.0,
};
const observer = new IntersectionObserver(onPagination, options);

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
  captionDelay: 250,
});

form.addEventListener('submit', onSubmit);
gallery.addEventListener('click', onClick);

const maxPages = 12;
let currentPage = 1;
let query = '';


async function onSubmit(evt) {
  evt.preventDefault();
  query = evt.target.elements.searchQuery.value.trim();
  gallery.innerHTML = '';
  currentPage = 1;

  if (query === '') {
    return;
    }
    
  const imagies = await search(query);

  if (!imagies.hits.length) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    Notiflix.Notify.success(`Hooray! We found ${imagies.totalHits} images.`);
  }

  const markUp = await createMarkUp(imagies.hits);
  gallery.insertAdjacentHTML('beforeend', markUp);

  lightbox.refresh();
  observer.observe(guard);

    scroll();
}

async function search(query) {
  try {
    const config = {
      params: {
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        q: query,
        key: API_KEY,
        page: currentPage,
        per_page: 40,
      },
      Headers: {
        'Content-Type': 'aplication/json',
      },
    };

    const response = await axios.get(`${URL}`, config);
    const imagies = response.data;

    return imagies;
  } catch (error) {
    console.log(error);
  }
}

function createMarkUp(imagies) {
  const markUp = imagies
    .map(image => {
      const {
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `<div class="photo-card"><a href="${largeImageURL}" class="gallery__item">
      <img src="${webformatURL}" alt="${tags}" loading="lazy"  class="gallery__image"/></a>  
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Coments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
  </div>
</div>`;
    })
    .join('');
  return markUp;
}

function onClick(event) {
  event.preventDefault();
  if (!event.target.classList.contains('gallery__image')) {
    return;
  }
  lightbox.open();
}

function scroll() {
  const { height: cardHeight } =
    gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}



async function onPagination(entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      currentPage += 1;
      const imagies = await search(query);
      const markUp = await createMarkUp(imagies.hits);
      gallery.insertAdjacentHTML('beforeend', markUp);

      lightbox.refresh();
    }
    if (currentPage > maxPages) {
      observer.unobserve(guard);
    }
  });
}
