const API_KEY = '35914850-286d914d1efc8c48d6a511ecc';
const URL = 'https://pixabay.com/api/';
import axios from 'axios';

async function search(query, currentPage) {
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

export { search }