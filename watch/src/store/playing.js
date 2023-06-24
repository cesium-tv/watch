export default {
  namespaced: true,

  state: {
    playing: null,
    tasks: 0,
    queue: [],
  },

  getters: {
    playing(state) {
      return state.playing;
    },

    isBusy(state) {
      return Boolean(state.tasks > 0);
    },
  },

  mutations: {
    SET_PLAYING(state, video) {
      state.playing = video;
    },

    INC_TASKS(state, num=1) {
      state.tasks += num;
    },

    DEC_TASKS(state, num=1) {
      state.tasks -= num;
    },
  },

  actions: {
    play({ dispatch, commit }, video) {
      dispatch('videos/getVideoSources', video.uid, { root: true });
      commit('SET_PLAYING', video);
    },

    stop({ commit }) {
      commit('SET_PLAYING', null);
    },

    busy({ commit }, num=1) {
      commit('INC_TASKS', num);
    },

    idle({ commit }, num=1) {
      commit('DEC_TASKS', num);
    },
  },
};
