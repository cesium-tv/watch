<template>
  <div
    v-if="visible"
  >
    <p
      v-if="category.name"
      class="title channel-name is-3 has-text-light"
    >{{ category.name }} ({{ category.videos.length }})</p>
    <div
      ref="row"
      class="row"
    >
      <GridItem
        v-for="(video, i) in category.videos"
        :key="i"
        :video="video"
      />
      <div
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
import GridItem from '@/components/grid/GridItem';

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

  computed: {
    visible() {
      return this.category.videos && this.category.videos.length;
    },
  },

  methods: {
    onReturnLeft() {
      const div = this.$refs.row.firstChild;
      this.$ek.select(div);
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
</style>
