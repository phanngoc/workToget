<template lang="html">
  <el-card :body-style="{ padding: '0px' }">
    <img :src="'/img/' + user.avatar" class="sm-avatar">
    <div style="padding: 14px;">
      <span>{{user.fullname}}</span>
      <div class="bottom clearfix">
        <b>{{user.project_users.role}}</b>
        <el-button type="danger" round>Remove</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>

import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';

export default {
  created() {

  },
  props: ['user'],
  data: () => {
    return {

    }
  },
  computed: {
  },
  methods: {

  },
  components: {
  },
  mounted() {
    var self = this;

  }
}
</script>

<style lang="scss" scoped>
  .sm-avatar{
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }
</style>
