import Vue from 'vue';
import VueRouter from 'vue-router';

import Add from 'view/Room/Add';
import Login from 'view/Login/Login';
import Main from 'view/Main/Main';
import Me from 'view/Main/Me';
import Change from 'view/Main/Change';
import Member from 'view/Main/Member';
import Data from 'view/Main/Data';
import Task from 'view/Main/Task';
import Alarm from 'view/Main/Alarm';
import About from 'view/About/Index';
import Test from 'view/Test';

Vue.use(VueRouter);


export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/test',
      component: Test,
    },
    {
      path: '/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
    },
    {
      path: '/main',
      name: 'Main',
      component: Main,
    },
    {
      path: '/me',
      name: 'Me',
      component: Me,
    },
    {
      path: '/change/:id',
      name: 'Change',
      component: Change,
    },
    {
      path: '/member',
      name: 'Member',
      component: Member,
    },
    {
      path: '/data',
      name: 'Data',
      component: Data,
    },
    {
      path: '/task',
      name: 'Task',
      component: Task,
    },
    {
      path: '/alarm',
      name: 'Alarm',
      component: Alarm,
    },
    {
      path: '/add',
      name: 'Add',
      component: Add,
    },
    {
      path: '/about',
      name: 'About',
      component: About,
    },
        // 重定向
    {
      path: '/Vdo',
      redirect: '/movie/home',
    },
    {
      path: '/vdo',
      redirect: '/movie/home',
    },
    {
      path: '/vue-douban',
      redirect: '/movie/home',
    },
    {
      path: '/douban',
      redirect: '/movie/home',
    },
  ],
});
