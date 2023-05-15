<template>
  <div
    id="playpause"
    v-if="value"
  >
    <b-icon
      :icon="(statusPlaying) ? 'play' : 'pause'"
      size="is-large"
      type="is-light"
    >
    </b-icon>
  </div>

</template>

<script>
import { STATUS } from '@/config';

export default {
  name: 'PlayPause',

  data() {
    return {
      timeout: null,
    }
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    hideDelay: {
      type: Number,
      default: 400,
    },

    state: {
      type: Object,
      default: {
      state: {
        status: STATUS.LOADING,
        seek: 0,
        time: null,
        duration: null,
      },
      }
    }
  },

  computed: {
    statusPlaying() {
      return this.state.status === STATUS.PLAYING;
    },
  },

  methods: {
    show() {
      clearTimeout(this.timeout);
      this.timeout = setTimeout(() => {
        this.$emit('input', false);
      }, this.hideDelay);
    },
  },

  mounted() {
    this.show();
  },

  watch: {
    value(newValue) {
      if (newValue) {
        this.show();
      }
    },
  },
}
</script>

<style scoped>
@keyframes pop {
  50% {
    transform: scale(2.0);
  }
  100% {
    transform: scale(3.0);
    opacity: 0.4;
  }
}

#playpause {
	position: absolute;
  top: 45%;
	left: 50%;
  margin-top: -39;
  margin-left: -39;
  font-size: 78px;
  animation-name: pop;
  animation-duration: 0.4s;
  animation-fill-mode: forwards;
}
</style>
