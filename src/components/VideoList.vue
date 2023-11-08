<template>
    <div>
        <Swipe
            :items="doubleChannels"
            selected-attr="uid"
            :item-component="channelComponent"
            v-model="currentChannel"
        ></Swipe>
        <List
            :items="rows"
            :item-component="videoComponent"
        ></List>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Swipe from '@/components/Swipe.vue';
import List from '@/components/list/List.vue';
import Avatar from '@/components/Avatar.vue';
import Video from '@/components/Video.vue';
import { VIDEO_LIST_COL_WIDTH } from '@/config';

export default {
    name: "VideoList",

    components: {
        Swipe,
        List,
        Avatar,
        Video,
    },

    props: {
        width: {
            type: Number,
            default: 0,
        },
    },

    data() {
        return {
            currentChannel: null,
        };
    },

    mounted() {
        this.refresh();
        this.channelComponent = Avatar;
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
            videosByPublishedTime: 'videos/videosByPublishedTime',
            videosForChannel: 'videos/videosForChannel',
        }),

        doubleChannels() {
            var double = [];
            double.push(...this.channels);
            double.push(...this.channels);
            return double;
        },

        videos() {
            if (!this.currentChannel) {
                return this.videosByPublishedTime;
            } else {
                return this.videosForChannel(this.currentChannel);
            }
        },

        columns() {
            return Math.floor(this.width / VIDEO_LIST_COL_WIDTH);
        },

        rows() {
            // Reshape results from [o,o,o,o] to [[o,o],[o,o]]
            // for a given column count
            if (!this.videos) return;

            const rows = [[]];

            for (const i in this.videos) {
                const row = Math.floor(i / this.columns);
                const col = i % this.columns;
                if (row == rows.length) {
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
</style>
