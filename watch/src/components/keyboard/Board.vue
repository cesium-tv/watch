<template>
  <div>
    <slot>
      <div id="input-wrapper">
        <h2
          id="input"
          class="title has-text-light"
          :style="`margin: ${KEY_MARGIN}px;`"
        >{{ value }}</h2>
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

  data() {
    return {
      panel: 0,
      cursor: 0,
      value: '',
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
  },

  methods: {
    onClick(code) {
      if (code === '⇭') {
        this.panel = (this.panel === 1) ? 0 : 1;
        return;
      } else if (code === '⌧') {
        this.value = '';
      } else if (code === '⌫') {
        this.value = this.value.substring(0, this.value.length - 1);
      } else {
        this.value += code;
      }

      this.$emit('value', this.value);
    },
  },
}
</script>

<style scoped>
#input-wrapper {
  text-align: left;
  width: 320px;
  height: 36px;
  direction: rtl;
  overflow: hidden;
}

#input {
  white-space: nowrap;
  direction: ltr;
  display: inline-block;
}
</style>
