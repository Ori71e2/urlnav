import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN'

import './styles/index.scss' // global css
import _ from 'lodash'
Vue.prototype._ = _
import animated from 'animate.css'

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import { GLOBLE } from './utils/constrant/index'
Vue.prototype.GLOBLE = GLOBLE

Vue.use(ElementUI, animated, { locale })

import { VueJsonp } from 'vue-jsonp'
Vue.use(VueJsonp)

// 注册全局指令
// import permission from '@/directive/permission/index.js'
// Vue.use(permission)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
