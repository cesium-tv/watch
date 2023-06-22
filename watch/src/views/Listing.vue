<template>
  <div class="p-1">
    <Grid
      :categories="categories"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Grid from '@/components/grid/Grid.vue';

export default {
  name: 'Listing',

  components: {
    Grid,
  },

  computed: {
    ...mapGetters({
      channels: 'channels',
      playedVideos: 'getPlayedVideos',
    }),

    categories() {
      switch (this.$route.name) {
        case 'home':
          if (!this.channels) return;
          return this.channels.filter(c => c.n_videos);

        case 'resume':
          return [
            {
              name: 'Resume playing',
              videos: this.playedVideos,
            }
          ];
      }
    },
  },

  mounted() {
    this.$store.dispatch('updateChannels');
    this.$store.dispatch('updateVideos');
  },
};
</script>

<style scoped>
.p-1 {
  padding: 1em;
}
</style>