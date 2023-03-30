import axios from 'axios';


const token = localStorage.getItem('access_token')
const instance = axios.create({
  baseURL: 'http://127.0.0.1:8000/',
  timeout: 5000,
  headers: {'Content-Type': 'application/json',
           'Authorization': `Bearer ${token}`},
});

export default instance;