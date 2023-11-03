<template>
    <grid
        :categories="channels"
    ></grid>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Grid from '@/components/grid/Grid.vue';
import Video from '@/components/Video.vue';
import { VIDEO_LIST_COL_WIDTH } from '@/config';

export default {
    name: 'VideoGrid',

    components: {
        Video,
        Grid,
    },

    props: {
        width: {
            type: Number,
        },
    },

    data() {
        return {
        };
    },

    mounted() {
        this.refresh();
    },

    methods: {
        ...mapActions({
            refresh: 'videos/refresh',
        }),
    },

    computed: {
        ...mapGetters({
            channels: 'videos/videosByChannel',
        }),

        columns() {
            return Math.ceil(this.width / VIDEO_LIST_COL_WIDTH);
        },
    },
};
</script>

<style>
</style>