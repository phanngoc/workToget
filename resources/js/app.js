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
import moment from 'moment';
import FullCalendar from 'vue-full-calendar';
import infiniteScroll from 'vue-infinite-scroll';
import MainApp from './components/MainApp.vue';

import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory'
import VueApollo from 'vue-apollo'
import { ApolloLink } from 'apollo-link';
import cronstrue from 'cronstrue';

var BASE_URL = $('meta[name="baseUrl"]').attr('content');

const httpLink = new HttpLink({ uri: BASE_URL + '/graphql' });

const authMiddleware = new ApolloLink((operation, forward) => {
  // add the authorization to the headers
  operation.setContext({
    headers: {
      authorization: localStorage.getItem('access_token') || null,
    }
  });

  return forward(operation);
});

const apolloClient = new ApolloClient({
  link: authMiddleware.concat(httpLink),
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
});

// Install the vue plugin
Vue.use(VueApollo)

const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

Vue.use(infiniteScroll)

Vue.use(FullCalendar);

Vue.use(require('vue-moment'));

Vue.use(VueSocketio, BASE_URL, store);

Vue.use(Element);

Vue.mixin({
  data: function() {
    return {
      get baseUrl() {
        return BASE_URL;
      }
    }
  },
  filters: {
    calendar: function(value) {
      return moment(value).calendar();
    },
    timeAgo: function(value) {
      return moment(value).fromNow();
    },
    imageLoad: function(name, type) {
      if (type == 'img') {
        return '/img/' + name;
      } else if (type == 'upload') {
        return '/uploads/' + name;
      }
    },
    cron: function (value) {
      if (typeof value !== 'undefined') {
        return cronstrue.toString(value);
      }
      return '';
    },
    isImage: function(type) {
      var ValidImageTypes = ["image/gif", "image/jpeg", "image/png"];
      if ($.inArray(type, ValidImageTypes) < 0) {
        return false;
      } else {
        return true;
      }
    }
  },
  methods: {
    me_activity(activity) {
      let type = activity.action;
      let action = "";
      switch (type) {
        case "save_edit_comment":
          action = "updated comment on";
          break;
        case "save_add_comment":
          action = "added comment on";
          break;
        case "event_add_comment":
          action = "added comment on";
          break;
        case "event_update_comment":
          action = "updated comment on";
          break;
        case "event_delete_comment":
          action = "deleted comment on";
          break;
        case "add_event":
          action = "created event";
          break;
        case "create_label":
          action = "created label name";
          break;
        case "save_add_task":
          action = "created task name";
          break;
        default:

      }
      return {action: action};
    },
    me_notification(notification) {

    },
    slugUrl: function(text) {
      return text
        .toLowerCase()
        .replace(/[^\w ]+/g,'')
        .replace(/ +/g,'-');
    },
    showLess: function (text, length, textMore, isTrip) {
      textMore = (typeof textMore !== 'undefined') ?  textMore : "...";
      isTrip = (typeof isTrip !== 'undefined') ?  isTrip : false;
      let strip = function (html) {
         var tmp = document.createElement("div");
         tmp.innerHTML = html;
         return tmp.textContent || tmp.innerText || "";
      };
      if (isTrip) {
        text = strip(text);
      }
      return text.slice(0, length) + ' ...';
    },
    getColorByTime: function(time) {
      let countDay = moment(time).diff(moment(), 'days');
      let color = {past: '#b04632', future: '#D9B51C', none: '#97a8be'};
      let colorDuaDate = color.none;
      if (countDay > 1) {
        colorDuaDate = color.none;
      } else if (countDay == 1) {
        colorDuaDate = color.future;
      } else if (countDay == -1) {
        colorDuaDate = color.past;
      } else if (countDay == 0) {
        colorDuaDate = color.past;
      } else if (countDay < -1) {
        colorDuaDate = color.none;
      }
      return colorDuaDate;
    },
    bytesToSize: function (bytes) {
       var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
       if (bytes == 0) return '0 Byte';
       var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
       return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }
  }
});

Vue.use(VeeValidate, {errorBagName: 'vErrors', fieldsBagName: 'vFields',});

const router = middleware(routes);

const unsync = sync(store, router)

const app = new Vue({
    el: '#app',
    apolloProvider,
    store,
    router,
});
