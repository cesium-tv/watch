<template>
  <div
    id="plyr-container"
    refs="container"
    :class="{ hide: !visible }"
  >
    <Plyr
      :source="source"
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
import { mapGetters } from 'vuex';
import Plyr from '@/components/player/Plyr.vue';
import { dateDiff } from '@/utils';
import { CURSOR_UPDATE_INTERVAL } from '@/config';

export default {
  name: 'Video',

  components: {
    Plyr,
  },

  computed: {
    ...mapGetters({
      video: 'playing/playing',
    }),

    visible() {
      return Boolean(this.video);
    },
  },

  data() {
    return {
      source: null,
      _lastCursorUpdate: 0,
    };
  },

  watch: {
    async video(value) {
      if (!value) {
        this.source = null;
        this.$ek.resume();
        return
      }

      this.$ek.pause();

      const sources = await this.$store.dispatch('videos/getVideoSources', value.uid);
      const dimensions = Object.keys(sources);
      dimensions.sort();
      const bestSource = sources[dimensions[0]];

      this.source = {
        video: value,
        source: {
          src: bestSource.url,
          type: bestSource.mime,
          size: bestSource.height,
        },
        sources: sources,
      };
    }
  },

  methods: {
    onPlaying() {
      if (!this.video) {
        return;
      }

      this.$store.dispatch('videos/updatePlayed', this.video);
    },

    onTimeUpdate(time) {
      if (!this.video) {
        return;
      }

      if (!dateDiff(this._lastCursorUpdate * 1000, {
        d2: time * 1000,
        seconds: CURSOR_UPDATE_INTERVAL,
      })) {
        return;
      }

      this.$store.dispatch('videos/updateCursor', { video: this.video, time });
      this._lastCursorUpdate = time;
    },

    onStopped() {
      // TODO: this is where we will add the queue playing functionality.
      this.$store.dispatch('playing/stop');
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
