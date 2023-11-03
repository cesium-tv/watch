<template>
    <div
        class="grid"
    >
        <grid-row
            v-for="(item, i) in items"
            :key="i"
            :name="item.name"
            :items="getSubItems(item)"
            :item-component="itemComponent"
            ref="rows"
        ></grid-row>
    </div>
</template>

<script>
import  GridRow from '@/components/grid/GridRow.vue';
import Video from '@/components/Video.vue';

export default {
    name: 'Grid',

    components: {
        GridRow,
    },

    props: {
        items: {
            type: Array,
            default: [],
        },

        subItemsName: {
            type: String,
            default: null,
        },

        itemComponent: {
            type: Object,
            default: Video,
        },
    },

    methods: {
        getSubItems(o) {
            return o[this.subItemsName];
        },
    },
};
</script>

<style>
.grid {
    width: 100%;
    height: 100%;
}
</style>
