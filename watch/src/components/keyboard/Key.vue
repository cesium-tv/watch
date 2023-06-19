<template>
  <button
    class="ek-selectable button has-text-light"
    style="border: none;"
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

  mounted() {
    const el = this.$refs.button;
    let width = KEY_WIDTH;

    if (this.label.length > 1) {
      const elWidth = el.offsetWidth;
      width = elWidth + (KEY_WIDTH - (elWidth % KEY_WIDTH));
      width += width / KEY_WIDTH * 3;
    }

    el.style = `width: ${width}; margin: ${KEY_MARGIN}`
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
.ek-selected {
  background-color: var(--primary) !important;
}
</style>
