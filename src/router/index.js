import Vue from 'vue'
import VueRouter from 'vue-router'

// 在VueCLI创建的项目中@表示src目录
import Login from '@/views/login/'
import Layout from '@/views/layout/'
import Home from '@/views/home/'

Vue.use(VueRouter)

// 路由配置表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // 如果有默认子路由，就不要给父路由起名字，不然会警告
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '', // path为空，会作为默认子路由渲染
        name: 'home',
        component: Home
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router
