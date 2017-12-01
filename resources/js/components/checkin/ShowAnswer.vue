<template lang="html">
  <div class="wr-show-answer">
    <el-card class="box-card box-main">
      <div slot="header" class="clearfix">
        <el-button style="float: left;" type="default" @click="backCalendar">Back</el-button>
        <el-button style="float: right;" type="primary" icon="edit" @click="editAnswer">Edit</el-button>
      </div>
      <div class="body">
        <div class="notes">
          <p class="no-text" v-html="answerEdited.content"></p>
        </div>
        <hr>
        <div class="info-more">
          <span class="line-info">Posted by</span>
          <a href="javascript:" class="name-person">{{answerEdited.User.fullname}}</a>
          .
          <span class='line-info'>{{answerEdited.update_at | timeAgo}}</span>
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
              <Trix ref="x_comment" id="x-comment" name="comment" :change="(value) => {this.newComment = value}" :value="newComment"/>
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
import Trix from '../common/Trix';

export default {
  created() {
    this.$store.dispatch('checkin/loadComments', 1);
  },
  data: function() {
    return {
      newComment: ''
    };
  },
  filters: {

  },
  computed: {
    answerEdited: {
      get() {
        if (_.isEmpty(this.$store.state.checkin.answerEdited)) {
          return {User: {}};
        }
        return this.$store.state.checkin.answerEdited;
      },
      set(value) {

      }
    },
    comments: {
      get() {
        return this.$store.state.checkin.comments;
      },
      set(value) {

      }
    },
    ...mapState('auth', [
      'user',
    ]),
  },
  watch: {
  },
  methods: {
    addComment: function() {
      if (this.newComment.trim() == "") {
        this.$message({
          message: 'You must input comment.',
          type: 'error'
        });
      } else {
        this.$store.dispatch('checkin/addComment', {
          content: this.newComment,
        });
        this.$refs.x_comment.reset();
        this.newComment = "";
      }
    },
    editAnswer: function() {
      this.$router.push({name: 'checkin.edit_answer', params: {id: this.$route.params.id,
        question_id: this.$route.params.question_id,
        answer_id: this.$route.params.answer_id}});
    },
    backCalendar: function() {
      this.$router.go(-1);
    }
  },
  components: {
    Comment,
    Trix
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
