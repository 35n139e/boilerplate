import Vue from 'vue'
import store from './store.js'

import Matrix from './components/Matrix'


// Vue.config.productionTip = false

new Vue({
  el: '#app',
  // data,
  store,

  components: {
    "matrix": Matrix,
  }
});