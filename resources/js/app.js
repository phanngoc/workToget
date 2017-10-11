import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import routes from './router'
import middleware from './router/middleware'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate';

Vue.mixin({
  data: function() {
    return {
      get baseUrl() {
        return $('meta[name="baseUrl"]').attr('content');
      }
    }
  }
});

Vue.use(VeeValidate, {errorBagName: 'vErrors'});

const router = middleware(routes);

const app = new Vue({
    el: '#main-app',
    store,
    router,
});
