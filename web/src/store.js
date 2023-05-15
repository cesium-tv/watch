import axios from 'axios';
import Vue from 'vue'
import Vuex from 'vuex'
import { API_URL } from '@/config';
import utils from '@/utils';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    auth: null,
    channels: null,
    videos: null,
    options: null,
  },

  getters: {
    isAuthenticated(state) {
      return state.auth;
    },

    currentUser(state) {
      return state.auth.user;
    },

    channels(state) {
      return state.channels;
    },

    videos(state) {
      return state.videos;
    },

    getVideosByChannel: (state, getters) => (channel_uid) => {
      if (!state.videos) {
        return [];
      }
      return state.videos;
      return state.videos.filter(o => o.channel === channel_uid);
    },
  },

  mutations: {
    SET_AUTH(state, auth) {
      if (!auth || !auth.token) {
        axios.defaults.headers.common = {};
      } else {
        axios.defaults.headers.common = {
          Authorization: `Bearer ${auth.token.access_token}`,
        };
      }
      state.auth = auth;
    },

    SET_CHANNELS(state, channels) {
      state.channels = channels;
    },

    SET_VIDEOS(state, videos) {
      state.videos = videos;
    }
  },

  actions: {
    async login({ dispatch }, credentials) {
      let r;
      r = await axios.get(utils.urlJoin(API_URL, '/oauth-clients/local/'));
      const { client_id, client_secret } = r.data;
      const params = new URLSearchParams();
      params.append('client_id', client_id);
      params.append('client_secret', client_secret);
      params.append('grant_type', 'password');
      params.append('username', credentials.username);
      params.append('password', credentials.password);
      r = await axios.post(utils.urlJoin(API_URL, '/users/token/'), params);
      await dispatch('whoami', r.data);
      if (credentials.remember) {
        localStorage.setItem('cesium.tv-token', JSON.stringify(r.data));
      } else {
        localStorage.removeItem('cesium.tv-token');
      }
    },

    async whoami({ commit }, token) {
      if (!token) {
        commit('SET_AUTH', false);
        return;
      }
      let r = await axios.get(utils.urlJoin(API_URL, '/users/me/'), {
        headers: {
          Authorization: `Bearer ${token.access_token}`,
        },
      });
      commit('SET_AUTH', {
        token,
        user: r.data,
      });
    },

    async logout({ commit }) {
      await axios.post(utils.urlJoin(API_URL, '/users/revoke-token/'));
      commit('SET_AUTH', false);
      localStorage.removeItem('cesium.tv-token');
    },

    async updateChannels({ commit }) {
      let r = await axios.get(utils.urlJoin(API_URL, '/channels/'));
      commit('SET_CHANNELS', r.data.results);
    },

    async updateVideos({ commit }) {
      let r = await axios.get(
        utils.urlJoin(API_URL, `/videos/`),
        { params: { 'count': 1000 }}
      );
      commit('SET_VIDEOS', r.data.results );
    },

    async getVideoDetails(_, { video_id }) {
      let r = await axios.get(utils.urlJoin(API_URL, `/videos/${video_id}/`));
      return r.data;
    }
  },
})
