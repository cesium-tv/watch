<template>
  <div class="sidebar-page">
    <section class="sidebar-layout">
      <b-sidebar
        class="is-shadowless"
        :fullheight="true"
        :fullwidth="false"
        :overlay="false"
        :right="false"
        :reduce="reduce"
        :open="true"
        :can-cancel="false"
        position="fixed"
      >
        <Menu
          @show="reduce=false"
          @hide="reduce=true"
        />
      </b-sidebar>
      <div
        id="main"
        :style="style"
      >
        <router-view/>
      </div>
    </section>
    <Video/>
    <Loading/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Menu from '@/components/Menu.vue';
import Video from '@/components/player/Video.vue';
import Loading from '@/components/Loading.vue';

export default {
  name: 'App',

  components: {
    Menu,
    Video,
    Loading,
  },

  data() {
    return {
      reduce: true,
    };
  },

  computed: {
    ...mapGetters(['isAuthenticated']),

    style() {
      return `padding-left: ${(this.reduce) ? 60 : 170}px;`;
    },
  },
}
</script>

<style lang="scss">
#main {
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  overflow: hidden;
}

.sidebar-page {
    display: flex;
    flex-direction: column;
    width: 100%;
    min-height: 100%;
    // min-height: 100vh;
    .sidebar-layout {
        display: flex;
        flex-direction: row;
        min-height: 100%;
        // min-height: 100vh;
    }
}

.b-sidebar {
    .sidebar-content {
      width: 164px;
        &.is-mini {
          width: 54px;
            &:not(.is-mini-expand),
            &.is-mini-expand:not(.is-mini-delayed) {
                .menu-list {
                    li {
                        a {
                            span:nth-child(2) {
                                display: none;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
