import Vue from 'vue';
import ListProject from './components/ListProject.vue';

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
    projects: []
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
