import './styles.css';
import fetchCountries from './fetchCountries.js';
import countryListItemsTemplate from './tamplate/countryListItem.hbs';
import countriesListTemplate from './tamplate/countrieList.hbs';

import { error } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import '@pnotify/confirm/dist/PNotifyConfirm.css';

import debounce from 'lodash.debounce';

const refs = {
  searchForm: document.querySelector('#search-form'),
  countryList: document.querySelector('#country-list'),
  searchInput: document.querySelector('.search__input'),
};

refs.searchForm.addEventListener(
  'input',
  debounce(e => {
    searchFormInputHandler(e);
  }, 500),
);

function searchFormInputHandler(e) {
  const searchQuery = e.target.value;

  clearListItems();
  if (!searchQuery) {
    return;
  }
  fetchCountries(searchQuery).then(data => {
    if (!data) {
      return;
    } else if (data.length >= 2 && data.length <= 10) {
      const renderCountriesList = buildCountriesList(data);
      insertListItem(renderCountriesList);
    } else if (data.length === 1) {
      const markup = buildListItemMarkup(data);
      insertListItem(markup);
    } else if (data.length >= 10) {
      PNotify();
    }
  });
}

function PNotify() {
  error({
    title: 'Найдено слишком много совпадений!',
    text: 'Пожалуйста, введите более конкретный запрос!',
    delay: 750,
  });
}

function insertListItem(items) {
  refs.countryList.insertAdjacentHTML('beforeend', items);
}

function buildCountriesList(items) {
  return countriesListTemplate(items);
}

function buildListItemMarkup(items) {
  return countryListItemsTemplate(items);
}

function clearListItems() {
  refs.countryList.innerHTML = '';
}
