import Vue from 'vue'
import VueRouter from 'vue-router'
import axios from "axios";
import Home from '../views/Home.vue'

Vue.use(VueRouter);

axios.defaults.baseURL = 'http://localhost:8020/';
Vue.prototype.$axios = axios;

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  }
];

const router = new VueRouter({
  routes
});

export default router
