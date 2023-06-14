<template>
  <div
    v-if="category.videos.length"
    ref="row"
  >
    <p
      v-if="category.name"
      class="title channel-name is-3 has-text-light"
    >{{ category.name }}</p>
    <div class="row">
      <GridItem
        v-for="(video, i) in category.videos"
        :key="i"
        :video="video"
      />
      <div
        class="card errokees-selectable return"
        data-ek-activate-event-name="errokees:activate"
        @errokees:activate="onReturn"
      >
        <div class="card-image">
          <figure class="image is-centered is-vcentered">
            <b-icon
              class="ml-2"
              style="margin-top: 176px"
              icon="arrow-u-left-bottom"
              size="is-large"
              type="is-dark"
            >
            </b-icon>
          </figure>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import GridItem from '@/components/GridItem';

export default {
  name: 'GridRow',

  components: {
    GridItem,
  },

  props: {
    category: {
      type: Object,
      default: null
    }
  },

  methods: {
    onReturn() {
      const div = this.$refs.row.children[1].firstChild;
      this.$errokees.select(div);
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
  height: 404;
}

.errokees-selectable {
  border: solid 2px transparent;
}

.errokees-selected {
  border: solid 2px var(--primary);
}
</style>
