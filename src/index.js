//SELECTORS
const qs = s => document.querySelector(s);
const gallery = qs('.gallery');
const searchInput = qs("input[name='searchQuery'");
const searchButton = qs("button[type='submit']");
const loadMore = qs('.load-more');
loadMore.style.display = 'none';

// API VARS
const API_KEY = '35179446-da44dc90e10e26fd33ade72cd';
const PHOTOS_URL = 'https://pixabay.com/api/';

//IMPORTS & REQUIRE
const axios = require('axios').default;
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix, { Notify } from 'notiflix';

//SOME VARS
let galleryItems = [];
let lastPage = 0;
let totalHits = 0;
let page = 1;

//QUERY OPTIONS FOR API
let searchOptions = {
  key: API_KEY,
  q: '',
  imageType: 'photo',
  orientation: 'horizontal',
  SFW: 'true',
  page: 1,
  per_page: 40,
};

//FETCHING PHOTOS FUNCTION
const sendGetRequest = async page => {
  searchOptions.page = page;
  try {
    const resp = await axios.get(PHOTOS_URL, {
      params: searchOptions,
    });
    galleryItems = await resp.data.hits;
    totalHits = resp.data.totalHits;
    lastPage = Math.ceil(totalHits / 40);
    return galleryItems;
  } catch (err) {
    console.error(err);
    Notiflix.Notify.failure(
      `Sorry, there are no imaages matching your search query. Please try again.`
    );
  }
};
//RENDER IMAGES FUNCTION
const renderImages = galleryItems => {
  const markup = galleryItems
    .map(
      galleryItem => `<div class="photo-card">
  <a class="gallery__item" href="${galleryItem.largeImageURL}"><img class="gallery__image" src="${galleryItem.webformatURL}" alt="${galleryItem.tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: </b><br/>${galleryItem.likes}
    </p>
    <p class="info-item">
      <b>Views: </b><br/>${galleryItem.views}
    </p>
    <p class="info-item">
      <b>Comments: </b><br/>${galleryItem.comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b><br/>${galleryItem.downloads}
    </p>
  </div>
</div>`
    )
    .join('');
 gallery.insertAdjacentHTML('beforeend', markup);

  let lightbox = new SimpleLightbox('.gallery a', {
    captions: true,
    captionDelay: 250,
    captionSelector: 'img',
    captionType: 'attr',
    captionsData: 'alt',
    captionPosition: 'bottom',
  });
};

//EVENT LISTENERS

searchButton.addEventListener('click', async e => {
  e.preventDefault();
  let searchValue = searchInput.value;
  searchOptions.q = searchValue;
  galleryItems = await sendGetRequest();
  Notiflix.Notify.info(`Hooray! We found ${totalHits} images.`);
  gallery.innerHTML = '';

  renderImages(galleryItems);
  loadMore.style.display = 'block';

  if (page === lastPage) {
    loadMore.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } else if (totalHits === 0) {
    loadMore.style.display = 'none';
    Notiflix.Notify.info(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    gallery.innerHTML = '';
  }
});

loadMore.addEventListener('click', async e => {
  page += 1;
  // searchOptions.per_page += 40;
  galleryItems = await sendGetRequest(page);
  renderImages(galleryItems);
  if (page === lastPage) {
    loadMore.style.display = 'none';
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
  } else {
    loadMore.style.display = 'block';
  }
});
