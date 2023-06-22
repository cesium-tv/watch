import Vue from 'vue'
import Vuex from 'vuex'
import api from '@/services/api';
import { CLIENT_ID, CLIENT_SECRET } from '@/config';

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
      return state.videos.filter(o => o.channel.uid === channel_uid && o.is_played === false);
    },

    getPlayedVideos: (state) => {
      return state.videos.filter(o => o.is_played === true)
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
      for (const video of videos) {
        const played = localStorage.getItem(`played-${video.uid}`);
        const cursor = localStorage.getItem(`cursor-${video.uid}`);
        if (cursor) {
          video.cursor = JSON.parse(cursor);
        }
        video.is_played = (played === 'true') ? true : video.is_played;
      }
      state.videos = videos;
    },

    ADD_VIDEOS(state, videos) {
      for (const video of videos) {
        const played = localStorage.getItem(`played-${video.uid}`);
        const cursor = localStorage.getItem(`cursor-${video.uid}`);
        if (cursor) {
          video.cursor = JSON.parse(cursor);
        }
        video.is_played = (played === 'true') ? true : video.is_played;
      }
      state.videos.push(...videos);
    },

    SET_PLAYED(state, video) {
      const v = state.videos.find(v => v.uid === video.uid);
      if (v) {
        v.is_played = true;
        localStorage.setItem(`played-${video.uid}`, 'true');
      }
    },

    SET_CURSOR(state, { video, cursor }) {
      const v = state.videos.find(v => v.uid === video.uid);
      if (v) {
        v.cursor = cursor;
        localStorage.setItem(`cursor-${video.uid}`, JSON.stringify(cursor));
      }
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
      commit('SET_VIDEOS', []);
      const limit = 1000;
      let offset = 0;

      while (true) {
        let r = await api.get(`/videos/`,
          { params: { limit, offset }}
        );
        commit('ADD_VIDEOS', r.data.results );
        if (r.data.results.length < limit) break;
        offset += limit;
      }
    },

    async getVideoDetails(_, { video_id }) {
      let r = await api.get(`/videos/${video_id}/`);
      return r.data;
    },

    async updatePlayed({ commit, getters }, video) {
      commit('SET_PLAYED', video);
      if (getters.isAuthenticated) {
        await api.post(`/videos/${video.uid}/played/`);
      }
    },

    async updateCursor({ commit, getters }, { video, time }) {
      const cursor = {
        current: time,
        duration: video.duration,
      };
      commit('SET_CURSOR', { video, cursor });
      if (getters.isAuthenticated) {
        await api.post(`/videos/${video.uid}/cursor/`, {
          cursor,
        });
      }
    },
  },
});

export default store;
