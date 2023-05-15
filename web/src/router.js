import Vue from 'vue';
import Router from 'vue-router';
import Subscriptions from '@/views/Subscriptions';
import Search from '@/views/Search';
import Settings from '@/views/Settings';
import Login from '@/views/Login';
import Listing from '@/views/Listing';
import store from './store';

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      name: 'home',
      component: Listing,
    },
    {
      path: '/subscriptions',
      name: 'subscriptions',
      component: Subscriptions,
    },
    {
      path: '/search',
      name: 'search',
      component: Search,
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings,
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/resume',
      name: 'Resume',
      component: Listing,
    },
  ]
});

router.replace({ name: CesiumTheme.default_menu_item});

router.beforeEach((to, from, next) => {
  if (CesiumTheme.auth_required && !store.isAuthenticated && to.path !== '/login') {
    next('/login');
    return;
  }
  next();
});

export default router;
