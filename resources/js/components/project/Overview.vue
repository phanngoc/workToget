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
          <div class="card-group">
            <div class="card feature-item">
              <img class="card-img-top" src="/img/icon_chat.png" alt="Card image cap">
              <div class="card-block">
                <h4 class="card-title">Chat</h4>
                <p class="card-text">Chat each other</p>
                <router-link :to="{ name: 'chat.index', params: { id: project.id}}">Go</router-link>
              </div>
            </div>

            <div class="card feature-item">
              <img class="card-img-top" src="/img/icon_trello.png" alt="Card image cap">
              <div class="card-block">
                <h4 class="card-title">Trello</h4>
                <p class="card-text">Manage project with board.</p>
                <router-link :to="{ name: 'trello', params: { id: project.id}}">Go</router-link>
              </div>
            </div>

            <div class="card feature-item">
              <img class="card-img-top" src="/img/icon_calendar.png" alt="Card image cap">
              <div class="card-block">
                <h4 class="card-title">Calendar</h4>
                <p class="card-text">Manage Event.</p>
                <router-link :to="{ name: 'calendar.list_event', params: { id: project.id}}">Go</router-link>
              </div>
            </div>
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
  .feature-item {
    width: 20rem;
    margin: 4px;
  }
</style>
