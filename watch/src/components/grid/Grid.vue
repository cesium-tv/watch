<template>
  <div>
    <GridRow
      v-for="(category, i) in categories"
      :key="i"
      :name="category.name"
      :items="category.videos"
      :auto-select="i === 0"
      :data-index="i"
      ref="rows"
      @scrollTo="scrollToAndSelect"
    />
    <div
      v-if="returnVisible"
      class="row"
    >
      <div
        class="card is-shadowless ek-selectable return"
        style="height: 68px; width: 480px;"
        data-ek-activate-event-name="ek:activate"
        @ek:activate="onReturnToTop"
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
import GridRow from '@/components/grid/GridRow.vue';

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
    returnVisible() {
      return (this.categories && this.categories.length >= 3);
    },
  },

  methods: {
    onReturnToTop() {
      const row = this.$refs.rows.find(o => o.$attrs['data-index'] === 0).$el;
      const div = row.children[1].firstChild;
      this.scrollToAndSelect(div);
    },

    scrollToAndSelect(div) {
      div.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
      this.$ek.addEventListener('updated', () => {
        this.$ek.select(div);
      }, { once: true });
    },
  },
}
</script>

<style lang="scss" scoped>
.ek-selectable {
  border: solid 2px transparent;
}

.ek-selected {
  border: solid 2px var(--primary);
}
</style>
