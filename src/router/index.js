import Vue from 'vue'
import VueRouter from 'vue-router'

// 在VueCLI创建的项目中@表示src目录
import Login from '@/views/login/'
import Layout from '@/views/layout/'
import Home from '@/views/home/'
import Artcile from '@/views/article'

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
      },
      {
        path: '/article',
        name: 'article',
        component: Artcile
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

// 路由导航守卫，所有页面的导航都会经过这里
// to:要去的路由页面信息
// from:来自哪里的路由信息
// next:放行方法
router.beforeEach((to, from, next) => {
  // 如果要访问的页面不是login，校验登录状态
  // 如果没有登录，跳转到登录页面
  // 如果登陆了，则允许通过
  // 允许通过
  // next()

  const user = JSON.parse(window.localStorage.getItem('user'))

  // 校验非登录页面的登录状态
  if (to.path !== '/login') {
    if (user) {
      // 已登录，允许通过
      next()
    } else {
      // 没有登录，跳转到登录页面
      next('./login')
    }
  } else {
    // 登录页面，正常允许通过
    next()
  }
})

export default router
