import axios from 'axios';
import store from '@/store';
import { API_URL } from '@/config';

const api = axios.create({
    baseURL: API_URL,
});

function isNetworkError(error) {
    return ['ECONNABORTED', 'ERR_NETWORK'].includes(error.code);
}

api.interceptors.request.use(
    async (config) => {
        // TODO: handle auth token?
        store.dispatch('network/startRequest');
        return config;
    },
    error => {
        store.dispatch('network/endRequest');
        if (isNetworkError(error)) {
            store.dispatch('network/timeout', error);
        }
        console.error('Error in request');
        console.error(error);
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    response => {
        store.dispatch('network/endRequest');
        store.dispatch('network/recover');
        return response;
    },
    async (error) => {
        store.dispatch('network/endRequest');
        if (isNetworkError(error)) {
            store.dispatch('network/timeout', error);
        }
        console.error('Error in response');
        console.error(error);
        return Promise.reject(error);
    }
);

export default api;
