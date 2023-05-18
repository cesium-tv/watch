import axios from 'axios';
import { API_URL } from '@/config';
import store from '@/store';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = store.getters.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token.access_token}`;
    }

    return config;
  },
  error => Promise.reject(error)
)

api.interceptors.response.use(
  response => {
    return response;
  },
  async (error) => {
    if (error.response.status === 403) {
      store.dispatch('refresh')
    }
  }
)

export default api;
