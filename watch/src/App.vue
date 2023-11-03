<template>
  <div>
    <VideoPlayer></VideoPlayer>
    <ion-router-outlet></ion-router-outlet>
  </div>
</template>

<script>
import { IonRouterOutlet } from '@ionic/vue';
import VideoPlayer from '@/components/VideoPlayer.vue';

export default {
  components: {
    VideoPlayer,
    IonRouterOutlet,
  }
};
</script>

<style scoped>
</style>
