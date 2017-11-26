<template lang="html">
  <el-card class="box-card wr-list-question">
    <div slot="header" class="clearfix">
      <span>Automatic Check-ins</span>
    </div>
    <el-button type="success" @click="goToNewQuestion">Set up an automatic check-in</el-button>

    <div class="list-question centered">
      <article class="questionnaire__question" v-for="(checkin, index) in questions" :key="checkin.id">
        <h2 class="flush">
          <router-link :to="{name: 'checkin.show_question', params: {id: $store.state.route.params.id , question_id: checkin.id}}" class="text-link">
            {{checkin.question}}
          </router-link>
        </h2>
        <p class="flush">
          <router-link :to="{name: 'checkin.show_question', params: {id: $store.state.route.params.id , question_id: checkin.id}}" class="text-link">
            <i class="fa fa-refresh" aria-hidden="true"></i>
            {{'Asking ' + checkin.Users.length + ' people ' }}{{checkin.cron | cron}}
          </router-link>
        </p>
        <section class="questionnaire__answers avatar-group">
          <div class="item-avatar" v-for="user in checkin.Users" :key="user.id">
            <img :src="'/img/' + user.avatar" :alt="user.fullname" class="small-avatar"/>
          </div>
        </section>
      </article>
    </div>
  </el-card>
</template>


<script>
import { mapGetters, mapActions, mapState } from 'vuex';
import _ from 'lodash';
import moment from 'moment';

export default {
  created() {
    this.$store.dispatch('checkin/loadCheckin');
  },
  data: function() {
    let that = this;
    return {

    };
  },
  filters: {

  },
  computed: {
    ...mapState('checkin', [
      'questions',
    ]),
  },
  watch: {
    eventCreated: function(val, oldVal) {

    }
  },
  methods: {
    onSubmit: function(form) {

    },
    backCalendar: function() {
      this.$router.go(-1);
    },
    goToNewQuestion: function() {
      this.$router.push({name: 'checkin.new_question', params: {id: this.$store.state.route.params.id}});
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
  .list-question{
    .questionnaire__question{
      padding: 2rem 0;
      border-top: 1px solid #e5e5e5;
    }
  }
  .item-avatar{
    display: inline-block;
    margin: 3px 5px;
    .small-avatar{
      width: 36px;
      height: 36px;
      background-size: cover;
      background-position: center;
      border-radius: 50%;
    }
  }
</style>
