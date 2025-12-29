import Vue from 'vue'
import VueRouter from 'vue-router'
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
    component:()=>import('../views/elem/UserView.vue')//,
    //meta:{requireAuth:true}
  },
  {
    path:'/dish',
    name:'dish',
    component:()=>import('../views/elem/DishView.vue')//,
    //meta:{requireAuth:true}
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

export default router
