<template lang="html">
  <div class="list-pro row">
    <div v-for="project in projects" class="card col-md-3">
      <ItemProject :project="project"></ItemProject>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import ItemProject from './ItemProject.vue';

export default {
  created() {

  },
  data: () => {
    return {
      projects: [],
      mode: 0
    }
  },
  methods: {
    switchEditMode: function() {

    }
  },
  components: {
    ItemProject
  },
  mounted() {
    var self = this;
    axios.get(this.baseUrl + '/api/3/projects')
      .then(function (response) {
        if (response.status == 200) {
          self.projects = response.data.projects;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }
}
</script>

<style lang="scss" scoped>
  .list-pro {

  }
</style>
