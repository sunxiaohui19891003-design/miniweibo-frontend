import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Timeline from '../views/Timeline.vue'
import Login from '../views/Login.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/timeline',
      name: 'timeline',
      component: Timeline
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/messages',
      component: () => import('../views/Messages.vue')
    },
    {
      path: '/users',
      component: () => import('../views/Users.vue')
    },
    {
      path: '/notifications',
      component: () => import('../views/Notifications.vue')
    }
  ],
})

export default router
