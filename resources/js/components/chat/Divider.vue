<template lang="html">
  <header class="date_divider" v-if="timeHeader" data-datetime="2017-10-19">
    <h3 class="break centered">
      <span>{{this.timeHeader | moment("calendar")}}</span>
    </h3>
  </header>
</template>

<script>

import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';
import _ from 'lodash';
import moment from 'moment';

export default {
  created() {

  },
  props: ['chat1', 'chat2'],
  data: function() {
    return {
      timeHeader: ''
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

  },
  components: {

  },
  mounted() {
    if (!_.isEmpty(this.chat1)) {
      if (moment(this.chat1.createdAt).dayOfYear() < moment(this.chat2.createdAt).dayOfYear()) {
        this.timeHeader = this.chat2.createdAt;
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .date_divider{
    width: 100%;
    .centered{
      text-align: center;
    }
    .break {
      z-index: 0;
      position: relative;
      &:before{
        content: '';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        border-bottom: 1px solid rgba(0,0,0,0.1);
        z-index: -1;
      }
      span{
        display: inline-block;
        padding: 0 0.5em;
        background: #fff;
      }
    }
  }
</style>
