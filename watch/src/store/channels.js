import api from '@/services/api';
import { dateDiff } from '@/utils';
import { DATA_FETCH_INTERVAL } from '@/config';

export default {
  namespaced: true,

  state: {
    channels: null,
    lastUpdated: null,
  },

  getters: {
    channels(state) {
      return state.channels;
    },
  },

  mutations: {
    SET_CHANNELS(state, channels) {
      state.channels = channels;
      state.lastUpdated = new Date();
    },
  },

  actions: {
    async get({ state, commit }) {
      if (!dateDiff(state.lastUpdated, { seconds: DATA_FETCH_INTERVAL })) {
        return;
      }

      const videos = [];
      const r = await api.get('/channels/');
      const channels = r.data.results.map(c => {
        videos.push(...c.videos);
        delete c.videos;
        return c;
      });
      commit('SET_CHANNELS', channels);
      commit('videos/ADD_VIDEOS', videos, { root: true });
    },
  },
};
