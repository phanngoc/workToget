<template lang="html">
  <div class="form-wrap" >
    <form id="form-login" v-on:submit.prevent="submitLogin">
      <div class="form-group">
        <label for="email">Username</label>
        <input type="text" v-model="username" name="username" class="form-control" id="username">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input type="password" v-model="password" name="password" class="form-control" id="password">
      </div>
      <div class="checkbox">
        <label><input type="checkbox"> Remember me</label>
      </div>
      <button type="submit" class="btn btn-default">Submit</button>
    </form>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';
import _ from 'lodash';

export default {
  created() {

  },
  props: [],
  data: function() {
    return {
      username: '',
      password: ''
    }
  },
  computed: {
  },

  methods: {
    submitLogin: function(e) {
      e.preventDefault();
      this.$store.dispatch('auth/login', {
        username: this.username,
        password: this.password
      });
    }
  },
  components: {

  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
</style>
