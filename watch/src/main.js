import Vue from "vue";
import Buefy from 'buefy';
import smoothscroll from 'smoothscroll-polyfill';
import '@procot/webostv';
import '@mdi/font/css/materialdesignicons.css';
import 'plyr/dist/plyr.css';
import '@/services/sentry';
import '@/services/errokees';
import App from "./App.vue";
import router from "@/router";
import store from '@/store';

smoothscroll.polyfill();

Vue.config.productionTip = false;

Vue.use(Buefy);

new Vue({
  router,
  store,

  render(h) {
    return h(App);
  },
}).$mount("#app");
