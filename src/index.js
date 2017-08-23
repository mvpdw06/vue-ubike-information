import Vue from 'vue'

import app from './app/app.vue'
import styles from './index.css'

var vm = new Vue({
  el: '#app',
  render: h => h(app)
})
