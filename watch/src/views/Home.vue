<template>
  <ion-page>
    <ion-content>
        <component
            v-if="width"
            :is="is"
            :width="width"
            :item-component="itemComponent"
        ></component>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent } from '@ionic/vue';
import VideoList from '@/components/VideoList.vue';
import VideoGrid from '@/components/VideoGrid.vue';
import Video from '@/components/Video.vue';
import { VIDEO_LIST_IF_LT } from '@/config';

export default {
    name: 'Home',

    components: {
        IonPage,
        IonContent,
        VideoList,
        VideoGrid,
    },

    data() {
        return {
            width: null,
            itemComponent: Video,
        };
    },

    computed: {
        is() {
            // select component based on screen size.
            const is = (this.width <= VIDEO_LIST_IF_LT) ? VideoList : VideoGrid;
            return is;
        },
    },

    mounted() {
        // Set initial screen width
        this.onWindowResize();
        // Track changes in screen width
        window.addEventListener('resize', this.onWindowResize.bind(this));
    },

    unmounted() {
        // Clean up
        window.removeEventListener('resize', this.onWindowResize.bind(this));
    },

    methods: {
        onWindowResize() {
            this.width = window.innerWidth;
        },
    },
}
</script>

<style>
</style>