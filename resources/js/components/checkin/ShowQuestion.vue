<template lang="html">
    <el-card class="box-card wr-show-question">
      <div slot="header" class="clearfix">
        <el-button style="float: left;" type="default" @click="back">Back</el-button>
        <el-button style="float: right;" type="primary" @click="edit">Edit</el-button>
      </div>
      <article class="questionnaire__question centered">
        <h2 class="flush">
          {{questionEdited.question}}
        </h2>
        <p class="flush">
          <i class="fa fa-refresh" aria-hidden="true"></i>
          {{'Asking ' + numPeople + ' people ' }}{{questionEdited.cron | cron}}
        </p>
        <div class="wr-add-answer">
          <el-button type="success" round @click="goCreateAnswer">Add your answer</el-button>
        </div>
      </article>
      <div class="list-answers">
        <div class="activity-feed">
          <ItemAnswer v-for="(answer, key) in answers" :answer="answer" :key="answer.date" />
        </div>
      </div>
    </el-card>
</template>


<script>

import { mapGetters, mapActions, mapState } from 'vuex';
import _ from 'lodash';
import moment from 'moment';
import ItemAnswer from './ItemAnswer';

export default {
  created() {
    // this.$store.dispatch('checkin/loadQuestionEdited');
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
    numPeople: {
      get() {
        if (!_.isEmpty(this.questionEdited)) {
          return this.questionEdited.Users.length;
        } else {
          return 'no one';
        }
      }
    }
  },
  watch: {

  },
  methods: {
    back: function() {
      this.$router.go(-1);
    },
    edit: function() {
      this.$router.push({name: 'checkin.edit_question', params: {id: this.$route.params.id,
          question_id: this.questionEdited.id}})
    },
    goCreateAnswer: function() {
      let project_id = this.$route.params.id;
      this.$router.push({name: 'checkin.new_answer', params: {id: project_id,
          question_id: this.questionEdited.id}})
    }
  },
  components: {
    ItemAnswer
  },
  mounted() {
    let that = this;

  }
}
</script>

<style lang="scss">
  @import "../../../sass/_vars.scss";
  .report-in-days {
    background-color: #d4d4d4;
    border-radius: 12px;
    margin-left: -15px;
    margin-top: 15px;
    padding: 6px 5px 2px 5px;
  }

  .activity-feed {
    padding:30px;
  }

  .activity-feed .feed-item {
    margin-top: 10px;
    border-left: 2px solid #E2B104;
    .label-date{
      margin-left: 20px;
    }
    &::before {
      content: "";
      display: block;
      margin-left: -11px;
      width: 20px;
      height: 20px;
      border-radius: 13px;
      background: #fff;
      border: 1px solid #E2B104;
    }
  }

  .media-list{
    padding-left: 0px;
    .wr-avatar{
      margin-right: 5px;
    }
  }
    .reviews {
      color: #555;
      font-weight: bold;
      // margin: 10px auto 20px;
    }

    .media .media-object {
      max-width: 120px;
    }

    .media-body {
      position: relative;
    }

    .media-date {
      position: absolute;
      right: 25px;
      top: 25px;
      li {
        padding: 0;
        display: inline-block;
        &:first-child:before {
          content: '';
        }
        &:before {
          content: '';
          margin-left: -2px;
          margin-right: 2px;
        }
      }
    }

    .media-comment {
      margin-bottom: 20px;
    }

    .media-replied {
      margin: 0 0 20px 50px;
      .media-heading {
        padding-left: 6px;
      }
    }

    .btn-circle {
      font-weight: bold;
      font-size: 12px;
      padding: 6px 15px;
      border-radius: 20px;
      span {
        padding-right: 6px;
      }
    }

    .embed-responsive {
      margin-bottom: 20px;
    }

    input[type="file"] {
      z-index: 999;
      line-height: 0;
      font-size: 0;
      position: absolute;
      opacity: 0;
      filter: alpha(opacity = 0);
      -ms-filter: "alpha(opacity=0)";
      margin: 0;
      padding: 0;
      left: 0;
    }

    .uploadPhoto {
      position: absolute;
      top: 25%;
      left: 25%;
      display: none;
      width: 50%;
      height: 50%;
      color: #fff;
      text-align: center;
      line-height: 60px;
      text-transform: uppercase;
      background-color: rgba(0, 0, 0, 0.3);
      border-radius: 50px;
      cursor: pointer;
    }
</style>
