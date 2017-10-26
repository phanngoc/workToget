<template lang="html">
  <article class="chat-line chat-line--rich-text d-flex" :class="{'flex-row-reverse': isMe, 'flex-row': !isMe}">
    <div class="chat-line__avatar p-2">
      <img :src="'/img/' + chat.User.avatar" width="64" height="64" class="avatar" />
    </div>
    <div class="chat-line__bubble p-2 d-flex flex-column">
      <span class="chat-line__meta d-flex" :class="{'flex-row-reverse': isMe, 'flex-row': !isMe}">
        <strong class="chat-line__author p-2">{{chat.User.fullname}}</strong>
        <span class="chat-line__timestamp p-2">
          <span class="chat-line__toggle-delete-mode" data-behavior="toggle_chat_line_delete_mode"></span>
          <span class="u-hide-on-template">
            <time datetime="" data-local="time" data-format="%l:%M%P" title="" data-localized="">
              {{chat.createdAt | moment("from", "now")}}
            </time>
          </span>
        </span>
        <div class="chat-line__trash p-2" data-behavior="delete_chat_line" v-if="isMe" @click="deleteChat">
          <i class="fa fa-trash-o" aria-hidden="true"></i>
        </div>
      </span>
      <div class="chat-line__body p-2">
        <div class="text-content" v-if="chat.type == 0">
          {{chat.content}}
        </div>
        <div class="thumb-content" v-if="chat.type == 1">
          <el-card :body-style="{ padding: '0px' }">
           <img :src="this.content.link" class="image">
           <div style="padding: 12px;">
             <span>{{this.content.name}}</span>
             <div class="bottom clearfix">
               <span>{{bytesToSize(this.content.size)}}</span>
               <a :href="this.content.link" target="_blank">View full size</a>
             </div>
           </div>
         </el-card>
        </div>
      </div>
    </div>
  </article>
</template>

<script>

import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';
import _ from 'lodash';

export default {
  created() {

  },
  props: ['chat'],
  data: function() {
    return {
      isMe: false,
      content: ''
    }
  },
  computed: {
    ...mapState('auth', [
      'user',
    ]),
  },
  watch: {

  },
  methods: {
    deleteChat() {
      var that = this;
      this.$confirm('Are you sure to delete this chat ?', 'Warning', {
         confirmButtonText: 'OK',
         cancelButtonText: 'Cancel',
         type: 'warning'
       }).then(() => {
         that.$store.dispatch('chat/deleteChat', this.chat.id);
       }).catch(() => {

       });
    },
  },
  components: {

  },
  mounted() {
    if (this.chat.type == 1) {
        this.content = JSON.parse(this.chat.content);
    }
    this.isMe = this.user.id == this.chat.User.id;
  }
}
</script>

<style lang="scss" scoped>
  @import "~styles/_vars.scss";
  .inner-chat{
    margin: 0px auto;
  }
  .chat-line__trash{
    cursor: pointer;
  }
  .image{
    color: red;
    background-color: green;
    @include respond-to(handhelds) {width: 276px;}
  }
</style>
