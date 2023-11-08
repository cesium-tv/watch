export default {
    namespaced: true,

    state() {
        return {
            requestCount: 0,
            status: 'ok',
        };
    },

    mutations: {
        SET_STATUS(state, status) {
            state.status = status;
        },

        INC_REQUESTS(state, num=1) {
            state.requestCount += num;
        },

        DEC_REQUESTS(state, num=1) {
            state.requestCount = Math.max(0, state.requestCount - num);
        },
    },

    actions: {
        startRequest({ commit }) {
            commit('INC_REQUESTS');
        },

        endRequest({ commit }) {
            commit('DEC_REQUESTS');
        },

        timeout({ commit }) {
            commit('SET_STATUS', 'down');
        },

        recover({ commit }) {
            commit('SET_STATUS', 'ok');
        },
    },

    getters: {
        isDown(state) {
            return state.status === 'down';
        },

        isBusy(state) {
            return state.requestCount > 0;
        },
    },
};
