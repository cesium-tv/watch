<template>
  <div>
    <Grid
      :categories="categories"
    />
  </div>
</template>

<script>
import Grid from '@/components/Grid';

export default {
  name: 'Listing',

  components: {
    Grid,
  },

  computed: {
    categories() {
      switch (this.$route.name) {
        case 'home':
          const channels = this.$store.getters['channels'];

          if (channels) {
            return channels
              .filter(c => c.videos)
              .map(c => {
                return {
                  title: c.title,
                  videos: this.$store.getters.getVideosByChannel(c.uid),
                }
              });
          }
      }
    }
  },

  mounted() {
    this.$store.dispatch('updateChannels');
    this.$store.dispatch('updateVideos');
  },
};
</script>
