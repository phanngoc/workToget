<template lang="html">
  <div id="surface">
    <nav class="navbar nav-menu">
      <div class="container">
        <a class="navbar-brand" href="#">
          <img src="/img/logo.png" width="48" height="48" alt="logo">
        </a>
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

export default {
  created() {
  },
  sockets:{
    connect: function(){
      this.$socket.emit('ADD_ID_CONNECT', this.user.id);
      console.log('socket connected');
    },
    disconnect: function(){
      this.$socket.emit('REMOVE_ID_CONNECT', this.user.id);
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

  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>

</style>
