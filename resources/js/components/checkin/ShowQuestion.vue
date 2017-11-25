<template lang="html">
    <el-card class="box-card wr-show-question">
      <div slot="header" class="clearfix">
        <el-button style="float: right;" type="primary" @click="back">Back</el-button>
      </div>
      <article class="questionnaire__question centered">
        <h2 class="flush">
          {{questionEdited.question}}
        </h2>
        <p class="flush">
          <i class="fa fa-refresh" aria-hidden="true"></i>
          {{'Asking ' + questionEdited.Users.length + ' people ' }}{{questionEdited.cron | cron}}
        </p>
        <div class="wr-add-answer">
          <el-button type="success" round>Add your answer</el-button>
        </div>
      </article>
    </el-card>
</template>


<script>

import { mapGetters, mapActions, mapState } from 'vuex';
import _ from 'lodash';
import moment from 'moment';

export default {
  created() {
    this.$store.dispatch('checkin/loadQuestionEdited');
    this.$store.dispatch('checkin/loadAnswers', 1);
  },
  data: function() {
    let that = this;
    return {
      page: 1,
    };
  },
  computed: {
    ...mapState('checkin', [
      'questionEdited',
      'answers'
    ]),
  },
  watch: {

  },
  methods: {
    back: function() {

    }
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

</style>
