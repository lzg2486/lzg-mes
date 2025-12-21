import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import BusTaskView from '@/views/bus-task/index.vue'

console.log('[路由调试] 开始初始化路由配置')

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { title: '首页' }
    },
    {
      path: '/bus-task',
      name: 'busTask',
      component: BusTaskView,
      meta: { title: '班车任务' }
    }
  ]
})

// 路由守卫 - 添加调试日志
router.beforeEach((to, from, next) => {
  console.log('[路由调试] 路由跳转:', {
    from: from.path,
    to: to.path,
    name: to.name,
    meta: to.meta
  })
  next()
})

router.afterEach((to, from) => {
  console.log('[路由调试] 路由跳转完成:', {
    from: from.path,
    to: to.path,
    name: to.name
  })
})

console.log('[路由调试] 路由配置完成，路由数量:', router.getRoutes().length)
console.log('[路由调试] 所有路由:', router.getRoutes().map(r => ({ path: r.path, name: r.name })))

export default router

