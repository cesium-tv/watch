<template>
  <b-loading
    v-model="visible"
    :is-full-page="true"
    :can-cancel="false"
  ></b-loading>
</template>

<script>
import axios from '@/services/api';

export default {
  name: 'Loading',

  data() {
    return {
      count: 0,
    };
  },

  computed: {
    visible() {
      return this.count > 0;
    },
  },

  methods: {
    inc() {
      this.count++;
    },

    dec() {
      if (--this.count < 0) {
        this.count = 0
      }
    }
  },

  mounted() {
    this.$bus.$on('busy', () => this.inc());
    this.$bus.$on('idle', () => this.dec());
  },
}
</script>

<style scoped>
</style>
