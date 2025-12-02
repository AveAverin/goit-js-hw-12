import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '53365045-d30e2460a35774e20f4e732a7';
const PER_PAGE = 15;

async function getImagesByQuery(query, page = 1) {
  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
    per_page: PER_PAGE,
    page,
  });

  const url = `${BASE_URL}?${params.toString()}`;

  const response = await axios.get(url);
  return response.data;
}

export { getImagesByQuery, PER_PAGE };
export default getImagesByQuery;