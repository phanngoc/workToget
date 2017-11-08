<template lang="html">
  <div id="surface">
    <nav class="navbar nav-menu">
      <div class="container">
        <router-link class="navbar-brand" :to="{ name: 'homepage'}">
          <img src="/img/logo.png" width="48" height="48" alt="logo">
        </router-link>
        <div class="wr-create-project">
          <router-link :to="{ name: 'create_project' }">
            Create project
          </router-link>
        </div>
        <Notification />
      </div>
    </nav>
    <div id="main-app">
      <div class="wrap-full-content">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';
import Notification from './Notification';

export default {
  created() {
  },
  sockets:{
    server_connect: function(){
      this.$socket.emit('ADD_ID_CONNECT', this.user.id);
      console.log('socket connected');
    },
    disconnect: function(){
      console.log('socket disconnected');
    }
  },
  data: () => {
    return {

    }
  },
  computed: {
    ...mapState('auth', [
      'user'
    ]),
  },
  watch: {

  },
  methods: {

  },
  components: {
    Notification
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
  .wr-create-project{
    float: right;
  }
</style>
