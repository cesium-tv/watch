export default {
    namespaced: true,

    state() {
        return {
            playing: null,
            queue: [],
        };
    },

    mutations: {
        ENQUEUE(state, video) {
            if (!state.playing) state.playing = video;
            else state.queue.push(video);
        },

        DEQUEUE(state) {
            state.playing = state.queue[0];
            state.queue.shift();
        },

        CLEAR_QUEUE(state) {
            state.queue = [];
        },

        SET_PLAYING(state, video) {
            state.playing = video;
            state.queue = [];
        },

        UNSET_PLAYING(state) {
            state.playing = null;
        },
    },

    actions: {
        play({ commit }, video) {
            commit('SET_PLAYING', video)
        },

        next({ commit }) {
            commit('DEQUEUE');
        },

        stop({ commit }) {
            commit('UNSET_PLAYING')
        },
    },

    getters: {
        playing(state) {
            return state.playing;
        },
    },
};
