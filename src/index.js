import axios from 'axios';
import Notiflix from 'notiflix';

const form = document.querySelector('.search-form');
const gallery = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');
const API_KEY = '35914850-286d914d1efc8c48d6a511ecc';
const URL = 'https://pixabay.com/api/';

form.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', onClick);

let currentPage = 1;
let query = '';


function onSubmit(evt) {
  evt.preventDefault();
  query = evt.target.elements.searchQuery.value.trim();
    loadMoreBtn.hidden = true;
    gallery.innerHTML = "";
    currentPage = 1;

  if (query === '') {
    return;
  }

  search(query).then(imagies => {
    createMarkUp(imagies.hits);

    if (imagies.hits.length >= 40) {
      loadMoreBtn.hidden = false;
    } else if (currentPage > 12) {
      loadMoreBtn.hidden = true;
    }
  });
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

    if (!imagies.hits.length) {
      Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      Notiflix.Notify.success(`Hooray! We found ${imagies.totalHits} images.`);
    }
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
      return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" width="300" min-height="300"/>
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
    .join();
  gallery.insertAdjacentHTML('beforeend', markUp);
}

function onClick() {
  currentPage += 1;
  console.log(currentPage);
  search(query).then(imagies => createMarkUp(imagies.hits));
}
