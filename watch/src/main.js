import { IonicVue } from '@ionic/vue';
import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import store from '@/store';
import Errokees from 'errokees';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Polyfills */
import 'object.entries/auto';
import 'array.prototype.tosorted/auto';

const app = createApp(App);

app.config.globalProperties.$ak = new Errokees({
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

app.use(router);
app.use(store);
app.use(IonicVue);

router.isReady().then(() => {
    app.mount('#app');
});
