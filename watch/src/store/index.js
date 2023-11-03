import { createStore } from 'vuex';
import Videos from '@/store/videos.js';
import Player from '@/store/player.js';

export default createStore({
    modules: {
        videos: Videos,
        player: Player,
    }
});
