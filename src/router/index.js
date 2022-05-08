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
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/tv.vue')
  },
  {
    path: '/movie',
    name: 'movie',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/movie.vue')
  },
  {
    path: '/variety',
    name: 'variety',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/variety.vue')
  },
  {
    path: '/comic',
    name: 'comic',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/comic.vue')
  },
  {
    path: '/player' ,
    name: 'player',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/player.vue')
  },
  {
    path: '/search' ,
    name: 'search',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
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
