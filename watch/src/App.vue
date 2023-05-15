<template>
  <div>
    <div>
      <section class="sidebar-layout">
        <Sidebar/>
        <router-view/>
      </section>
      <Video
        v-model="video"
        v-if="video"
        @play="$errokees.pause()"
        @stop="$errokees.resume()"
      />
      <Loading/>
    </div>
    <!--<Login v-if="isAuthenticated === false"/>-->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Sidebar from '@/components/Sidebar';
import Grid from '@/components/Grid';
import Video from '@/components/player/Video';
import Loading from '@/components/Loading';
import Login from '@/components/Login';

export default {
  name: 'App',

  components: {
    Sidebar,
    Grid,
    Video,
    Loading,
    Login,
  },

  data() {
    return {
      video: null,
    };
  },

  computed: {
    ...mapGetters(['isAuthenticated']),
  },

  mounted() {
    this.$bus.$on('video:play', video => {
      this.$bus.$emit('busy');
      this.video = video;
    });
  },

  unmounted() {
    this.$errokees.disable();
    this.$errokees = null;
  },
}
</script>

<style>
</style>
