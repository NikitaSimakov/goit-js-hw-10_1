import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, 300));

function onInput(event) {
  const countryName = event.target.value.trim();
  if (countryName.trim() === '') {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
  }
  if (!countryName) {
    Notify.info('Turn the country name, please!');
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }
  fetchingCards(countryName);
  // fetchCountries(countryName.trim()).then(data => {
  //   console.log(data);
  //   if (!data) {
  //     Notify.info('Something goes wrong');
  //     return;
  //   }
  //   if (data.length >= 10) {
  //     Notify.info('Too many matches found. Please enter a more specific name.');
  //     refs.countryList.innerHTML = '';
  //   }
  //   if (data.length > 2 && data.length <= 10) {
  //     createMarkupList(data);
  //   }
  //   if (data.length === 1) {
  //     createMarkupCard(data);
  //   }
  // });
}

function fetchingCards(countryName) {
  fetchCountries(countryName.trim()).then(data => {
    console.log(data);
    if (!data) {
      Notify.info('Something goes wrong');
      return;
    }
    if (data.length >= 10) {
      Notify.info('Too many matches found. Please enter a more specific name.');
      refs.countryList.innerHTML = '';
    }
    if (data.length >= 2 && data.length <= 10) {
      createMarkupList(data);
    }
    if (data.length === 1) {
      createMarkupCard(data);
    }
  });
}

function createMarkupCard(arr) {
  const markup = arr
    .map(
      item => `<div class="country">
      <img class = "capital-flag" src="${item.flags.svg}" alt="${
        item.name.official
      }" width="30%"/>
      <h2 class = "country-title">Country: ${item.name.official}</h2>
      <p class = "country-text">Capital: ${item.capital}</p>
      <p class="country-text">Population: ${item.population}</p>
      <p class="country-text">Languages: ${Object.values(item.languages)}</p>
    </div>`
    )
    .join('');
  refs.countryInfo.innerHTML = markup;
  refs.countryList.innerHTML = '';
}

function createMarkupList(arr) {
  const markup = arr
    .map(
      item => `
      <li class = country-item>
      <img class = 'country-list__flags' src="${item.flags.svg}" alt="${item.name.official}" width="20%"/>
      <h2 class = country-list__name>${item.name.official}</h2>
      </li>
      `
    )
    .join('');
  refs.countryList.innerHTML = markup;
  refs.countryInfo.innerHTML = '';
}
