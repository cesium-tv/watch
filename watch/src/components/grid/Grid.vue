<template>
  <div
    ref="rows"
  >
    <GridRow
      v-for="(category, i) in categories"
      :key="i"
      :category="category"
    />
    <div
      v-if="visible"
      class="row"
    >
      <div
        class="card is-shadowless ek-selectable return"
        style="height: 68px; width: 480px;"
        data-ek-activate-event-name="ek:activate"
        @ek:activate="onReturnTop"
      >
        <div class="card-image">
          <figure class="image is-centered is-vcentered">
            <b-icon
              style="margin-left: 216px; margin-top: 10px;"
              icon="arrow-u-up-left"
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
import GridRow from '@/components/grid/GridRow';

export default {
  name: 'Grid',

  components: {
    GridRow,
  },

  props: {
    categories: {
      type: Array,
      default: null,
    }
  },

  computed: {
    visible() {
      if (!this.categories) return false;

      let categoriesWithVideos = 0;
      for (const category of this.categories) {
        if (category.videos && category.videos.length) categoriesWithVideos++;
      }
      return categoriesWithVideos > 2;
    },
  },

  mounted() {
    // Select the first video once our data is rendered.
    //document.arrive('div.video', { onceOnly: true }, (el) => {
    //  this.$ek.select(el);
    //});
  },

  methods: {
    onReturnTop() {
      const div = this.$refs.rows.firstChild.children[1].firstChild;
      console.log(div);
      this.$ek.select(div);
    },
  },
}
</script>

<style lang="scss">
.row {
  display: flex;
  overflow-x: hidden;
  overflow-y: hidden;
  height: 404;
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
