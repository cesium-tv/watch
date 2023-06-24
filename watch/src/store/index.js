import Vue from 'vue';
import Vuex from 'vuex';
import Auth from '@/store/auth';
import Channels from '@/store/channels';
import Videos from '@/store/videos';
import Playing from '@/store/playing';

Vue.use(Vuex);

const store = new Vuex.Store({
  modules: {
    auth: Auth,
    channels: Channels,
    videos: Videos,
    playing: Playing,
  },
});

export default store;
