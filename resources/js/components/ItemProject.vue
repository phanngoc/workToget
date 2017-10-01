<template lang="html">
  <section class="card-fra" v-if="mode==0">
    <img class="logo" :src="project.logo" alt="Card image cap">
      <div class="card-block">
        <h4 class="card-title">{{project.name}}</h4>
        <p class="card-text">{{project.description}}</p>
        <a href="#" class="btn btn-primary" :id="project.id" @click="switchEditMode">Edit</a>
      </div>
  </section>
  <section class="card-fra" v-else-if="mode==1">
    <form @submit.prevent="saveProject">
      <input type="hidden" name="id" v-model="id" />
      <div class="form-group">
        <label for="name">Name</label>
        <input type="text" class="form-control" name="name" v-model="name"/>
      </div>
      <div class="form-group">
        <label for="name">Description</label>
        <textarea class="form-control" name="description" v-model="description"></textarea>
      </div>
      <a href="javascript" class="btn btn-default" @click="switchBack">Back</a>
      <button type="submit" class="btn btn-primary">Save</button>
    </form>
  </section>
</template>

<script>

import axios from 'axios';

export default {
  created() {

  },
  props: {
     project: {}
  },
  data: function () {
    return {
      mode: 0,
      id: this.project.id,
      name: this.project.name,
      description: this.project.description
    }
  },
  methods: {
    switchEditMode: function() {
      this.mode=1;
    },
    switchBack: function() {
      this.mode=0;
    },
    saveProject: function() {
      console.log("Save project");
      var self = this;
      axios({
        method: 'post',
        url: this.baseUrl + '/api/projects/' + self.id + '/update',
        data: {
          firstName: 'Fred',
          lastName: 'Flintstone'
        }
      }).then(function(response) {

      });
    }
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
  .logo{
    height: 135px;
    width: 100%;
  }
</style>
