<template lang="html">
  <a href="javascript:" class="wr-card" @click="openModalEdit">
    <div class="card">
      <div class="card-block">
        <div class="list-card-labels">
            <span class="badge badge-pill" v-for="label in task.Labels"
              :style="'background-color:'+label.color">{{label.name}}</span>
        </div>
        <span class="list-card-title">
          {{task.title}}
        </span>
        <div class="badges">
            <div class="badge" v-if="task.due_date" :style="'background-color:'+colorDuaDate" title="This card is recently overdue!">
              <i class="fa fa-clock-o" aria-hidden="true"></i>
              <span class="badge-text">{{ task.due_date | moment("calendar") }}</span>
            </div>
            <div class="badge count-comment" v-if="task.countComment" title="Comments">
              <i class="fa fa-comments-o" aria-hidden="true"></i>
              <span class="badge-text">{{task.countComment}}</span>
            </div>
        </div>
        <span class="icon-edit">
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
  sockets:{
    connect: function(){
      console.log('socket connected')
    },
  },
  computed: {
    due_date() {
      return this.task.due_date;
    },
  },
  watch: {
    due_date: function(val, oldVal) {
      this.colorDuaDate = this.getColorByTime(val);
    },
  },
  created() {
  },
  props: ['task'],
  data: function() {
    return {
      colorDuaDate: this.getColorByTime(this.task.due_date),
    }
  },
  methods: {
    ...mapActions('trello', [
        'openEditTask',
        'closeEditTask'
    ]),
    openModalEdit: function() {
      this.$store.dispatch('trello/openEditTask', this.task);
      this.$router.push({name: 'trello.modal', params: {
        id: this.$route.params.id,
        task_id: this.task.id,
        title: this.slugUrl(this.task.title)
      }});
    }
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
    white-space: normal;
    .card{
      .card-block{
        position: relative;
        .list-card-labels{
          @include clearfix;
        }
        .count-comment{
          background-color: #cecece;
        }
        .icon-edit{
          position: absolute;
          top: 1px;
          right: 2px;
        }
      }
    }
  }
</style>
