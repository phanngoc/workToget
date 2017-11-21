<template lang="html">
  <div class="wr-project-overview row">
    <div class="in-pro-over text-center col-md-8 ml-auto mr-auto">
      <div class="card-block">
        <h4 class="card-title">{{project.name}}</h4>
        <p class="card-text">{{project.description}}</p>
        <Welcome />
        <Invitation />
        <AddPeople />
        <div class="list-features" v-if="!isInvita">
          <div class="card-wr-list">
            <router-link class="link-card" :to="{ name: 'chat.index', params: { id: project.id}}">
              <div class="card feature-item">
                <img class="card-img-top" src="/img/icon_chat.png" alt="Card image cap">
                <div class="card-block">
                  <h4 class="card-title">Chat</h4>
                  <p class="card-text">Chat each other</p>
                </div>
              </div>
            </router-link>
            <router-link class="link-card" :to="{ name: 'trello', params: { id: project.id}}">
              <div class="card feature-item">
                <img class="card-img-top" src="/img/icon_trello.png" alt="Card image cap">
                <div class="card-block">
                  <h4 class="card-title">Trello</h4>
                  <p class="card-text">Manage project with board.</p>
                </div>
              </div>
            </router-link>
            <router-link class="link-card" :to="{ name: 'calendar.list_event', params: { id: project.id}}">
              <div class="card feature-item">
                <img class="card-img-top" src="/img/icon_calendar.png" alt="Card image cap">
                <div class="card-block">
                  <h4 class="card-title">Calendar</h4>
                  <p class="card-text">Manage Event.</p>
                </div>
              </div>
            </router-link>
          </div>
          <!-- Just test -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';
import AddPeople from './AddPeople';
import Invitation from './Invitation';
import Welcome from './Welcome';

export default {
  created() {
    this.$socket.emit('JOIN_PROJECT', this.$route.params.id);
    this.$store.dispatch('project/loadProject', this.$route.params.id);
  },
  data: () => {
    return {
      projects: []
    }
  },
  computed: {
    ...mapState('project', [
        'project',
        'isInvita'
    ]),
  },
  methods: {

  },
  components: {
    AddPeople,
    Invitation,
    Welcome
  },
  mounted() {
    var self = this;

  }
}
</script>

<style lang="scss" scoped>
  .wr-project-overview{
    .in-pro-over{

    }
  }
  .card-wr-list{
    display: flex;
    flex-flow: row nowrap;
    .link-card{
      display: block;
      text-decoration: none;
      flex: 1 0 0%;
      width: 20rem;
      margin: 4px;
      .feature-item {
        .card-img-top{
          opacity: 0.2;
        }
      }
      .card-title{
        color: #913e3e;
      }
      .card-text{
        color: black;
      }
    }
  }

</style>
