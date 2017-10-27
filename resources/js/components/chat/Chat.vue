<template lang="html">
  <div class="page-chat">
    <div class="inner-chat mr-auto ml-auto d-flex flex-column">
      <div class="wr-scroll-page p-2">
        <div class="wr-content-scroll">
          <div class="wr-chat-line" v-for="(item, index) in chats">
            <Divider :chat1="chats[index-1]" :chat2="item" :key="item.id"/>
            <ChatLine :chat="item" :key="item.id"></ChatLine>
          </div>
        </div>
      </div>
      <footer class="chat__footer p-2">
        <div class="wr-input">
          <div id="trix-toolbar" class="toolbar">
          </div>
          <input id="x-chat" v-model="text" value="Editor content goes here" v-on:keyup.13="keymonitor" type="hidden" name="content">
          <trix-editor class="trix-content" input="x-chat" toolbar="trix-toolbar"></trix-editor>
        </div>
      </footer>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';
import _ from 'lodash';
import ChatLine from './ChatLine';
import Divider from './Divider';

export default {
  created() {
    this.$store.dispatch('chat/loadChatMessage');
    this.$socket.emit('JOIN_PROJECT', this.$route.params.id);
  },
  data: function() {
    return {
      text: '',
      element: {},
    }
  },
  computed: {
    ...mapState('chat', [
        'chats',
    ]),
  },
  watch: {
    text: function(val, oldVal) {

    }
  },
  methods: {
    ...mapActions('trello', [
        'openEditTask',
        'closeEditTask'
    ]),
    keymonitor(e) {
      console.log('keymonitor', e);
    },
    scrollToBottom() {
      $(".wr-scroll-page").animate({ scrollTop: '+=999999px' }, "slow");
    }
  },
  components: {
    ChatLine,
    Divider
  },
  mounted() {
    let that = this;
    this.scrollToBottom();
    $('.wr-scroll-page').scroll(function(e) {
      if ($(this).scrollTop() == 0) {
        $(this).scrollTop(1);
        that.$store.dispatch('chat/loadMoreMessage', {createdAt: that.chats[0].createdAt});
      }
    });
    document.addEventListener('trix-initialize', function(element) {
      element.target.focus();
      element.target.addEventListener('keypress', function(e) {
        if (e.keyCode == 13) {
          that.$store.dispatch('chat/addMessage', {type:0, text: that.text});
          element.target.editor.loadHTML("");
          element.target.focus();
          that.scrollToBottom();
        }
      });
    });

    document.addEventListener('trix-change', function(e) {
      that.text = e.target.innerText;
    });

    var createStorageKey, host, uploadAttachment;

    Trix.config.attachments.preview.caption = {
      name: false,
      size: false
    };

    document.addEventListener("trix-attachment-add", function(event) {
      var attachment;
      attachment = event.attachment;

      if (attachment.file) {
        uploadAttachment(attachment).then(function(result) {
          that.$store.dispatch('chat/addMessage', {type:1, text: result});
        }).catch( (err) => {
          that.$message('Upload failed', err);
        });
      }
    });

    host = "/api/upload";

    uploadAttachment = function(attachment) {
      return new Promise((resolve, reject) => {
        var file, form, key, xhr;
        file = attachment.file;
        key = createStorageKey(file);
        form = new FormData;
        form.append("key", key);
        form.append("Content-Type", file.type);
        form.append("file", file);
        xhr = new XMLHttpRequest;

        xhr.upload.onprogress = function(event) {
          var progress;
          progress = event.loaded / event.total * 100;
          attachment.setUploadProgress(progress);
        };
        xhr.onload = function() {
          var href, url;

          if (xhr.status === 200) {
            url = href = '/img/' + key;
            let response = JSON.parse(xhr.responseText);
            let data = {link: url, name: response.data.name, size: response.data.size};
            resolve(JSON.stringify(data));
            attachment.remove();
          } else {
            attachment.remove();
            alert("Upload failed. Try to reload the page.");
          }
        };

        xhr.onerror = () => reject(xhr.statusText);

        xhr.open("POST", host, true);
        xhr.setRequestHeader('Authorization', `Bearer ${localStorage.getItem('access_token')}`);

        xhr.send(form);
      });
    };

    createStorageKey = function(file) {
      var date, day, time;
      date = new Date();
      time = date.getTime();
      return time + "-" + file.name;
    };
  }
}
</script>

<style lang="scss" scoped>
  @import "~styles/_vars.scss";

  .page-chat{
    .inner-chat{
      display: block;
      @include respond-to(handhelds) { width: 100% ; height: 100%}
      @include respond-to(medium-screens) { width: 100%;}
      @include respond-to(wide-screens) { width: $width-feature; }
      .wr-scroll-page{
        display: block;
        overflow-y: scroll;
        height: 610px;
        @include clearfix;
        .wr-content-scroll{
          .wr-chat-line{
          }
        }
      }
      .chat__footer{
        trix-editor{
          min-height: inherit;
          height: 42px;
        }
        trix-toolbar{
          display: none;
        }
      }
    }
  }

</style>
