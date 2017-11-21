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
              <textarea id="x-comment" style="display:none;" name="comment" class="form-control" v-model="newComment" rows="5" cols="80">
              </textarea>
              <trix-editor class="trix-content" input="x-comment"></trix-editor>
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
      newComment: '',
      element: {},
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
      if (this.newComment.trim() == "") {
        this.$message({
          message: 'You must input comment.',
          type: 'error'
        });
      } else {
        this.$store.dispatch('calendar/addComment', {
          content: this.newComment,
        });

        this.element.target.editor.loadHTML("");
        this.element.target.focus();
        this.newComment = "";
      }
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
    document.addEventListener('trix-initialize', function(element) {
      that.element = element;
    });
    document.addEventListener('trix-change', function(e) {
      that.newComment = e.target.value;
    });
    var host, uploadAttachment;

    Trix.config.attachments.preview.caption = {
      name: false,
      size: false
    };

    document.addEventListener("trix-attachment-add", function(event) {
      var attachment;
      attachment = event.attachment;

      if (attachment.file) {
        uploadAttachment(attachment).then(function(result) {
          var editor = event.target.editor
          var originalRange = editor.getSelectedRange()
          var attachmentRange = editor.getDocument().getRangeOfAttachment(attachment)

          editor.setSelectedRange(attachmentRange)
          editor.activateAttribute("caption", result.name + " " + result.size);
          editor.setSelectedRange(originalRange)

          attachment.setAttributes({
            url: result.link,
            href: result.link,
          });
        }).catch( (err) => {
          that.$message('Upload failed', err);
          attachment.remove();
        });
      }
    });

    host = "/api/upload";

    uploadAttachment = function(attachment) {
      return new Promise((resolve, reject) => {
        var file, form, key, xhr;
        file = attachment.file;
        form = new FormData;
        form.append("Content-Type", file.type);
        form.append("file", file);
        xhr = new XMLHttpRequest;

        xhr.upload.onprogress = function(event) {
          var progress;
          progress = event.loaded / event.total * 100;
          attachment.setUploadProgress(progress);
        };
        xhr.onload = function() {
          var url;
          if (xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            url = 'http://localhost:3000/uploads/' + response.data.name;
            let data = {link: url, name: response.data.name, size: response.data.size};
            resolve(data);
          } else {
            reject({status: 400, message: "Upload failed"});
            alert("Upload failed. Try to reload the page.");
          }
        };

        xhr.onerror = () => reject(xhr.statusText);

        xhr.open("POST", host, true);
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('access_token')}`);

        xhr.send(form);
      });
    };
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
