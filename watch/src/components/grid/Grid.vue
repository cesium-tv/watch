<template>
  <div>
    <GridRow
      v-for="(category, i) in categories"
      :key="i"
      :category="category"
    />
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

  mounted() {
    // Select the first video once our data is rendered.
    //document.arrive('div.video', { onceOnly: true }, (el) => {
    //  this.$ek.select(el);
    //});
  },
}
</script>

<style lang="scss">
</style>
