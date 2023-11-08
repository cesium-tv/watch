<template>
    <Grid
        :items="channels"
        :sub-items-name="'videos'"
        :item-component="videoComponent"
    ></Grid>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Grid from '@/components/grid/Grid.vue';
import Video from '@/components/Video.vue';

export default {
    name: "VideoList",

    components: {
        Grid,
    },

    mounted() {
        this.refresh();
        this.videoComponent = Video;
    },

    methods: {
        ...mapActions({
            refresh: 'videos/refresh',
        }),
    },

    computed: {
        ...mapGetters({
            channels: 'videos/channels',
        }),
    },
};
</script>

<style scoped>
</style>
