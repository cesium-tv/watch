<template>
  <div>
    <div>
      <section class="sidebar-layout">
        <Sidebar/>
        <router-view/>
      </section>
      <Video/>
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

  computed: {
    ...mapGetters(['isAuthenticated']),
  },
}
</script>

<style>
body {
/*  cursor: none;*/
}
</style>
