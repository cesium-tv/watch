<template>
  <video
    ref="video"
  />
</template>

<script>
import Vue from 'vue';
import { KEYCODE } from '@/config';

const KEYCODES = {
  PLAY_PAUSE: [KEYCODE.PAUSE, KEYCODE.SPACE, KEYCODE.ENTER],
  PLAY: [KEYCODE.PLAY, KEYCODE.PLAY_TV],
  FFD: [KEYCODE.FFW, KEYCODE.RIGHT],
  RWD: [KEYCODE.RWD, KEYCODE.LEFT],
  STOP: [KEYCODE.STOP, KEYCODE.STOP_TV, KEYCODE.BACK, KEYCODE.ESC],
};

export default {
  name: 'Plyr',

  props: {
    value: {
      type: Object,
    },
    updateInterval: {
      type: Number,
      default: 1.0
    },
  },

  data() {
    return {
      player: null,
      eventHandlers: {
        keyDown: this.onKey.bind(this),
      },
      _controlFlash: null,
      _lastUpdateTime: 0,
    };
  },

  mounted() {
    document.addEventListener('keydown', this.eventHandlers.keyDown);

    this.player = new Plyr(this.$refs.video, {
      controls: this.defineControls,
      fullscreen: {
        enabled: false,
      },
      hideControls: false,
      autoplay: false,
    });
    this.player.on('play', () => {
      const video = Object.assign({}, this.value);
      if (!video) return;
      this.player.toggleControls(false);
      this.$emit('playing', video);
    });
    this.player.on('pause', () => {
      const video = Object.assign({}, this.value);
      if (!video) return;
      this.$emit('pause', video);
    });
    this.player.on('timeupdate', p => {
      const video = Object.assign({}, this.value);
      const time = this.player.currentTime;
      if (!video) return;
      if (this._lastUpdateTime && time - this._lastUpdateTime < this.updateInterval) {
        return;
      }
      this._lastUpdateTime = time;
      this.$emit('timeupdate', video, time);
    });
    this.player.on('ended', this.onEnd);
    // If a source is set, play it, we also react if our value is changed
    // (play something else)
    if (this.source) {
      this.start(this.source);
    }
  },

  beforeUnmount() {
    try {
      this.player.destroy();
    } catch (e) {
      console.error(e);
    }
    this.player = null;
  },

  unmount() {
    document.removeEventListener('keydown', this.eventHandlers.keyDown);
  },

  computed: {
    source() {
      if (!this.value) {
        return;
      }

      const dimensions = Object.keys(this.value.sources);
      dimensions.sort();
      const bestSource = this.value.sources[dimensions[0]];
      return {
        type: 'video',
        title: this.value.title,
        sources: [
          {
            src: bestSource.url,
            type: bestSource.mime,
            size: bestSource.height,
          },
        ],
      };
    },

    visible() {
      return (this.source);
    },

    isSourceHls() {
      if (!this.source) {
        return false;
      }

      const urlp = new URL(this.source.sources[0].src);
      return urlp.pathname.toLowerCase().endsWith('.m3u8');
    },
  },

  watch: {
    source(source) {
      if (source) {
        this.start(source);
      } else {
        this.stop();
      }
    },
  },

  methods: {
    defineControls() {
      const vnode = this.$slots.controls;
      if (!vnode) {
        return ['play-large', 'progress', 'current-time', 'duration'];
      }
      // NOTE: Creates a simple component to render our slot vnodes.
      const ControlsConstructor = Vue.extend({
        render: function(h, context) {
          return vnode;
        }
      });
      const instance = new ControlsConstructor();
      instance.$mount();
      return instance.$el;
    },

    start(source) {
      console.log('Playing source:', source);

      if (this.isSourceHls) {
        if (!Hls.isSupported()) {
          return;
        }

        const hls = new Hls();
        hls.loadSource(source.sources[0].src);
        hls.attachMedia(this.$refs.video);
      } else {
        this.player.source = source;
      }
      this._lastUpdateTime = 0;

      if (!this.value.cursor || !this.value.cursor.current) {
        this.player.play();

      } else {
        // NOTE: I think this event fires multiple times, however, currentTime
        // can only be set once duration is set.
        const setTime = () => {
          if (this.player.duration) {
            this.player.currentTime = this.value.cursor.current;
            this.player.play();
            this.player.off('canplay', setTime);
          }
        };
        this.player.on('canplay', setTime);
      }
    },

    flashControls() {
      clearTimeout(this._controlFlash);
      this.player.toggleControls(true);
      this._controlFlash = setTimeout(() => {
        this.player.toggleControls(false);
      }, 2000);
    },

    stop() {
      this.player.stop();
      this.$emit('stopped');
    },

    pause() {
      this.player.pause();
    },

    resume() {
      this.player.play();
    },

    toggle() {
      this.player.togglePlay();
    },

    ffd(seekTime=null) {
      this.player.forward(seekTime);
      this.flashControls();
    },

    rwd(seekTime=null) {
      this.player.rewind(seekTime)
      this.flashControls();
    },

    onEnd() {
      this.stop();
    },

    onKey(ev) {
      if (!this.player.playing) return;

      if (KEYCODES.STOP.includes(ev.keyCode)) {
        this.stop();
      } else if (KEYCODES.PLAY) {
        this.resume();
      } else if (KEYCODES.PLAY_PAUSE) {
        this.toggle();
      } else if (KEYCODES.FFD.includes(ev.keyCode)) {
        this.ffd();
      } else if (KEYCODES.RWD.includes(ev.keyCode)) {
        this.rwd();
      }
    },
  },
}
</script>

<style scoped>
video {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background-color: black;
}
</style>
