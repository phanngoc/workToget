<template lang="html">
  <div class="page-calendar row">
    <div class="content-page col-md-8 col-xl-10 mr-auto ml-auto">
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

</style>
