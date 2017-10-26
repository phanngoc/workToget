<template lang="html">
  <div class="page-calendar">
    <div class="content-page d-flex flex-column mr-auto ml-auto">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>

import { mapGetters, mapActions, mapState } from 'vuex';
import _ from 'lodash';
import moment from 'moment';

export default {
  created() {
    this.$store.dispatch('calendar/loadEvents');
    this.$store.dispatch('calendar/loadUsers');
    this.$socket.emit('JOIN_PROJECT', this.$route.params.id);
  },
  data: function() {
    return {

    };
  },
  computed: {

  },
  watch: {

  },
  methods: {

  },
  components: {

  },
  mounted() {
    let that = this;

  }
}
</script>

<style lang="scss" scoped>
  @import "../../../sass/_vars.scss";
  @import '~fullcalendar/dist/fullcalendar.css';
  .content-page{
    @include respond-to(handhelds) { width: 100% ; height: 100%}
    @include respond-to(medium-screens) { width: 100%;}
    @include respond-to(wide-screens) { width: $width-feature; }
  }
</style>
