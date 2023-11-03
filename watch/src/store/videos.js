import api from '@/services/api';
import { dateDiff } from '@/utils';
import { DATA_FETCH_INTERVAL } from '@/config';

function splitVideos(data) {
  const videos = {};
  const channels = {};

  data.forEach(v => {
    const played = localStorage.getItem(`played-${v.uid}`);
    const cursor = localStorage.getItem(`cursor-${v.uid}`);

    if (cursor) {
      v.cursor = JSON.parse(cursor);
    }
    v.is_played = (played === 'true') ? true : v.is_played;

    for (const channel_uid of v.channels) {
      if (!(channel_uid in channels)) channels[channel_uid] = {};
      channels[channel_uid][v.uid] = v;
      videos[v.uid] = v;
    }
  });

  return { channels, videos };
}

export default {
  namespaced: true,

  state: {
    videos: {},
    videoSources: {},
    videosByChannel: {},
    lastUpdated: null,
  },

  getters: {
    videosByChannel: (state) => (channel_uid) => {
      if (!state.videos || !state.videosByChannel[channel_uid]) {
        return [];
      }
      return Object.values(state.videosByChannel[channel_uid])
        .filter(o => {
          if (!o.cursor) {
            return true;
          }
          return o.cursor.current / o.cursor.duration <= 0.10;
        });
    },

    videoSources: (state) => {
      return state.videoSources;
    },

    playedVideos: (state) => {
      return Object.values(state.videos).filter(o => {
        if (!o.cursor) {
          return false;
        }
        return o.cursor.current / o.cursor.duration > 0.10;
    });
    },
  },

  mutations: {
    SET_VIDEOS(state, videos) {
      const data = splitVideos(videos);

      state.videos = data.videos;
      state.channels = data.channels;
    },

    ADD_VIDEOS(state, videos) {
      const data = splitVideos(videos);

      for (const [k, v] of Object.entries(data.channels)) {
        if (!(k in state.videosByChannel)) state.videosByChannel[k] = {};
        Object.entries(v).forEach(([kk, vv]) => {
          state.videosByChannel[k][kk] = vv;
        })
      }
      for (const [k, v] of Object.entries(data.videos)) {
        state.videos[k] = v;
      }
    },

    SET_VIDEO_SOURCES(state, {video_uid, sources }) {
      state.videoSources[video_uid] = sources;
    },

    SET_PLAYED(state, video) {
      const v = state.videos[video.uid];
      if (v) {
        v.is_played = true;
        localStorage.setItem(`played-${video.uid}`, 'true');
      }
    },

    SET_CURSOR(state, { video, cursor }) {
      const v = state.videos[video.uid];
      if (v) {
        v.cursor = cursor;
        localStorage.setItem(`cursor-${video.uid}`, JSON.stringify(cursor));
      }
    },
  },

  actions: {
    async get({ state, commit }) {
      if (!dateDiff(state.lastUpdated, { seconds: DATA_FETCH_INTERVAL })) {
        return;
      }

      const limit = 1000;
      let offset = 0;

      while (true) {
        const r = await api.get(`/videos/`,
          { params: { limit, offset, field: 'channel' }}
        );

        if (offset === 0) {
          commit('SET_VIDEOS', r.data.results );
        } else {
          commit('ADD_VIDEOS', r.data.results );
        }

        if (r.data.results.length < limit) {
          break;
        }
        offset += limit;
      }
    },

    async getVideoSources({ state, commit }, video_uid) {
      let sources = state.videoSources[video_uid];
      if (!sources) {
        const r = await api.get(`/videos/${video_uid}/sources/`);
        sources = r.data;
        commit('SET_VIDEO_SOURCES', { video_uid, sources });
      }
      return sources;
    },

    async updatePlayed({ commit, rootGetters }, video) {
      commit('SET_PLAYED', video);
      if (rootGetters['auth/isAuthenticated']) {
        await api.post(`/videos/${video.uid}/played/`);
      }
    },

    async updateCursor({ commit, rootGetters }, { video, time }) {
      const cursor = {
        current: time,
        duration: video.duration,
      };
      commit('SET_CURSOR', { video, cursor });
      if (rootGetters['auth/isAuthenticated']) {
        await api.post(`/videos/${video.uid}/cursor/`, {
          cursor,
        });
      }
    },
  },
};
