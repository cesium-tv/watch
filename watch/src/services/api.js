import axios from 'axios';
import { API_URL } from '@/config';
import store from '@/store';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = store.getters['auth/token'];

    store.dispatch('playing/busy');
    if (token) {
      config.headers.Authorization = `Bearer ${token.access_token}`;
    }

    return config;
  },
  error => {
    store.dispatch('playing/idle');
    Promise.reject(error);
  }
)

api.interceptors.response.use(
  response => {
    store.dispatch('playing/idle');
    return response;
  },
  async (error) => {
    console.error(error);
    store.dispatch('playing/idle');

    if (error.response.status === 403) {
      store.dispatch('refresh')
    }
  }
)

export default api;
