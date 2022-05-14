import { createRouter, createWebHashHistory  } from 'vue-router'
import Home from '../views/Home.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/tv',
    name: 'tv',
    component: () => import('../views/tv.vue')
  },
  {
    path: '/movie',
    name: 'movie',
    component: () => import('../views/movie.vue')
  },
  {
    path: '/variety',
    name: 'variety',
    component: () => import('../views/variety.vue')
  },
  {
    path: '/comic',
    name: 'comic',
    component: () => import('../views/comic.vue')
  },
  {
    path: '/player' ,
    name: 'player',
    component: () => import('../views/player.vue')
  },
  {
    path: '/search' ,
    name: 'search',
    component: () => import('../views/search.vue')
  }
  
]

const router = createRouter({
  // history: createWebHistory(),
  history: createWebHashHistory(),
  base: '/videos/',
  routes
})

export default router
