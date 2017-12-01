<template lang="html">
  <div class="tree-wr-fea d-flex flex-column">
    <div class="breadcrumbs p-2">
      <header class="wr-link">
        <span class="dock-breadcrumb-menu">
          <el-dropdown @command="handleCommand" trigger="click">
            <span class="el-dropdown-link">
              <strong class="master-link">Home</strong>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="overview_project">Home</el-dropdown-item>
              <el-dropdown-item divided command="chat.index">
                <img class="icon-menu" src="/img/icon_chat.png" alt="chat feature"/>Chat</el-dropdown-item>
              <el-dropdown-item command="trello">
                <img class="icon-menu" src="/img/icon_trello.png" alt="chat feature"/>Trello</el-dropdown-item>
              <el-dropdown-item command="calendar.list_event">
                <img class="icon-menu" src="/img/icon_calendar.png" alt="chat feature"/>Calendar</el-dropdown-item>
              <el-dropdown-item command="activity">
                <img class="icon-menu" src="/img/icon_activity.png" alt="chat feature"/>Activity</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <div class="segment" v-for="link in links">
            <div class="dock-breadcrumb__separator" aria-hidden="true"> › </div>
            <span class="dock-breadcrumb__title" :class="{'clickable': link.clickable}">
              <router-link :to="link.url" v-if="link.clickable">{{link.title}}</router-link>
              <p v-else>{{link.title}}</p>
            </span>
          </div>

        </span>
      </header>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';
import _ from 'lodash';
import store from '../../store';

