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
      const r = await api.get('/channels/', { params: { field: 'videos' }});
      const channels = r.data.results.map(c => {
        if (c.videos) {
          videos.push(...c.videos.map(v => {
            v.channels = [c.uid];
            return v;
          }));

          // NOTE: this modifies the channel referenced by each video. Therefore
          // we are able to skip a shallow copy inside c.videos.map().
          delete c.videos;
        }

        return c;
      });
      commit('SET_CHANNELS', channels);
      commit('videos/ADD_VIDEOS', videos, { root: true });
    },
  },
};
