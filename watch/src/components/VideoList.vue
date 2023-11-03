<template>
    <div></div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Video from '@/components/Video.vue';
import { VIDEO_LIST_COL_WIDTH } from '@/config';

export default {
    name: 'VideoList',

    components: {
        Video,
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
            videos: 'videos/videosByPublishedTime',
        }),

        columns() {
            return Math.floor(this.width / VIDEO_LIST_COL_WIDTH);
        },

        rows() {
            if (!this.videos) return;

            const rows = [[]];

            for (const i in this.videos) {
                const row = Math.floor(i / this.columns);
                const col = i % this.columns;
                if (row > rows.length - 1) {
                    rows.push([]);
                }
                rows[row][col] = this.videos[i];
            }

            return rows;
        },
    },
};
</script>

<style scoped>
.row {
    display: inline-block;
}
</style>
