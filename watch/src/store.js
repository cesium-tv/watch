import axios from 'axios';
import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/services/api';
import utils from '@/utils';
import { API_URL, CLIENT_ID, CLIENT_SECRET } from '@/config';

Vue.use(Vuex)

let auth = localStorage.getItem('auth');
console.debug('Read auth info from localStorage', auth)
if (auth) {
  auth = JSON.parse(auth);
}

const store = new Vuex.Store({
  state: {
    auth,
    user: null,
    channels: null,
    videos: null,
    options: null,
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

    channels(state) {
      return state.channels;
    },

    videos(state) {
      return state.videos;
    },

    getVideosByChannel: (state) => (channel_uid) => {
      if (!state.videos) {
        return [];
      }
      //return state.videos;
      return state.videos.filter(o => o.channel.uid === channel_uid);
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

    SET_CHANNELS(state, channels) {
      state.channels = channels;
    },

    SET_VIDEOS(state, videos) {
      state.videos = videos;
    }
  },

  actions: {
    async login({ commit }, credentials) {
      const params = new URLSearchParams();
      params.append('client_id', CLIENT_ID);
      params.append('client_secret', CLIENT_SECRET);
      params.append('grant_type', 'password');
      params.append('username', credentials.username);
      params.append('password', credentials.password);
      const r = await api.post('/users/token/', params);
      commit('SET_AUTH', r.data);
    },

    async device({ commit }, device_code) {
      const data = new URLSearchParams();
      data.append('grant_type', 'urn:ietf:params:oauth:grant-type:device_code');
      data.append('client_id', CLIENT_ID);
      data.append('client_secret', CLIENT_SECRET);
      data.append('device_code', device_code);

      // Use global private instance to avoid triggering loading component.
      const r = await axios
        .post(utils.urlJoin(API_URL, '/oauth2/token/'), data);
      commit('SET_AUTH', r.data);
    },

    async refresh({ state, commit }) {
      const data = new URLSearchParams();
      data.append('grant_type', 'refresh_token');
      data.append('client_id', CLIENT_ID);
      data.append('client_secret', CLIENT_SECRET);
      data.append('refresh_token', state.auth.refresh_token);

      // Use global private instance to avoid triggering loading component.
      const r = await axios
        .post(utils.urlJoin(API_URL, '/oauth2/token/'), data);
      commit('SET_AUTH', r.data);
    },

    async whoami({ commit }) {
      console.log('Checking user');
      let r = await api.get('/users/whoami/');
      commit('SET_USER', r.data);
      return r.status == 200;
    },

    async logout({ commit }) {
      await api.post('/users/revoke-token/');
      commit('SET_AUTH', false);
      commit('SET_USER', null);
      localStorage.removeItem('cesium.tv-token');
    },

    async updateChannels({ commit }) {
      let r = await api.get('/channels/');
      commit('SET_CHANNELS', r.data.results);
    },

    async updateVideos({ commit }) {
      let r = await api.get(`/videos/`,
        { params: { 'count': 1000 }}
      );
      commit('SET_VIDEOS', r.data.results );
    },

    async getVideoDetails(_, { video_id }) {
      let r = await api.get(`/videos/${video_id}/`);
      return r.data;
    }
  },
});

export default store;
