import Vue from 'vue';
import ListProject from './project/ListProject.vue';
import Trello from './project/Trello.vue';

Vue.mixin({
  data: function() {
    return {
      get baseUrl() {
        return $('meta[name="baseUrl"]').attr('content');
      }
    }
  }
})

var app = new Vue({
  el: '#app-project',
  data: () => ({

  }),
  computed: {

  },
  methods: {

  },
  components: {
    listProject: ListProject
  },
  mounted() {

  }
});

var app = new Vue({
  el: '#project-trello',
  data: () => ({

  }),
  computed: {

  },
  methods: {

  },
  components: {
    trello: Trello
  },
  mounted() {

  }
});
