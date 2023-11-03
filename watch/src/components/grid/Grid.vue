<template>
    <div
        class="grid"
    >
        <grid-row
            v-for="(channel, i) in channels"
            :key="i"
            :name="channel.name"
            :items="channel.videos"
            ref="rows"
        ></grid-row>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import  GridRow from '@/components/grid/GridRow.vue';

export default {
    name: 'Grid',

    components: {
        GridRow,
    },

    props: {
        categories: {
            type: Array,
            default: [],
        }
    },

    computed: {
        ...mapGetters({
            channels: 'videos/videosByChannel',
        }),
    },
};
</script>

<style>
.grid {
    width: 100%;
    height: 100%;
}
</style>
