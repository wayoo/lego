import Vue from 'vue';
import VueRouter from 'vue-router';
// import Home from '../views/Home.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    redirect: '/decoration/8',
  },
  {
    path: '/decoration/:id',
    name: 'decoration',
    component: () => import('../views/decoration/index.vue'),
  },
  {
    path: '/client/:id',
    name: 'dynamicPages',
    component: () => import('../views/client/index.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  routes,
});

export default router;
