<template>
    <div class="p-1">
      <div class="logo">
        <img
          id="logo"
          alt="Video player"
        />
      </div>
      <b-menu
        class="is-large"
      >
        <div
          v-for="item in menu"
          :key="item.name"
          @ek:selected="$emit('show')"
          @ek:deselected="$emit('hide')"
          data-ek-activate-event-name="click"
          data-ek-activate-event-target="a"
          class="ek-selectable"
        >
          <b-menu-list>
            <b-menu-item
              :icon="item.icon"
              :label="item.label"
              tag="router-link"
              :to="item.to"
            ></b-menu-item>
          </b-menu-list>
        </div>
      </b-menu>
    </div>
</template>

<script>
const MENU = {
  options: {
    icon: "cog",
    label: "Options",
    to: "/options",
  },
  subscriptions: {
    icon: "account-star",
    label: "Subsciptions",
    to: "/subscriptions",
  },
  again: {
    icon: "refresh",
    label: "Watch Again",
    to: "/again",
  },
  latest: {
    icon: "clock-alert",
    label: "Latest",
    to: "/latest",
  },
  oldies: {
    icon: "clock",
    label: "Oldest",
    to: "/oldest",
  },
  home: {
    icon: "home",
    label: "Home",
    to: "/",
  },
  search: {
    icon: "magnify",
    label: "Search",
    to: "/search",
  },
  resume: {
    icon: "play-pause",
    label: "Resume",
    to: "/resume",
  },
  login: {
    icon: "login",
    label: "Login",
    to: "/login",
  }
};

export default {
  name: 'Sidebar',

  computed: {
    menu() {
      const menu = [];

      CesiumTheme.menu.forEach(o => {
        const menuItem = MENU[o.name];
        if (o.title) {
          menuItem.label = o.title;
        }
        menu.push(menuItem);
      });

      return menu;
    }
  },
};
</script>

<style lang="scss">
.ek-selected ul li a {
  background-color: var(--primary);
  color: var(--white);
}

.logo {
  text-align: center;
  padding-top: 5px;
}

.menu-list li {
  height: 40px;
}

.menu {
  position: absolute;
  top: 110px;
}
</style>