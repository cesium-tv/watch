<template>
  <div>
    <b-slider
      rounded
      size="is-large"
      type="is-primary"
      :value="progress"
    >
    </b-slider>
    <p class="time">
      {{ hms(time) }} / {{ hms(state.duration) }}
    </p>
  </div>
</template>

<script>
import { STATUS } from '@/config';

export default {
  name: 'Scrubber',

  props: {
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
    },
  },

  computed: {
    time() {
      return this.state.status === STATUS.SEEKING ? this.state.seek : this.state.time;
    },

    progress() {
      return (100 / this.state.duration) * this.time;
    },
  },

  methods: {
    hms(value) {
      let hours = '';
      if (this.state.duration >= 3600) {
        hours = Math.floor(value / 3600).toString().padStart(2, '0') + ':';
      }
      const minutes = Math.floor(value % 3600 / 60).toString().padStart(2, '0');
      const seconds = Math.floor(value % 3600 % 60).toString().padStart(2, '0');

      return `${hours}${minutes}:${seconds}`;
    },
  },
}
</script>

<style scoped>
.time {
  font-weight: bold;
  font-size: 22px;
  color: white;
  text-align: right;
}
</style>
