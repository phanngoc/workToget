import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import routes from './router'
import middleware from './router/middleware'
import Vuex from 'vuex'

Vue.mixin({
  data: function() {
    return {
      get baseUrl() {
        return $('meta[name="baseUrl"]').attr('content');
      }
    }
  }
});

const router = middleware(routes);

const app = new Vue({
    el: '#main-app',
    store,
    router,
});

