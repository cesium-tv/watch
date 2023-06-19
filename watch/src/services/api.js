import axios from 'axios';
import Vue from 'vue';
import { API_URL } from '@/config';
import store from '@/store';

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  async (config) => {
    const token = store.getters.token;

    Vue.prototype.$bus.$emit('busy');
    if (token) {
      config.headers.Authorization = `Bearer ${token.access_token}`;
    }

    return config;
  },
  error => {
    Vue.prototype.$bus.$emit('idle');
    Promise.reject(error);
  }
)

api.interceptors.response.use(
  response => {
    Vue.prototype.$bus.$emit('idle');
    return response;
  },
  async (error) => {
    Vue.prototype.$bus.$emit('idle');
    if (error.response.status === 403) {
      store.dispatch('refresh')
    }
  }
)

export default api;
