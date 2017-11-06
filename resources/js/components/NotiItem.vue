<template lang="html">
  <li class="li-item">
    <router-link :to="{ name: notification.target.link.name, params: notification.target.link.params}" class='at-link'>
      <div class="wr-avatar"><div class="notify-img">
        <img :src="'/img/' + notification.owner.avatar" alt="" class="avatar">
      </div></div>
      <div class="wr-info">
        <a href="">{{notification.owner.fullname}}</a>
        <span class="line-info">{{action}}</span>
        <a href="">{{title}}</a>
        <a href="" class="rIcon"><i class="fa fa-dot-circle-o"></i></a>
        <p class="info-target">{{description}}</p>
        <p class="time">{{ time | timeAgoUnix}}</p>
      </div>
    </router-link>
  </li>
</template>


<script>

import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';

export default {
  sockets: {
  },
  props: ['notification', 'time'],
  created() {
  },
  data: () => {
    return {
      title: "",
      description: "",
      action: ""
    }
  },
  computed: {
  },
  filters: {
    timeAgoUnix: function(val) {
      return moment.unix(val).fromNow();
    }
  },
  watch: {

  },
  methods: {

  },
  components: {

  },
  mounted() {
    switch (this.notification.action) {
      case "add_event":
        this.title = this.showLess(this.notification.target.data.title, 40);
        this.description = this.showLess(this.notification.target.data.note, 50);
        this.action = 'added event';
        break;
      default:

    }
  }
}
</script>

<style lang="scss" scoped>
.avatar{
  width: 45px;
  height: 45px;
}
.line-info, .info-target{
  text-decoration: none;
  color: black;
}
</style>
