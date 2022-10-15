import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import url from './modules/url'
import operate from './modules/operate'
import scroll from './modules/scroll'
import init from './modules/init'
Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    user,
    url,
    operate,
    scroll,
    init
  },
  getters
})

export default store
