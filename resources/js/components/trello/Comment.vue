<template lang="html">
  <div class="it-comment d-flex flex-row">
    <div class="p-2 wr-avatar">
      <img :src="'/img/' + comment.User.avatar" alt="" class="sm-avatar">
    </div>
    <div class="p-2 wr-des d-flex flex-column">
      <span class="inline-member p-2">
        {{comment.User.fullname}}
      </span>
      <div class="comment-container">
        <div class="wr-content" v-if="!isEdit">
          <div class="con js-mark" v-html="content_html">
          </div>
          <div class="action">
            <span class="info-time">
              {{comment.updatedAt | timeAgo}}
            </span>
            <a href="javascript:" @click="switchEdit" class="btn-edit link-action">Edit</a>
            <a href="javascript:" @click="removeComment" class="btn-delete link-action">Remove</a>
          </div>
        </div>

        <div class="cont-edit" v-if="isEdit">
          <textarea name="content" v-model="content_edit" class="form-control" rows="4" cols="80"></textarea>
          <button type="button" :class="{'btn btn-success':  isCanSave, 'btn disabled': !isCanSave}" @click="saveComment">Save</button>
          <a href="javacript:" @click="cancelEdit"><i class="fa fa-times" aria-hidden="true"></i></a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';
import _ from 'lodash';
import marked from 'marked';

export default {
  created() {

  },
  props: ['comment'],
  data: function() {
    return {
      isEdit: false,
      isCanSave: true,
      content_edit: this.comment.content,
      content_html: marked(this.comment.content)
    }
  },
  watch: {
    content_edit: function(val, oldVal) {
      this.isCanSave = _.isEmpty(val) ? false: true;
    },
    comment: function(val, oldVal) {
      this.content_edit = val.content;
      this.content_html = marked(val.content);
    }
  },
  computed: {
  },

  methods: {
    saveComment: function() {
      if (!this.isCanSave) return;
      this.$store.dispatch('trello/saveComment', {id: this.comment.id,
        content: this.content_edit});
      this.isEdit = false;
    },
    removeComment: function() {
      this.$confirm('Are you want to remove comment?', 'Warning', {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('trello/deleteComment', this.comment.id);
      }).catch(() => {

      });
    },
    switchEdit: function() {
      this.isEdit = true;
    },
    cancelEdit: function() {
      this.isEdit = false;
    }
  },
  components: {
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
  .sm-avatar{
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }
  .info-time{
    font-size: 0.8em;
  }
</style>
