<template lang="html">
  <div class="content">
    <b class="name">{{notification.owner.fullname}}</b>
    <span class="action">{{this.action}}</span>
    <span class="title">{{this.title}}</span>
  </div>
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
      case "update_event":
        this.title = this.showLess(this.notification.target.data.title, 40);
        this.description = this.showLess(this.notification.target.data.note, 50);
        this.action = 'updated event';
        break;
      default:

    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  font-style: italic;
}
</style>
