<template lang="html">
    <el-card class="box-card wr-add-question">
      <div slot="header" class="clearfix">
        <span>Set up an automatic check-in</span>
        <el-button style="float: right;" type="primary" @click="backCalendar">Back</el-button>
       </div>
      <el-form ref="edit_question_form" :model="form" :rules="rules" :label-position="'top'" label-width="300px">
        <el-form-item label="What question do you want to ask?" prop="question">
          <el-input v-model="form.question"></el-input>
        </el-form-item>
        <el-form-item label="Who do you want to ask ?" prop="with_user">
          <el-table
            ref="multipleUsers"
            :data="users"
            style="width: 100%"
            max-height="250"
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              width="auto">
            </el-table-column>
            <el-table-column
              label="Name"
              property="fullname"
              width="auto">
            </el-table-column>
            <el-table-column
              label="Avatar"
              property="avatar"
              width="auto">
            </el-table-column>
          </el-table>
        </el-form-item>

        <el-form-item label="How often do you want to ask?">
          <el-collapse v-model="form.cron.type" accordion @change="changeModeDay">
            <el-collapse-item title="Daily on" name="daily">
              <el-checkbox-group v-model="form.cron.days">
                <el-checkbox label="Mo"></el-checkbox>
                <el-checkbox label="Tu"></el-checkbox>
                <el-checkbox label="We"></el-checkbox>
                <el-checkbox label="Th"></el-checkbox>
                <el-checkbox label="Fr"></el-checkbox>
                <el-checkbox label="Sa"></el-checkbox>
                <el-checkbox label="Su"></el-checkbox>
              </el-checkbox-group>
            </el-collapse-item>
            <el-collapse-item title="Once a week" name="once_a_week">
              <el-radio-group v-model="form.cron.date">
                <el-radio-button label="Mo"></el-radio-button>
                <el-radio-button label="Tu"></el-radio-button>
                <el-radio-button label="We"></el-radio-button>
                <el-radio-button label="Th"></el-radio-button>
                <el-radio-button label="Fr"></el-radio-button>
                <el-radio-button label="Sa"></el-radio-button>
                <el-radio-button label="Su"></el-radio-button>
              </el-radio-group>
            </el-collapse-item>
            <el-collapse-item title="Other week" name="other_week">
              <el-radio-group v-model="form.cron.date">
                <el-radio-button label="Mo"></el-radio-button>
                <el-radio-button label="Tu"></el-radio-button>
                <el-radio-button label="We"></el-radio-button>
                <el-radio-button label="Th"></el-radio-button>
                <el-radio-button label="Fr"></el-radio-button>
                <el-radio-button label="Sa"></el-radio-button>
                <el-radio-button label="Su"></el-radio-button>
              </el-radio-group>
            </el-collapse-item>
            <el-collapse-item title="Once a month on the first … " name="once_a_month">
              <el-radio-group v-model="form.cron.date">
                <el-radio-button label="Mo"></el-radio-button>
                <el-radio-button label="Tu"></el-radio-button>
                <el-radio-button label="We"></el-radio-button>
                <el-radio-button label="Th"></el-radio-button>
                <el-radio-button label="Fr"></el-radio-button>
                <el-radio-button label="Sa"></el-radio-button>
                <el-radio-button label="Su"></el-radio-button>
              </el-radio-group>
            </el-collapse-item>
          </el-collapse>
        </el-form-item>

        <el-form-item label="What time of day do you want to ask?">
          <el-time-select
            v-model="form.cron.time"
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '18:30'
            }"
            placeholder="Select time">
          </el-time-select>
        </el-form-item>

        <el-form-item>
          <el-button type="success" @click="onSubmit()">Update question</el-button>
        </el-form-item>
      </el-form>
    </el-card>
</template>


<script>

import { mapGetters, mapActions, mapState } from 'vuex';
import _ from 'lodash';
import moment from 'moment';

export default {
  created() {

  },
  data: function() {
    let that = this;
    this.$nextTick(function () {
      this.form.id = this.questionEdited.id;
      this.form.question = this.questionEdited.question;
      this.form.with_user = this.questionEdited.with_user;
      this.form.cron = JSON.parse(this.questionEdited.schedule);
      let userIds = this.form.with_user.split(',');
      _.forEach(userIds, (userId) => {
        let userSelect = _.find(this.users, function(user) {
          return user.id == userId;
        });
        if (userSelect) {
          this.$refs.multipleUsers.toggleRowSelection(userSelect);
        }
      });
    });

    return {
      form: {
        id: '',
        question: '',
        with_user: '',
        cron: {
          type: "daily",
          days: [],
          date: "",
          time: ''
        },
      },
      rules: {
        question: [
          {required: true, message: "Question is required"},
        ],
      },
    };
  },
  computed: {
    ...mapState('project', [
      'users',
    ]),
    ...mapState('checkin', [
      'questionEdited',
    ]),
  },
  watch: {

  },
  methods: {
    onSubmit: function() {
      this.$store.dispatch('checkin/updateQuestion', this.form).then((response) => {
        console.log('response', response);
        this.$router.push({name: 'checkin.list_question', params: {id: this.$route.params.id}});
      });
    },
    changeModeDay: function(name) {
      this.form.cron.type = name;
      this.form.cron.date = "";
      this.form.cron.days = [];
    },
    backCalendar: function() {
      this.$router.go(-1);
    },
    handleSelectionChange: function(idsChoose) {
      let arrIds = _.map(idsChoose, function(val) {
        return val.id;
      });
      this.form.with_user = arrIds.join();
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
