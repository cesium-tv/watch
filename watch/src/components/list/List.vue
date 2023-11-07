<template>
    <div
        id="list"
    >
        <div
            v-for="(row, i) of items"
            :key="i"
            class="row"
        >
            <component
                v-for="(item, i) of row"
                :key="i"
                :is="itemComponent"
                :item="item"
            ></component>
        </div>
    </div>
</template>

<script>
// TODO: use RecycleScroller
import Video from '@/components/Video.vue';

export default {
    name: 'List',

    props: {
        items: {
            type: Array,
            default: [],
        },

        itemComponent: {
            type: Object,
            default: Video,
        }
    },
};
</script>

<style scoped>
#list {
    /*display: flex;*/
    position: absolute;
    top: 82px;
    bottom: 0;
    overflow-x: hidden;
}

.row {
    display: inline-block;
}
</style>
