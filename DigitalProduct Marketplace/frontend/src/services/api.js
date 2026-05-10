import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Double check this matches your Spring Boot port
});

export default api;