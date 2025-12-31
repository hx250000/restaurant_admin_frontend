import Vue from 'vue'
import VueRouter from 'vue-router'
//import { component } from 'vue/types/umd'
//import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path:'/user',
    name:'user',
    component:()=>import('../views/elem/UserView.vue'),
    meta:{requireAuth:true}
  },
  {
    path:'/dish',
    name:'dish',
    component:()=>import('../views/elem/DishView.vue'),
    meta:{requireAuth:true}
  },
  {
    path:'/order',
    name:'order',
    component:()=>import('../views/elem/OrderView.vue'),
//    meta:{requireAuth:true}
  },
  {
    path:'/login',
    name:'login',
    component: () => import('../views/elem/LoginView.vue') 
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // 检查路由是否需要登录
  if (to.matched.some(record => record.meta.requireAuth)) {
    const token = localStorage.getItem('jwt_token'); // 从 localStorage 获取 token
    if (!token) {
      // 如果没有 token，跳转到登录页面
      next('/login');
    } else {
      // 如果有 token，继续访问目标页面
      next();
    }
  } else {
    // 如果路由不需要登录，直接继续
    next();
  }
});

export default router
