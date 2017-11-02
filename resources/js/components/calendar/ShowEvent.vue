<template lang="html">
  <div class="wr-show-event">
    <el-card class="box-card box-main">
      <div slot="header" class="clearfix">
        <el-button style="float: left;" type="default" @click="backCalendar">Back</el-button>
        <el-button style="float: right;" type="primary" icon="edit" @click="editEvent">Edit</el-button>
      </div>
      <div class="body">
        <h4 class="title">{{eventShow.title}}</h4>
        <p class="time">{{eventShow.start | calendar}}</p>
        <hr>
        <div class="notes">
          <label for="">Notes</label>
          <p class="no-text">{{eventShow.note}}</p>
        </div>
        <div class="info-more">
          <span class="line-info">Posted by</span>
          <a href="javascript:" class="name-person">{{eventShow.User.fullname}}</a>
          .
          <span class='line-info'>{{eventShow.created_at | timeAgo}}</span>
        </div>
      </div>
    </el-card>
    <el-card class="box-info">
      <div class="task-comments">
        <h4 class="ti-sm">Add Comment</h4>
        <form class="d-flex flex-column new-comment">
          <div class="d-flex flex-row">
            <div class="p-2">
              <img :src="'/img/' + user.avatar" alt="" class="sm-avatar">
            </div>
            <div class="p-2">
              <textarea name="comment" class="form-control" v-model="newComment" rows="5" cols="80">
              </textarea>
            </div>
          </div>
          <div class="d-flex flex-row">
            <button type="button" class="btn btn-primary" @click="addComment">Save</button>
          </div>
        </form>
      </div>
      <hr>
      <div class="list-comments">
        <Comment v-for="(comment, index) in comments" :comment="comment" :key="comment.id"></Comment>
      </div>
    </el-card>
  </div>
</template>


<script>

import { mapGetters, mapActions, mapState } from 'vuex';
import _ from 'lodash';
import moment from 'moment';
import Comment from './Comment';

export default {
  created() {
    this.$store.dispatch('calendar/getEventShow', this.$route.params.event_id);
  },
  data: function() {
    return {
      newComment: ''
    };
  },
  filters: {

  },
  computed: {
    ...mapState('calendar', [
      'events',
      'eventShow'
    ]),
    ...mapState('auth', [
      'user',
    ]),
    ...mapState('calendar', [
      'comments',
    ]),
  },
  watch: {
    '$route': function(val, oldVal) {
      this.$store.dispatch('calendar/getEventShow', this.$route.params.event_id);
    },
    eventShow: function(val, oldVal) {

    },
    comments: function(val, oldVal) {

    }
  },
  methods: {
    addComment: function() {
      this.$store.dispatch('calendar/addComment', {
        content: this.newComment,
      });
      this.newComment = "";
    },
    editEvent: function() {
      this.$router.push({name: 'calendar.edit_event', params: {id: this.$route.params.id, event_id: this.$route.params.event_id}});
    },
    backCalendar: function() {
      this.$router.go(-1);
    }
  },
  components: {
    Comment
  },
  mounted() {
    let that = this;
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../sass/_vars.scss";
  .sm-avatar{
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }
</style>
