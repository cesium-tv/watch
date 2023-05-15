<template>
  <b-loading
    v-model="visible"
    :is-full-page="true"
    :can-cancel="false"
  ></b-loading>
</template>

<script>
import axios from 'axios';

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
    axios.interceptors.request.use((config) => {
        this.inc();
        return config;
      }, (error) => {
        this.dec();
        return Promise.reject(error);
      });

    // Add a response interceptor
    axios.interceptors.response.use((response) => {
        this.dec();
        return response;
      }, (error) => {
        this.dec();
        return Promise.reject(error);
      });
  },
}
</script>

<style scoped>
</style>
