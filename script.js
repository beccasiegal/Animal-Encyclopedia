'use strict'

const corsUrl = 'https://cors-anywhere.herokuapp.com/';
const searchUrl = 'https://en.wikipedia.org/w/api.php';
const photoUrl = 'https://pixabay.com/api/';


function displayResults(responseJson) {
  console.log(responseJson);
  // stack overflow link: https://stackoverflow.com/questions/32208902/get-the-value-of-an-object-with-an-unknown-single-key-in-js
  const pageObj = responseJson.query.pages;
  const data = pageObj[Object.keys(pageObj)[0]];
  const image = data.original ? `<img src = ${data.original.source} alt = ${data.title}>`: "";
  console.log(image);
  $('#results-list').empty();
  $('#results-list').append(`
     <h2>${data.title}</h2>
     ${data.extract}   
      <p><a href = "https://en.wikipedia.org/wiki/${data.title}"> Click to see more</a></p>
      ${image} `)
  $('#results').removeClass('hidden');
}

function getAnimalInfo(query) {
  const params = {
    action: 'query',
    prop: 'extracts|pageimages',
    format: 'json',
    piprop: 'original',
    exchars: 500,
    titles: query,

  };


  const queryString = formatQueryParams(params)
  const url = corsUrl + searchUrl + '?' + queryString;
  console.log(url);


  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .then(() => getAnimalPhotos(query))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });

}
function formatQueryParams(params) {
  const queryItems = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
  return queryItems.join('&');
}

function getAnimalPhotos(query) {
  const paramsPhotos = {
    key: '12715167-87f83a71ab32a82132cd94d80',
    q: query,
    image_type: 'photo',
  }

  const queryString = formatQueryParams(paramsPhotos)
  const url = corsUrl + photoUrl + '?' + queryString;
  console.log(url);
  

  fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.statusText);
    })
    .then(responseJson => displayPhotos(responseJson))
    .catch(err => {
      $('#js-error-message').text(`Something went wrong: ${err.message}`);
    });
}

function displayPhotos(responseJson) {
  $('#photo-results').empty();
  const imageHits = responseJson.hits;
  for (let i = 0; i < imageHits.length; i++) {
    $('#photo-results').append(
      `<img src = ${imageHits[i].webformatURL} alt = ${imageHits[i].tags}>`
    )
    $('#results').removeClass('hidden');
  }
}

function watchForm() {
  $('form').submit(event => {
    event.preventDefault();
    $(`#results-list`).empty();
    const searchTerm = $('#js-search-term').val();
    getAnimalInfo(searchTerm);

  });
}

$(watchForm);
