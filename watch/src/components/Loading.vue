<template>
  <b-loading
    v-model="visible"
    :is-full-page="true"
    :can-cancel="false"
  ></b-loading>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Loading',

  data() {
    return {
      count: 0,
    };
  },

  computed: {
    ...mapGetters({
      visible: 'playing/isBusy',
    }),
  },
}
</script>

<style scoped>
</style>
