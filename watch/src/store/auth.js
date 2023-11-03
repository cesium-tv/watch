import api from '@/services/api';
import { CLIENT_ID, CLIENT_SECRET } from '@/config';

let auth = localStorage.getItem('auth');
console.debug('Read auth info from localStorage', auth)
if (auth) {
  auth = JSON.parse(auth);
}

export default {
  namespaced: true,

  state: {
    auth,
    user: null,
  },

  getters: {
    isAuthenticated(state) {
      return Boolean(state.auth);
    },

    currentUser(state) {
      return state.user;
    },

    token(state) {
      return state.auth;
    },
  },

  mutations: {
    SET_AUTH(state, auth) {
      if (!auth) {
        console.debug('Removing Authorization header');
        localStorage.removeItem('auth');
      } else {
        console.debug('Setting Authorization header');
        localStorage.setItem('auth', JSON.stringify(auth));
      }

      state.auth = auth;
    },

    SET_USER(state, user) {
      state.user = user;
    },
  },

  actions: {
    async login({ commit }, credentials) {
      const params = new URLSearchParams();
      params.append('client_id', CLIENT_ID);
      params.append('client_secret', CLIENT_SECRET);
      params.append('grant_type', 'password');
      params.append('email', credentials.email);
      params.append('password', credentials.password);
      const r = await api.post('/oauth2/token/', params);
      commit('SET_AUTH', r.data);
    },

    async device({ commit }, device_code) {
      const data = new URLSearchParams();
      data.append('grant_type', 'urn:ietf:params:oauth:grant-type:device_code');
      data.append('client_id', CLIENT_ID);
      data.append('client_secret', CLIENT_SECRET);
      data.append('device_code', device_code);

      // Use global private instance to avoid triggering loading component.
      const r = await api
        .post('/oauth2/token/', data);
      commit('SET_AUTH', r.data);
    },

    async refresh({ state, getters, commit }) {
      if (!getters.isAuthenticated) return;

      const data = new URLSearchParams();
      data.append('grant_type', 'refresh_token');
      data.append('client_id', CLIENT_ID);
      data.append('client_secret', CLIENT_SECRET);
      data.append('refresh_token', state.auth.refresh_token);

      // Use global private instance to avoid triggering loading component.
      const r = await api
        .post('/oauth2/token/', data);
      commit('SET_AUTH', r.data);
    },

    async whoami({ commit }) {
      console.log('Checking user');
      let r = await api.get('/users/whoami/');
      commit('SET_USER', r.data);
      return r.status == 200;
    },

    async logout({ commit }) {
      await api.post('/oauth2/revoke-token/');
      commit('SET_AUTH', false);
      commit('SET_USER', null);
      localStorage.removeItem('cesium.tv-token');
    },
  },
};