export default {
  created() {
  },
  data: () => {
    return {
      links: [],
    }
  },
  computed: {
    ...mapState('project', [
        'project',
    ]),
  },
  watch: {
    '$route': function(to, from) {
      this.handleLink();
    }
  },
  beforeRouteEnter (to, from, next) {
    let params = to.params;
    let cPromises = [];
    if (_.has(params, 'id')) {
      cPromises.push(store.dispatch('project/loadProject', params.id));
    };
    if (_.has(params, 'question_id')) {
      cPromises.push(store.dispatch('checkin/loadQuestionEdited', params));
    };
    if (_.has(params, 'answer_id')) {
      cPromises.push(store.dispatch('checkin/loadAnswerEdited', params));
    };

    Promise.all(cPromises).then(values => {
      console.log(values);
      next();
    }).catch((err) => {
      console.log('err', err);
      next();
    });
  },
  beforeRouteUpdate (to, from, next) {
    let params = to.params;
    let cPromises = [];
    if (_.has(params, 'id')) {
      cPromises.push(this.$store.dispatch('project/loadProject', params.id));
    };
    if (_.has(params, 'question_id')) {
      cPromises.push(this.$store.dispatch('checkin/loadQuestionEdited', params));
    };
    if (_.has(params, 'answer_id')) {
      cPromises.push(this.$store.dispatch('checkin/loadAnswerEdited', params));
    };
    console.log('beforeRouteUpdate');
    Promise.all(cPromises).then(values => {
      console.log(values);
      next();
    }).catch((err) => {
      console.log('err', err);
      next();
    });
  },
  methods: {
    handleCommand(command) {
      this.$router.push({ name: command, params: { id: this.$route.params.id }})
    },
    handleLink() {
      var name = this.$route.name;
      this.links = [];
      switch (name) {
        case 'checkin.new_answer':
          this.links.push({
            title: 'Automatic Check-ins',
            clickable: true,
            url: {name: 'checkin.list_question', params: {id: this.$route.params.id}}
          });
          this.links.push({
            title: this.$store.state.checkin.questionEdited.question,
            clickable: true,
            url: {name: 'checkin.show_question', params: {id: this.$route.params.id,
              question_id: this.$route.params.question_id}}
          });
          this.links.push({
            title: "New Answer",
            clickable: false,
            url: {}
          });
          break;
        case 'checkin.edit_question':
          this.links.push({
            title: 'Automatic Check-ins',
            clickable: true,
            url: {name: 'checkin.list_question', params: {id: this.$route.params.id}}
          });
          this.links.push({
            title: "Edit",
            clickable: false,
            url: {}
          });
          break;
        case 'checkin.new_question':
          this.links.push({
            title: 'Automatic Check-ins',
            clickable: true,
            url: {name: 'checkin.list_question', params: {id: this.$route.params.id}}
          });
          this.links.push({
            title: "New",
            clickable: false,
            url: {}
          });
          break;
        case 'checkin.edit_answer':
          this.links.push({
            title: 'Automatic Check-ins',
            clickable: true,
            url: {name: 'checkin.list_question', params: {id: this.$route.params.id}}
          });
          this.links.push({
            title: this.$store.state.checkin.questionEdited.question,
            clickable: true,
            url: {name: 'checkin.show_question', params: {id: this.$route.params.id,
              question_id: this.$store.state.checkin.questionEdited.id}}
          });
          this.links.push({
            title: "Answer to: \""+this.showLess(this.$store.state.checkin.answerEdited.content, 60, '...', true)+"\"",
            clickable: true,
            url: {name: 'checkin.show_answer', params: {id: this.$route.params.id,
              question_id: this.$route.params.question_id,
              answer_id: this.$route.params.answer_id}}
          });
          this.links.push({
            title: 'Edit',
            clickable: false,
            url: {}
          });
          break;
        case 'checkin.show_answer':
          this.links.push({
            title: 'Automatic Check-ins',
            clickable: true,
            url: {name: 'checkin.list_question', params: {id: this.$route.params.id}}
          });
          this.links.push({
            title: this.$store.state.checkin.questionEdited.question,
            clickable: true,
            url: {name: 'checkin.show_question', params: {id: this.$route.params.id,
              question_id: this.$store.state.checkin.questionEdited.id}}
          });
          this.links.push({
            title: this.$store.state.checkin.answerEdited.User.fullname + '’s answer',
            clickable: false,
            url: {}
          });
          break;
        case 'checkin.list_question':
          this.links.push({
            title: 'Automatic Check-ins',
            clickable: false,
            url: {}
          });
          break;
        case 'checkin.show_question':
          this.links.push({
            title: 'Automatic Check-ins',
            clickable: true,
            url: {name: 'checkin.list_question', params: {id: this.$route.params.id}}
          });
          this.links.push({
            title: this.$store.state.checkin.questionEdited.question,
            clickable: false,
            url: {}
          });
          break;
        case 'checkin.edit_question':
          this.links.push({
            title: 'Automatic Check-ins',
            clickable: true,
            url: {name: 'checkin.list_question', params: {id: this.$route.params.id}}
          });
          this.links.push({
            title: "Edit:" + this.$store.state.checkin.questionEdited.question,
            clickable: false,
            url: {}
          });
          break;
        case 'activity':
          this.links.push({
            title: 'Activity',
            clickable: false,
            url: {}
          });
          break;
        case 'chat.index':
          this.links.push({
            title: 'Chat',
            clickable: false,
            url: {}
          });
          break;
        case 'trello':
          this.links.push({
            title: 'Trello',
            clickable: false,
            url: {}
          });
          break;
        case 'trello.modal':
          this.links.push({
            title: 'Trello',
            clickable: false,
            url: {}
          });
          break;
        case 'calendar.list_event':
          this.links.push({
            title: 'Calendar',
            clickable: false,
            url: {}
          });
          break;
        case 'calendar.show_event':
          this.links.push({
            title: 'Calendar',
            clickable: true,
            url: { name: 'calendar.list_event', params: { id: this.$route.params.id }}
          });
          this.links.push({
            title: 'Event',
            clickable: false,
            url: {}
          });
          break;
        case 'calendar.add_event':
          this.links.push({
            title: 'Calendar',
            clickable: true,
            url: { name: 'calendar.list_event', params: { id: this.$route.params.id }}
          });
          this.links.push({
            title: 'Add event',
            clickable: false,
            url: {}
          });
          break;
        case 'calendar.edit_event':
          this.links.push({
            title: 'Calendar',
            clickable: true,
            url: { name: 'calendar.list_event', params: { id: this.$route.params.id }}
          });
          this.links.push({
            title: 'Edit event',
            clickable: false,
            url: {}
          });
          break;
        default:
      }
    }
  },
  components: {

  },
  mounted() {
    this.handleLink();
  }
}
</script>

<style lang="scss" scoped>
  .icon-menu{
    width: 21px;
    height: 21px;
    padding: 2px;
  }
  .tree-wr-fea{
    height: 100%;
    .wr-link{
      text-align: center;
      .dock-breadcrumb-menu{
        display: block;
        .el-dropdown-link{
          font-size: 18px;
          text-decoration: underline;
          cursor: pointer;
        }
        .router-link-active{
          display: inline-block;
        }
        .segment{
          display: inline-block;
          .dock-breadcrumb__separator{
            display: inline-block;
          }
          .dock-breadcrumb__title{
            display: inline-block;
          }
        }
      }
    }
  }
</style>
