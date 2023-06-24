<template>
  <button
    class="ek-selectable button has-text-light"
    :style="style"
    ref="button"
    @click="onClick"
  ><strong>{{ label }}</strong></button>
</template>

<script>
import { KEY_WIDTH, KEY_MARGIN } from '@/config';

export default {
  name: 'Key',

  props: {
    label: {
      type: String,
      default: '',
    },
    code: {
      type: String,
      default: '',
    },
  },

  computed: {
    style() {
      //const el = this.$refs.button;
      //let width = KEY_WIDTH;

      //if (this.label.length > 1) {
        //const elWidth = el.offsetWidth;
        //width = elWidth + (KEY_WIDTH - (elWidth % KEY_WIDTH));
        //width += width / KEY_WIDTH * 3;
      //}

      let length = (this.label) ? this.label.length : 1;
      length = Math.floor(length / 3) + 1;
      let width = length * KEY_WIDTH;
      width += (width / KEY_WIDTH - 2) * KEY_MARGIN;
      return `width: ${width}px; margin: ${KEY_MARGIN}px;`;
    },
  },

  methods: {
    onClick(ev) {
      if (!this.code) return;
      this.$emit('click', this.code);
    },
  },
}
</script>

<style scoped>
.button {
  border: none;
}

.ek-selected {
  background-color: var(--primary) !important;
}
</style>
