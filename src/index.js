const qs = s => document.querySelector(s);
const gallery = qs('.gallery');
const searchInput = qs("input[name='searchQuery'");
const searchButton = qs("button[type='submit']");
const API_KEY = '35179446-da44dc90e10e26fd33ade72cd';
const axios = require('axios').default;
import SimpleLightbox from 'simplelightbox';
let galleryItems = [];
import 'simplelightbox/dist/simple-lightbox.min.css';

const sendGetRequest = async e => {
  try {
    const resp = await axios.get(e);
    galleryItems = resp.data.hits;
  } catch (err) {
    console.error(err);
  }
};

searchButton.addEventListener('click', async e => {
  e.preventDefault();
  let encodedSearchValue = await encodeURIComponent(searchInput.value);
  let URL =
    'https://pixabay.com/api/?key=' +
    API_KEY +
    '&q=' +
    encodedSearchValue +
    '&image_type=photo&orientation=horizontal&safesearch=true';
  await sendGetRequest(URL);
  console.log(galleryItems);
  const markup = galleryItems
    .map(
      galleryItem => `<div class="photo-card">
  <a class="gallery__item" href="${galleryItem.largeImageURL}"><img class="gallery__image" src="${galleryItem.webformatURL}" alt="${galleryItem.tags}" loading="lazy" /></a>
  <div class="info">
    <p class="info-item">
      <b>Likes: </b>${galleryItem.likes}
    </p>
    <p class="info-item">
      <b>Views: </b>${galleryItem.views}
    </p>
    <p class="info-item">
      <b>Comments: </b>${galleryItem.comments}
    </p>
    <p class="info-item">
      <b>Downloads: </b>${galleryItem.downloads}
    </p>
  </div>
</div>`
    )
    .join('');
  gallery.innerHTML = markup;
  let stern = new SimpleLightbox('.gallery a', {
    captions: true,
    captionDelay: 250,
    captionSelector: 'img',
    captionType: 'attr',
    captionsData: 'alt',
    captionPosition: 'bottom',
  });
});
