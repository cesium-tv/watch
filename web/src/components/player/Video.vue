<template>
  <div
    id="container"
    ref="container"
  >
    <video
      autoplay
      ref="video"
      :controls="false"
      :src="source"
    ></video>

      <Controls
        v-model="controls"
        :state="state"
      >
        <PlayPause
          v-model="playPause"
          :state="state"
        />
      </Controls>
    </div>
</template>

<script>
import screenfull from 'screenfull';
import PlayPause from '@/components/player/PlayPause';
import Controls from '@/components/player/Controls';
import { KEYCODE, STATUS } from '@/config';

const CODEGROUPS = {
  PLAY_PAUSE: [KEYCODE.PAUSE, KEYCODE.SPACE, KEYCODE.ENTER],
  PLAY: [KEYCODE.PLAY, KEYCODE.PLAY_TV],
  FFD: [KEYCODE.FFW, KEYCODE.RIGHT],
  RWD: [KEYCODE.RWD, KEYCODE.LEFT],
  STOP: [KEYCODE.STOP, KEYCODE.STOP_TV, KEYCODE.BACK, KEYCODE.ESC],
};

export default {
  name: 'Video',

  components: {
    PlayPause,
    Controls,
  },

  props: {
    value: {
      type: Object,
      default: null,
    },
  },

  data() {
    return {
      controls: false,
      playPause: false,
      state: {
        status: STATUS.LOADING,
        seek: 0,
        time: null,
        duration: null,
      },
      details: null,
      eventHandlers: {},
    };
  },

  mounted() {
    const $video = this.$refs.video;

    this.eventHandlers = {
      keyDown: this.onKeyDown.bind(this),
      fullScreen: this.onFullscreen.bind(this),
    };
    document.addEventListener('keydown', this.eventHandlers.keyDown);
    screenfull.on('change', this.eventHandlers.fullScreen);

    $video.addEventListener("timeupdate", (ev) => {
      this.state.duration = ev.target.duration;
      const time = ev.target.currentTime;
      if (this.state.status === STATUS.SEEKING) {
        if (time < this.state.seek * 1.01 &&
            time > this.state.seek * -1.01) {
          this.state.seek = 0;
          this.state.status = STATUS.PLAYING;
        } else {
          return;
        }
      }
      this.state.time = time;
    });

    $video.addEventListener('play', () => {
      this.$bus.$emit('idle');
    });

    $video.addEventListener('stalled', () => {
      this.$bus.$emit('busy');
    });

    $video.addEventListener('playing', () => {
      const status = this.state.status;
      this.$bus.$emit('idle');
      this.state.status = STATUS.PLAYING;
      // NOTE: don't show controls when first playing, or seeking.
      if (status === STATUS.PAUSED) {
        this.controls = false;
        this.playPause = true;
      }
    });

    $video.addEventListener('pause', () => {
      this.state.status = STATUS.PAUSED;
      this.controls = true;
      this.playPause = true;
    });

    this.show();
  },

  unmounted() {
    document.removeEventListener('keydown', this.eventHandlers.keyDown);
    screenfull.off('change', this.eventHandlers.fullScreen);
  },

  computed: {
    source() {
      if (!this.value) {
        return;
      }

      const dimensions = Object.keys(this.value.sources);
      dimensions.sort();

      return this.value.sources[dimensions[0]].url;
    },
  },

  methods: {
    show() {
      this.$emit('play');
      screenfull.request(this.$refs.container);
    },

    hide() {
      this.$bus.$emit('idle');
      this.$emit('stop');
      this.$emit('input', null);

      if (screenfull.isFullscreen) {
        screenfull.exit();
      }
    },

    onFullscreen() {
      if (!screenfull.isFullscreen) {
        this.hide();
      }
    },

    seek(delta) {
      /*
      Enter seeking state, and show controls. Seeking state causes the
      scrubber to display the seek value rather than the time value (
      the time value jumps around).

      Seeking state is exited once the video element reports currentTime
      +/- 1% of the requested value, meaning it "caught up" to our seek.
      */
      this.state.status = STATUS.SEEKING;
      this.controls = true;
      this.state.seek = this.$refs.video.currentTime += delta;
    },

    onKeyDown(ev) {
      const $video = this.$refs.video;
      if (!$video) {
        return;
      }

      if (CODEGROUPS.PLAY_PAUSE.indexOf(ev.keyCode) !== -1) {
        if ($video.paused) {
          $video.play();
        } else {
          $video.pause();
        }
      } else if (CODEGROUPS.PLAY.indexOf(ev.keyCode) !== -1) {
        if ($video.paused) {
          $video.play();
        }
        /*
          Force controls to display even if we were already playing.
          This is a nice feature to check your current video time
          without pausing.
        */
        this.controls = true;
      } else if (CODEGROUPS.FFD.indexOf(ev.keyCode) !== -1) {
        this.seek(10);
      } else if (CODEGROUPS.RWD.indexOf(ev.keyCode) !== -1) {
        this.seek(-10);
      } else if (CODEGROUPS.STOP.indexOf(ev.keyCode) !== -1) {
          this.hide();
      } else {
        console.log('Unknown keyCode:', ev.keyCode);
      }
    },
  },
}
</script>

<style scoped>
#container {
  width: 100%;
  height: 100%;
  background-color: black;
  z-index: 999;
}

video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: black;
}

.hide {
  display: none;
}

.show {
  display: block;
}
</style>
