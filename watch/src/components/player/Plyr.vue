<template>
  <video
    ref="video"
  />
</template>

<script>
import Plyr from 'plyr';
import Hls from 'hls.js';
import Vue from 'vue';
import { CONTROLS } from '@/config';

export default {
  name: 'Plyr',

  props: {
    source: {
      type: Object,
    },
  },

  data() {
    return {
      player: null,
      eventHandlers: {
        keyDown: this.onKey.bind(this),
      },
      _controlFlash: null,
    };
  },

  mounted() {
    this.player = new Plyr(this.$refs.video, {
      controls: this.defineControls,
      fullscreen: {
        enabled: false,
      },
      hideControls: false,
      autoplay: false,
      keyboard: {
        focused: false,
        global: false,
      },
    });
    this.player.on('play', () => {
      console.debug('Played');
      this.player.toggleControls(false);
      this.$emit('playing');
    });
    this.player.on('pause', () => {
      console.debug('Paused');
      this.$emit('pause');
    });
    this.player.on('timeupdate', p => {
      this.$emit('timeupdate', this.player.currentTime);
    });
    this.player.on('ended', this.onEnd);
    // If a source is set, play it, we also react if our value is changed
    // (play something else)
    if (this.source) {
      this.start(this.source);
    }
  },

  computed: {
    visible() {
      return Boolean(this.source);
    },

    isSourceHls() {
      if (!this.source) {
        return false;
      }

      const urlp = new URL(this.source.source.src);
      return urlp.pathname.toLowerCase().endsWith('.m3u8');
    },
  },

  watch: {
    source(value) {
      if (!value) {
        this.stop();
        document.removeEventListener('keydown', this.eventHandlers.keyDown);
        return;
      }

      document.addEventListener('keydown', this.eventHandlers.keyDown);
      this.start(value);
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
      const video = source.video;

      if (this.isSourceHls) {
        if (!Hls.isSupported()) {
          return;
        }

        const hls = new Hls();
        hls.loadSource(source.source.src);
        hls.attachMedia(this.$refs.video);

      } else {
        this.player.source = {
          type: 'video',
          title: video.title,
          sources: [
            source.source,
          ],
          poster: video.poster,
        };

      }

      const play = () => {
        this.player.play();
      };

      if (!video.cursor || !video.cursor.current) {
        play();

      } else {
        // NOTE: I think this event fires multiple times, however, currentTime
        // can only be set once duration is set.
        const setTime = () => {
          if (this.player.duration) {
            this.player.off('canplay', setTime);
            this.player.currentTime = video.cursor.current;
            play();
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
      console.debug('Stopping');
      this.player.stop();
      this.$emit('stopped');
    },

    pause() {
      console.debug('Pausing');
      this.player.pause();
    },

    resume() {
      console.debug('Resuming');
      this.player.play();
    },

    toggle() {
      console.debug('Toggling play state');
      this.player.togglePlay();
    },

    ffd(seekTime=null) {
      console.debug('Seeing forward');
      this.player.forward(seekTime);
      this.flashControls();
    },

    rwd(seekTime=null) {
      console.debug('Seeking reverse');
      this.player.rewind(seekTime)
      this.flashControls();
    },

    onEnd() {
      this.stop();
    },

    onKey(ev) {
      if (ev.keyCode in CONTROLS.STOP) {
        this.stop();
      } else if (ev.keyCode in CONTROLS.PLAY) {
        this.resume();
      } else if (ev.keyCode in CONTROLS.PLAY_PAUSE) {
        this.toggle();
      } else if (ev.keyCode in CONTROLS.FFD) {
        this.ffd();
      } else if (ev.keyCode in CONTROLS.RWD) {
        this.rwd();
      }

      ev.preventDefault();
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
