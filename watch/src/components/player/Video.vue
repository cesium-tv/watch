<template>
  <div
    id="container"
    refs="container"
    :class="{ hide: !visible }"
  >
    <Plyr
      v-model="video"
      :update-interval="10"
      @playing="onPlaying"
      @stopped="onStopped"
      @timeupdate="onTimeUpdate"
    >
      <template v-slot:controls>
        <div class="plyr__controls">
          <div class="plyr__controls__item plyr__progress__container">
            <div class="plyr__progress">
              <input data-plyr="seek" type="range" min="0" max="100" step="0.01" value="0" aria-label="Seek">
              <progress class="plyr__progress__buffer" min="0" max="100" value="0">% buffered</progress>
              <span role="tooltip" class="plyr__tooltip">00:00</span>
            </div>
          </div>
          <div class="plyr__controls__item plyr__time plyr__time--current" aria-label="Current time">00:00</div>
          <div class="plyr__controls__item plyr__time plyr__time--duration" aria-label="Duration">00:00</div>
        </div>
      </template>
    </Plyr>
  </div>
</template>

<script>
import screenfull from 'screenfull';
import Plyr from '@/components/player/Plyr';
import api from '@/services/api';

export default {
  name: 'Video',

  components: {
    Plyr,
  },

  data() {
    return {
      video: null,
      eventHandlers: {
        screenFull: this.onFullscreen.bind(this),
      },
    };
  },

  computed: {
    visible() {
      return (this.video);
    },
  },

  mounted() {
    screenfull.on('change', this.eventHandlers.screenFull);

    // NOTE: whenever another component wants to play a video, it raises this
    // event with the video details, this is the entry point for playing.
    this.$bus.$on('video:play', video => {
      screenfull.request(this.$refs.container);
      this.video = video;
    });
  },

  unmounted() {
    screenfull.off('change', this.eventHandlers.screenFull);
  },

  methods: {
    onPlaying(video) {
      api.post(`/videos/${video.uid}/played/`)
        .catch(console.error);
    },

    onTimeUpdate(video, time) {
      const cursor = {
        current: time,
        duration: video.duration,
      };
      api.post(`/videos/${video.uid}/cursor/`, {
        cursor,
      })
        .catch(console.error);
      this.video.cursor = cursor;
    },

    onStopped() {
      // NOTE: The player informs us when it is done playing, for now we shut
      // down and emit the global event to indicate playback has completed.
      // TODO: this is where we will add the queue playing functionality.
      screenfull.exit();
      this.video = null;
      this.$bus.$emit('video:stop');
    },

    onFullscreen() {
      if (!screenfull.isFullscreen) {
        this.video = null;
      }
    },
  },
}
</script>

<style scoped>
#container {
  position: absolute;
  width: 100%;
  height: 100%;
  /* puts this above loading overlay */
  z-index: 1000;
}

.hide {
  display: none;
}

input[type=range] {
  --plyr-range-fill-background: var(--primary);
}

.controls__top__row {
  margin-bottom: 20px;
  background: none;
}
</style>
