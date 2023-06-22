<template>
  <div
    id="plyr-container"
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
import Plyr from '@/components/player/Plyr.vue';

export default {
  name: 'Video',

  components: {
    Plyr,
  },

  data() {
    return {
      video: null,
    };
  },

  computed: {
    visible() {
      return (this.video);
    },
  },

  mounted() {
    // NOTE: whenever another component wants to play a video, it raises this
    // event with the video details, this is the entry point for playing.
    this.$bus.$on('video:play', video => {
      this.$ek.pause();
      this.video = video;
    });
  },

  methods: {
    onPlaying(video) {
      this.$store.dispatch('updatePlayed', video);
    },

    onTimeUpdate(video, time) {
      const cursor = {
        current: time,
        duration: video.duration,
      };
      this.$store.dispatch('updateCursor', { video, time });
    },

    onStopped() {
      // NOTE: The player informs us when it is done playing, for now we shut
      // down and emit the global event to indicate playback has completed.
      // TODO: this is where we will add the queue playing functionality.
      this.video = null;
      this.$ek.resume();
      this.$bus.$emit('video:stop');
    },
  },
}
</script>

<style scoped>
#plyr-container {
  background-color: black;
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
