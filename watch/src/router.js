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

router.beforeEach((to, from, next) => {
  console.debug('router.beforeEach()');

  if (!CesiumTheme.auth_required) {
    console.debug('Auth not required')
    next();
    return;
  }

  if (to.path === '/login') {
    next();
    return;
  }

  if (store.getters.isAuthenticated) {
    console.debug('Authenticated')
    next();
  } else {
    console.debug('Not authenticated')
    next('/login');
  }
});

router.replace({ name: CesiumTheme.default_menu_item});

export default router;
