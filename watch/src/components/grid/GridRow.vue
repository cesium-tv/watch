<template>
    <div
        class="grid-row"
    >
        <component
            v-for="(item, i) in items"
            :key="i"
            :is="component"
            :item="item"
            navUp=":parent:prev:first"
            navDown=":parent:next:first"
            navRight=":next"
            navLeft=":prev"
        ></component>
    </div>
</template>

<script>
import Video from '@/components/Video.vue';

export default {
    name: 'GridRow',

    props: {
        items: {
            type: Array,
            default: [],
        },

        component: {
            type: Object,
            default: Video,
        }
    },
};
</script>

<style>
.grid-row::-webkit-scrollbar {
    display: none;
}

.grid-row {
    display: flex;
    width: 100%;
    overflow-y: hidden;
}
</style>
