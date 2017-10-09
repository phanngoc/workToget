<template lang="html">
  <section class="card-fra" v-if="mode==0">
    <img class="logo" :src="project.logo" alt="Card image cap">
    <div class="card-block">
      <h4 class="card-title"><a :href="'/projects/'+project.id">{{project.name}}</a></h4>
      <p class="card-text">{{project.description}}</p>
      <a href="#" class="btn btn-primary" :id="project.id" @click="switchEditMode">Edit</a>
      <a href="#" @click="togglePint"><i :class="{'fa fa-bookmark': is_pinned, 'fa fa-bookmark-o': !is_pinned}" aria-hidden="true"></i></a>
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
      <a href="javascript:" class="btn btn-default" @click="switchBack">Back</a>
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
      description: this.project.description,
      is_pinned: this.project.is_pinned
    }
  },
  methods: {
    switchEditMode: function() {
      this.mode=1;
    },
    switchBack: function() {
      this.mode=0;
    },
    togglePint: function() {
      let self = this;
      this.is_pinned = 1 - this.is_pinned;
      axios({
        method: 'put',
        url: this.baseUrl + '/api/projects/' + self.id + '/update-pin',
        data: {
          is_pinned: self.is_pinned
        }
      }).then(function(response) {
        if (response.status != 200) {
          self.is_pinned = 1 - self.is_pinned;
        }
      });
    },
    saveProject: function() {
      var self = this;
      axios({
        method: 'post',
        url: this.baseUrl + '/api/projects/' + self.id + '/update',
        data: {
          name: self.name,
          description: self.description
        }
      }).then(function(response) {
        if (response.status == 200) {
          self.mode=0;
        }
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
