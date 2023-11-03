import qs from 'qs';
import api from '@/services/api';
import { DATA_REFRESH_INTERVAL, VIDEO_FETCH_LIMIT } from '@/config';
import { dateDiff } from '../utils';

function prepareVideos(videos, channels) {
    videos.forEach(v => {
        const played = localStorage.getItem(`played-${v.uid}`);
        const cursor = localStorage.getItem(`cursor-${v.uid}`);

        if (cursor) v.cursor = JSON.parse(cursor);
        v.is_played = (played === 'true') ? true : v.is_played;
        v.published = Date.parse(v.published);
        v.created = Date.parse(v.created);

        const channel_uid = v.channels[0];
        const channel = channels.find(c => c.uid === channel_uid);

        channel.videos.push(v);

        // TODO: binary insert, maintain ordering.
        channel.videos.sort((a, b) => a.published - b.published);
        v.channel = channel;
    });

    return videos;
}

function prepareChannels(channels) {
    channels.forEach(c => {
        c.created = Date.parse(c.created);
        c.videos = [];
    });

    return channels;
}

export default {
    namespaced: true,

    state() {
        return {
            videos: null,
            channels: null,
            lastRefresh: null,
        }
    },

    mutations: {
        SET_CHANNELS(state, data) {
            // Convert dates etc.
            state.channels = prepareChannels(data);
        },

        SET_VIDEOS(state, data) {
            // Convert dates, map channels to videos.
            state.videos = prepareVideos(data, state.channels);
        },

        SET_LAST_REFRESH(state) {
            state.lastRefresh = new Date();
        },

        ADD_VIDEOS(state, data) {
            const videos = prepareVideos(data, state.channels);
            state.videos.push(...videos);
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
            return state.videos || [];
        },

        channels(state) {
            return state.channels || [];
        },

        videosByPublishedTime(state, getters) {
            return getters.videos.toSorted((a, b) => a.published - b.published);
        },

        videosForChannel: (state) => {
            return (channel_uid) => {
                return state.videos.filter((v) => {
                    v.channels.includes(channel_uid);
                });
            };
        },
    },
};