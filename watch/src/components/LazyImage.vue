<template>
  <img
    v-lazyload
    :style="`width: ${width}px; height: ${height}px; background-image: url(${imgLoading});`"
    :data-url="source"
    :alt="alt"
  >
</template>

<script>
import imgLoading from '@/assets/img-loading.png';
import LazyLoadDirective from '@/directives';

export default {
  name: 'LazyImage',

  directives: {
    lazyload: LazyLoadDirective,
  },

  data() {
    return {
      imgLoading,
    };
  },

  props: {
    source: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: 'Image',
    },
    width: {
      type: Number,
      default: 0,
    },
    height: {
      type: Number,
      default: 0,
    },
  },
}
</script>

<style scoped>
img {
  object-fit: contain;
}
</style>