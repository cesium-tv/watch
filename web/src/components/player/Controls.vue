<template>
  <div
    id="overlay"
    v-if="visible"
  >
    <slot></slot>
    <div
      id="controls"
      class="closed"
    >
      <Scrubber
        :state="state"
      />
    </div>
  </div>
</template>

<script>
import Scrubber from '@/components/player/Scrubber';
import { STATUS} from '@/config';

export default {
  name: 'Controls',

  components: {
    Scrubber,
  },

  data() {
    return {
      timeout: null,
      visible: false,
    }
  },

  props: {
    value: {
      type: Boolean,
      default: false,
    },

    hideDelay: {
      type: Number,
      default: 3000,
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
    },
  },

  watch: {
    value() {
      this.visible = true;
      clearTimeout(this.timeout);

      this.timeout = setTimeout(() => {
        if (this.state.status === STATUS.PAUSED) {
          return;
        }
        this.visible = false;
        this.$emit('input', false);
      }, this.hideDelay);
    },
  },
}
</script>

<style scoped>
#overlay {
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: rgba(0,0,0,0.5);
}

#controls {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
  height: 15%;
	padding: 5px;
  padding-left: 48px;
  padding-right: 48px;
}
</style>
