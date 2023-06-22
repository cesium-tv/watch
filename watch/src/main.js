import Vue from "vue";
import Errokees from 'errokees';
import Buefy from 'buefy';
import * as Sentry from '@sentry/vue';
import smoothscroll from 'smoothscroll-polyfill';
import 'arrive';
import '@procot/webostv';
import '@mdi/font/css/materialdesignicons.css';
import 'plyr/dist/plyr.css';
import App from "./App.vue";
import router from "@/router";
import store from '@/store'
import { SENTRY_DSN } from '@/config';

smoothscroll.polyfill();

Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue();

Vue.use(Buefy);

Sentry.init({
  Vue,
  dsn: SENTRY_DSN,
  integrations: [
    new Sentry.BrowserTracing({
      // Set `tracePropagationTargets` to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ["localhost", /^http:\/\/watch\.cesium\.tv\//],
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

Vue.prototype.$ek = new Errokees({
  origin: 'right',
  scroll: false,
  selectEvent: {
    name: 'ek:selected',
  },
  deselectEvent: {
    name: 'ek:deselected',
  },
  elementTypes: [],
  mouse: false,
  observerRoot: null,  // Remove when we update errokees.
  observerMargin: '0px',
});

new Vue({
  router,
  store,

  render(h) {
    return h(App);
  },
}).$mount("#app");
