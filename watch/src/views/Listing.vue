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
      channels: 'channels/channels',
      videosByChannel: 'videos/videosByChannel',
      playedVideos: 'videos/playedVideos',
    }),

    categories() {
      switch (this.$route.name) {
        case 'home':
          if (!this.channels) {
            return [];
          }

          return this.channels.map(c => {
            const videos = this.videosByChannel(c.uid);

            return {
              name: c.name,
              count: videos.length,
              videos,
            };
          });

        case 'resume':
          const videos = this.playedVideos;
          return [
            {
              name: 'Resume playing',
              count: videos.length,
              videos,
            }
          ];
      }
    },
  },

  mounted() {
    this.$store.dispatch('channels/get');
  },
};
</script>

<style scoped>
.p-1 {
  padding: 1em;
}
</style>