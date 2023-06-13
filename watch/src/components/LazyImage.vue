<template>
  <img
    v-lazyload
    class="image-item"
    :data-url="source"
    :alt="alt"
  >
</template>

<script>
import LazyLoadDirective from '@/directives';

export default {
  name: 'LazyImage',

  directives: {
    lazyload: LazyLoadDirective,
  },

  props: {
    source: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: 'Image',
    }
  },
}
</script>

<style scoped>
</style>
