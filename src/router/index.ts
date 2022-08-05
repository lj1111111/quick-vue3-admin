import { createRouter, createWebHashHistory } from 'vue-router'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import pinia from '@/store'
import { useLoginStore } from '@/store/modules/login'
import staticRouter from './staticRouter'
import { addRoutes } from './dynamicRouter'

export const router = createRouter({
  history: createWebHashHistory(),
  routes: [...staticRouter],
})
router.beforeEach((to, from, next) => {
  NProgress.start()
  const loginStore = useLoginStore(pinia)
  if (loginStore.getToken) {
    if (!to.name) {
      addRoutes(router)
      next({ ...to, replace: true })
    } else {
      next()
    }
  } else if (to.path === '/login') {
    next()
  } else {
    next('/login')
  }
})
router.afterEach(() => {
  NProgress.done()
})
