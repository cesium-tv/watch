import Vue from "vue";
import Errokees from 'errokees';
import Buefy from 'buefy';
import smoothscroll from 'smoothscroll-polyfill';
import 'arrive';
import '@procot/webostv';
import '@mdi/font/css/materialdesignicons.css';
import App from "./App.vue";
import router from "./router";
import store from '@/store'

smoothscroll.polyfill();

// function handleError() {
//   let messages = []
//   for (let i = 0; i < arguments.length; i++) {
//     messages.push(arguments[i].toString());
//   }
//   messages = messages.join('\r\n');

//   document.documentElement.innerHTML =
//     '<div style="width: 100%; height: 100%; background-color: black;">' +
//     '<pre style="background-color: black; color: blue;">' + messages + '</pre>' +
//     '</div>';
// }

// window.onerror = function(msg, url, line, col, error) {
//   //console.error(msg, url, line, col, error);
//   handleError(url, msg, 'Line: ' + line, 'Col: ' + col);
// }

// window.addEventListener('unhandledrejection', function(event) {
//   //console.error(event);
//   handleError(event.promise, event.reason);
// });

Vue.config.productionTip = false;
Vue.prototype.$bus = new Vue();
Vue.prototype.$errokees = new Errokees(null, {
  origin: 'right',
  scroll: false,
  selectEvent: {
    name: 'errokees:selected',
  },
  deselectEvent: {
    name: 'errokees:deselected',
  },
});

Vue.use(Buefy);

new Vue({
  router,
  store,

  render(h) {
    return h(App);
  },
}).$mount("#app");
