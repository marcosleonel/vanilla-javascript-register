import axios from 'axios';
import '../css/style.css';

const API_URL = 'http://localhost:3000/users';

function getUsers() {
  axios
    .get(API_URL)
    .then((response) => {
      console.info('API Response: ', response);
    })
    .catch((error) => {
      console.error('Error: ', error);
    });
}

getUsers();