<template>
  <div>
    <VideoPlayer></VideoPlayer>
    <Network></Network>
    <ion-router-outlet></ion-router-outlet>
  </div>
</template>

<script>
import { IonRouterOutlet } from '@ionic/vue';
import VideoPlayer from '@/components/VideoPlayer.vue';
import Network from '@/components/Network.vue';

export default {
  components: {
    VideoPlayer,
    Network,
    IonRouterOutlet,
  }
};
</script>

<style scoped>
</style>
