import router from './router'
import store from './store'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  // 已登录且路由去向为login、register
  if (from.meta.showDialog) {
    store.dispatch('user/setDialogVisible', false)
  }
  if (store.getters.isLogin && to.meta.toRoot) {
    next({ path: '/' })
  }
  if (to.matched.length === 0) {
    next({ path: '/' })
  }
  if (to.meta.showDialog) {
    store.dispatch('user/setDialogVisible', true)
  }
  next()
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
