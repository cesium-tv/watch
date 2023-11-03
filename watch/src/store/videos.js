import qs from 'qs';
import api from '@/services/api';
import { DATA_REFRESH_INTERVAL, VIDEO_FETCH_LIMIT } from '@/config';
import { dateDiff } from '../utils';

function splitVideos(data) {
    const videos = {};
    const c2v = {};

    data.forEach(v => {
      const played = localStorage.getItem(`played-${v.uid}`);
      const cursor = localStorage.getItem(`cursor-${v.uid}`);

      if (cursor) {
        v.cursor = JSON.parse(cursor);
      }
      v.is_played = (played === 'true') ? true : v.is_played;

      v.published = Date.parse(v.published);
      v.created = Date.parse(v.created);

      for (const channel_uid of v.channels) {
        let channelVideos = c2v[channel_uid];
        if (!channelVideos) {
            channelVideos = c2v[channel_uid] = new Set();
        }
        channelVideos.add(v.uid);
      }

      videos[v.uid] = v;
    });

    return { videos, c2v };
}

function splitChannels(data) {
    const channels = {};

    data.forEach(c => {
        c.created = Date.parse(c.created);
        channels[c.uid] = c;
    });

    return { channels };
}

export default {
    namespaced: true,

    state() {
        return {
            videos: null,
            channels: null,
            c2v: null,
            lastRefresh: null,
        }
    },

    mutations: {
        SET_CHANNELS(state, data) {
            const { channels } = splitChannels(data);
            state.channels = channels;
        },

        SET_VIDEOS(state, data) {
            const { videos, c2v } = splitVideos(data);
            state.videos = videos;
            state.c2v = c2v;
        },

        SET_LAST_REFRESH(state) {
            state.lastRefresh = new Date();
        },

        ADD_VIDEOS(state, data) {
            const { videos, c2v } = splitVideos(data);

            for (const [k, v] of Object.entries(videos)) {
                state.videos[k] = v;
            }
            for (const [k, v] of Object.entries(c2v)) {
                state.c2v[k] = v;
            }
        },
    },

    actions: {
        async refresh({ state, commit, getters }) {
            if (!getters.shouldRefresh) return;

            let r;
            const limit = VIDEO_FETCH_LIMIT;
            let offset = 0;

            try {
                r = await api.get('/channels/');
            } catch (e) {
                console.error(e);
                return;
            }
            commit('SET_CHANNELS', r.data.results);

            while (true) {
                const mutation = (offset === 0) ? 'SET_VIDEOS' : 'ADD_VIDEOS';
                try {
                    r = await api.get(
                        '/videos/', {
                            params: { limit, offset, field: ['channels', 'sources'] },
                            paramsSerializer: p => qs.stringify(p, { arrayFormat: 'repeat'}),
                        }
                    );
                } catch (e) {
                    console.error(e);
                    return;
                }
                commit(mutation, r.data.results);

                if (r.data.results.length < limit) {
                    break;
                }
                // First page only for now, to get all data, comment next line:
                break;
                offset += limit;
            }

            commit('SET_LAST_REFRESH');
        },
    },

    getters: {
        shouldRefresh(state) {
            return dateDiff(state.lastRefresh, { seconds: DATA_REFRESH_INTERVAL });
        },

        videos(state) {
            if (state.videos === null) return [];

            return state.videos;
        },

        channels(state) {
            if (state.channels === null) return [];

            return state.channels;
        },

        videosByPublishedTime(state, getters) {
            return Object.values(getters.videos).toSorted((a, b) => a.published - b.published);
        },

        videosByChannel(state) {
            if (state.channels === null || state.c2v === null) return [];

            const channels = Object.values(state.channels).toSorted((a, b) => a.created - b.created);

            for (const channel of channels) {
                const videos = channel.videos = [];
                const videoUids = state.c2v[channel.uid];
                if (!videoUids) continue;
                for (const video_uid of videoUids) {
                    videos.push(state.videos[video_uid]);
                    videos.sort((a, b) => a.published - b.published);
                }
            }

            channels.sort((a, b) => {
                if (!a.videos[0] || !b.videos[0]) return;
                return a.videos[0].published - b.videos[0].published
            });

            return channels.filter((c) => c.videos.length);
        },
    },
};