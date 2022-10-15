import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all role can be accessed
 */
export const constantRoutes = [
  {
    path: '/',
    redirect: '/navi'
  },
  {
    path: '/init',
    component: () => import('@/views/init/index')
  },
  {
    path: '/navi',
    component: () => import('@/views/index'),
    meta: {
      keepAlive: true // 不需要缓存
    },
    children: [
      {
        path: 'login',
        meta: {
          showDialog: true,
          toRoot: true
        },
        component: () => import('@/views/navi/login/index')
      },
      {
        path: 'resetPassword',
        meta: {
          showDialog: true,
          toRoot: true
        },
        component: () => import('@/views/navi/resetPassword/index')
      },
      {
        path: 'register',
        meta: {
          showDialog: true,
          toRoot: true
        },
        component: () => import('@/views/navi/register/index')
      },
      {
        path: 'vip',
        meta: {
          showDialog: true
        },
        component: () => import('@/views/navi/vip/index')
      },
      {
        path: 'config',
        meta: {
          showDialog: true
        },
        component: () => import('@/views/navi/config/index')
      },
      {
        path: 'admin',
        meta: {
          showDialog: true
        },
        component: () => import('@/views/admin/index'),
        children: [
          {
            path: 'user',
            meta: {
              showDialog: true
            },
            component: () => import('@/views/admin/user')
          },
          {
            path: 'url',
            meta: {
              showDialog: true
            },
            component: () => import('@/views/admin/url')
          },
          {
            path: 'card',
            meta: {
              showDialog: true
            },
            component: () => import('@/views/admin/card')
          },
          {
            path: 'emailToken',
            meta: {
              showDialog: true
            },
            component: () => import('@/views/admin/emailToken')
          },
          {
            path: 'emailTran',
            meta: {
              showDialog: true
            },
            component: () => import('@/views/admin/emailTran')
          }
        ]
      }
    ]
  },

  {
    path: '/404',
    component: () => import('@/views/page404'),
    hidden: true
  }
]

const createRouter = () => new Router({
  mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// export function resetRouter() {
//   const newRouter = createRouter()
//   router.matcher = newRouter.matcher // reset router
// }

export default router
