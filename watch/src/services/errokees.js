import Vue from 'vue';
import Errokees from 'errokees';

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
