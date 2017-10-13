import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store'
import routes from './router'
import middleware from './router/middleware'
import Vuex from 'vuex'
import VeeValidate from 'vee-validate';
import Element from 'element-ui';
import 'element-ui/lib/theme-default/index.css';

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

const app = new Vue({
    el: '#main-app',
    store,
    router,
});
