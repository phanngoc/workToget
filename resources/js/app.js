import Vue from 'vue'
import store from './store'
import routes from './router'
import middleware from './router/middleware'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate';
import Element from 'element-ui';
import 'element-ui/lib/theme-default/index.css';
import VueSocketio from 'vue-socket.io';
import { sync } from 'vuex-router-sync';

Vue.use(require('vue-moment'));

Vue.use(VueSocketio, 'http://localhost:3000', store);

Vue.use(Element);

Vue.mixin({
  data: function() {
    return {
      get baseUrl() {
        return $('meta[name="baseUrl"]').attr('content');
      }
    }
  },
  methods: {
    showLess: function (text, length, textMore) {
      textMore = (typeof textMore !== 'undefined') ?  textMore : "...";
      return text.slice(0, length) + ' ...';
    }
  }
});

Vue.use(VeeValidate, {errorBagName: 'vErrors'});

const router = middleware(routes);

const unsync = sync(store, router)

const app = new Vue({
    el: '#main-app',
    store,
    router,
});
