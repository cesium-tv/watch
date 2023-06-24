<template>
  <div>
    <slot>
      <div
        id="input-wrapper"
        class="mb-3"
      >
        <h2
          id="input"
          class="title has-text-light"
        >{{ value }}<span class="blink">_</span></h2>
      </div>
    </slot>
    <div
      v-for="row, i of layout"
      :key="i"
    >
      <Component
        v-for="key, i of row"
        :key="i"
        :is="key.component"
        :code="key.code"
        :label="key.label"
        @click="onClick"
      />
    </div>
  </div>
</template>

<script>
import Key from '@/components/keyboard/Key.vue';
import Space from '@/components/keyboard/Space.vue';
import Empty from '@/components/keyboard/Empty.vue';
import { KEYBOARD_LAYOUT, LABEL_MAP, CODE_MAP, KEY_MARGIN } from '@/config';

const COMPONENT_MAP = {
  ' ': 'Empty',
}

export default {
  name: 'Board',

  components: {
    Key,
    Space,
    Empty,
  },

  props: {
    value: {
      type: String,
      default: null,
    },
  },

  data() {
    return {
      panel: 0,
      cursor: 0,
    };
  },

  computed: {
    layout() {
      const layout = [];
      const key_rows = KEYBOARD_LAYOUT[this.panel];

      for (const row of key_rows) {
        const layout_row = [];

        for (const key of row) {
          layout_row.push({
            label: LABEL_MAP[key] || key,
            code: CODE_MAP[key] || key,
            component: COMPONENT_MAP[key] || 'Key',
          });
        }

        layout.push(layout_row);
      }

      return layout;
    },

    keyMargin() {
      return KEY_MARGIN;
    },
  },

  methods: {
    onClick(code) {
      let value = this.value || '';

      if (code === '⇭') {
        this.panel = (this.panel === 1) ? 0 : 1;
        return;
      } else if (code === '⌧') {
        value = '';
      } else if (code === '⌫') {
        value = value.substring(0, value.length - 1);
      } else {
        value += code;
      }

      this.$emit('input', value);
    },
  },
}
</script>

<style scoped>
#input-wrapper {
  text-align: left;
  width: 280px;
  height: 36px;
  direction: rtl;
  overflow: hidden;
  margin-left: 10px;
}

#input {
  white-space: nowrap;
  direction: ltr;
  display: inline-block;
}

.blink {
  animation: blinker 0.5s ease infinite;
}

@keyframes blinker {
  50% {
    opacity: 0;
  }
}
</style>
