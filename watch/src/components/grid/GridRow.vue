<template>
  <div
    v-if="visible"
  >
    <p
      v-if="name"
      class="title channel-name is-3 has-text-light"
    >{{ name }} ({{ items.length }})</p>
    <div class="row">
      <GridItem
        v-for="(item, i) in items"
        :key="i"
        :item="item"
        :auto-select="autoSelect && i === 0"
        :data-index="i"
        ref="items"
      />
      <div
        v-if="returnVisible"
        class="card ek-selectable return"
        data-ek-activate-event-name="ek:activate"
        @ek:activate="onReturnLeft"
      >
        <div class="card-image">
          <figure class="image is-centered is-vcentered">
            <b-icon
              class="ml-2"
              style="margin-top: 176px"
              icon="arrow-u-left-bottom"
              size="is-large"
              type="is-light"
            >
            </b-icon>
          </figure>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GridItem from '@/components/grid/GridItem.vue';

export default {
  name: 'GridRow',

  components: {
    GridItem,
  },

  props: {
    name: {
      type: String,
      default: null
    },
    items: {
      type: Array,
      default: [],
    },
    autoSelect: {
      type: Boolean,
      default: false,
    }
  },

  computed: {
    visible() {
      return Boolean(this.items.length);
    },

    returnVisible() {
      return this.items.length >= 5;
    },
  },

  methods: {
    onReturnLeft() {
      const div = this.$refs.items.find(o => o.$attrs['data-index'] === 0).$el;
      this.$emit('scrollTo', div);
    },
  },
}
</script>

<style scoped>
.channel-name {
  padding-top: 10px;
  margin-bottom: 10px
}

.return {
  min-width: 72px;
  max-width: 72px;
  height: 400px;
  margin: 4px;
}

.row {
  display: flex;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 404px;
}

.ek-selectable {
  border: solid 2px transparent;
}

.ek-selected {
  border: solid 2px var(--primary);
}

.ek-selected .play-button {
  display: inline;
}
</style>
