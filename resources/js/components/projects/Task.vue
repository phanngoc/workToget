<template lang="html">
  <a href="javascript:" class="wr-card" @click="openEditTask(task)">
    <div class="card">
      <div class="card-block">
        <div class="list-card-labels">
            <span class="badge badge-pill" v-for="label in task.Labels"
              :style="'background-color:'+label.color">{{label.name}}</span>
        </div>
        <span class="list-card-title">
          {{task.title}}
        </span>
        <span class="icon-edit btn btn-sm btn-outline-primary">
          <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
        </span>
      </div>
    </div>
  </a>
</template>

<script>

import axios from 'axios';
import { mapGetters, mapActions } from 'vuex';

export default {
  created() {
  },
  props: ['task'],
  data: function() {
    return {

    }
  },
  methods: {
    ...mapActions('trello', [
        'openEditTask',
        'closeEditTask'
    ]),
  },
  components: {
  },
  mounted() {
    var self = this;
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../sass/_vars.scss";
  .wr-card{
    display:block;
    text-decoration: none;
    .card{
      .card-block{
        .list-card-labels{
          @include clearfix;
        }
      }
    }
  }
</style>
