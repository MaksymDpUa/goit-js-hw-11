
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { search } from './helpers/search';
import { createMarkUp } from './helpers/createMarkUp';
import { scroll } from './helpers/scroll';
// import { onClick } from './helpers/onClick';
import { startMarkUp } from './helpers/startMarkUp';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const guard = document.querySelector('.js-guard');


const options = {
  root: null,
  rootMargin: '300px',
  treshold: 1.0,
};
const observer = new IntersectionObserver(onPagination, options);

const lightbox = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
    captionDelay: 250,
  elementsSelector: 'a[data-lightbox]',
});

form.addEventListener('submit', onSubmit);
gallery.addEventListener('click', onClick);

const maxPages = 12;
let currentPage = 1;
let query = '';
console.log(query);

// startMarkUp(gallery, guard);

async function onSubmit(evt) {
  evt.preventDefault();
  query = evt.target.elements.searchQuery.value.trim();
  console.log(query);
  currentPage = 1;
    observer.unobserve(guard);
    if (!query) {
        
        Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    )
    return;
    }
    gallery.innerHTML = '';
  const imagies = await search(query, currentPage);

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

    // scroll();
}

async function onPagination(entries, observer) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      currentPage += 1;
      const imagies = await search(query, currentPage);
      const markUp = await createMarkUp(imagies.hits);
      gallery.insertAdjacentHTML('beforeend', markUp);

      lightbox.refresh();
    }
      if (currentPage > maxPages) {
          setTimeout(Notiflix.Notify.info('Sorry, there are no images matching your search query. Please try again.'), 1500); 
      observer.unobserve(guard);
    }
  });
}


function onClick(event) {
  event.preventDefault();
  if (!event.target.classList.contains('gallery__image')) {
    return;
  }
  lightbox.open();
}






