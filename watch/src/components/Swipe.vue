<template>
    <div
        id="swipe"
    >
        <component
            v-for="(item, i) of items"
            :key="i"
            :data="item"
            :is="itemComponent"
        ></component>
    </div>
</template>

<script>
import Channel from '@/components/Channel.vue';

export default {
    name: "Swipe",

    components: {
        Channel,
    },

    props: {
        items: {
            type: Array,
            default: [],
        },

        value: {
            type: Object,
            default: null,
        },

        itemComponent: {
            type: Object,
            default: Channel,
        }
    },
};
</script>

<style scoped>
swipe {

}
</style>
