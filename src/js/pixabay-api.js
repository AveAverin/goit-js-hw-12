import axios from 'axios';

function getImagesByQuery(query) {
  const URL = "https://pixabay.com/api/";
  const API_KEY = "53365045-d30e2460a35774e20f4e732a7";

  const params = new URLSearchParams({
    key: API_KEY,
    q: query,
    image_type: "photo",
    orientation: "horizontal",
    safesearch: true,
  });

  return axios.get(`${URL}?${params}`).then(res => res.data);
}

export default getImagesByQuery;