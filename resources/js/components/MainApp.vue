<template lang="html">
  <div id="surface">
    <nav class="navbar nav-menu">
        <div class="col-md-12">
          <div id="in-header">
            <router-link class="navbar-brand" :to="{ name: 'homepage'}" id="wr-logo">
              <img src="/img/logo.png" width="48" height="48" alt="logo">
            </router-link>
            <div class="wr-create-project">
              <router-link :to="{ name: 'create_project' }">
                <i class="fa fa-plus-square-o" aria-hidden="true"></i>
                Create project
              </router-link>
            </div>
            <div class="space-bet">

            </div>
            <div class="action-header" v-if="!isLogin">
              <router-link to="login">Login</router-link>
            </div>
            <Notification v-if="isLogin"/>
            <div class="action-header" v-if="isLogin">
              <a href="javascript:" @click="logout">Logout</a>
            </div>
          </div>
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
import _ from 'lodash';

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
    isLogin: function() {
      return !_.isEmpty(this.user);
    },
  },
  watch: {

  },
  methods: {
    logout: function() {
      this.$store.dispatch('auth/logout');
      this.$router.push({ name: 'homepage'});
      this.$message({
        message: 'You logout successfully.',
        type: 'success'
      });
    }
  },
  components: {
    Notification
  },
  mounted() {

  }
}
</script>

<style lang="scss">
  .wr-create-project{
    float: right;
  }
  #in-header{
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    #wr-logo{

    }
    .wr-create-project{

    }
    .space-bet{
      flex-grow: 1;
    }
    .wr-noti{

    }
    .action-header{

    }
  }
</style>
