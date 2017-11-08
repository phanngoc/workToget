<template lang="html">
    <el-card class="box-card wr-add-event">
      <div slot="header" class="clearfix">
         <el-button style="float: left;" type="primary" @click="backCalendar">Back</el-button>
       </div>
      <el-form ref="add_event_form" :model="form" label-width="120px" :rules="rules">
        <el-form-item label="Title" prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="Is all day?" prop="is_allday">
          <el-switch on-text="" off-text="" v-model="form.is_allday"></el-switch>
        </el-form-item>
        <el-form-item label="Start">
         <el-col :span="6">
           <el-form-item prop="start.day">
             <el-date-picker type="date" placeholder="Pick a day" style="width:100%" v-model="form.start.day"
             ></el-date-picker>
           </el-form-item>
         </el-col>
         <el-col class="line" :span="1" style="text-align: center;" v-if="!form.is_allday">-</el-col>
         <el-col :span="6" v-if="!form.is_allday">
           <el-form-item prop="start.time">
             <el-time-select type="fixed-time" placeholder="Pick a time"
              :picker-options="{ start: '00:00', step: '00:15', end: '23:45' }" style="width:100%" v-model="form.start.time"></el-time-select>
           </el-form-item>
         </el-col>
        </el-form-item>
        <el-form-item label="End">
         <el-col :span="6">
           <el-form-item prop="ltday">
             <el-date-picker type="date" placeholder="Pick a date" style="width:100%"
               v-model="form.end.day"></el-date-picker>
           </el-form-item>
         </el-col>
         <el-col class="line" :span="1" style="text-align: center;" v-if="!form.is_allday">-</el-col>
         <el-col :span="6" v-if="!form.is_allday">
           <el-form-item prop="lttime">
             <el-time-select type="fixed-time" placeholder="Pick a time" style="width:100%" v-model="form.end.time"
              :picker-options="{ start: '00:00', step: '00:15', end: '23:45' }"></el-time-select>
           </el-form-item>
         </el-col>
        </el-form-item>
        <el-form-item label="Notify">
          <el-select v-model="form.with" multiple placeholder="Select Users">
              <el-option
                v-for="item in users"
                :key="item.User.id"
                :label="item.User.fullname"
                :value="item.User.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="Note">
          <el-input type="textarea" v-model="form.note"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="onSubmit('add_event_form')">Post this event</el-button>
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
    let checkLarger = (rule, value, callback) => {
      // console.log(rule, value);
      // console.log(moment(that.form.end.day).format('YYYY-MM-DD')+' '+that.form.end.time);
      // console.log(moment(that.form.start.day).format('YYYY-MM-DD')+' '+that.form.start.time);
      let end = moment(moment(that.form.end.day).format('YYYY-MM-DD')+' '+that.form.end.time);
      let start = moment(moment(that.form.start.day).format('YYYY-MM-DD')+' '+that.form.start.time);
      if (!start.isBefore(end)) {
        callback(new Error('End day must be after start day'));
      }
      callback();
    };
    return {
      form: {
        title: '',
        note: '',
        start: {day:'', time: ''},
        end: {day:'', time: ''},
        is_allday: false,
        with: []
      },
      rules: {
        title: [
          {required: true, message: "Title is required"},
        ],
        'start.day': [
          {required: true, message: "Start day is required"},
        ],
        'start.time': [
          {required: true, message: "Start time is required"},
        ],
        'end.day': [
          {required: true, message: "End day is required"},
        ],
        'end.time': [
          {required: true, message: "End time is required"},
        ],
        ltday: [
          {validator: checkLarger, trigger: 'blur'}
        ],
        lttime: [
          {validator: checkLarger, trigger: 'blur'}
        ]
      },
    };
  },
  computed: {
    ...mapState('calendar', [
        'events',
        'users',
    ]),
    eventCreated: {
      get() {
        let val = this.$store.state.calendar.eventCreated;

        if (!_.isEmpty(val)) {
          this.form.title = val.title;
          this.form.start.day = moment(val.start).toDate();
          this.form.start.time = moment(val.start).format('HH:mm');
          this.form.end.day = moment(val.end).toDate();
          this.form.end.time = moment(val.end).format('HH:mm');
        }
        return val;
      },
      set(val) {

      }
    }
  },
  watch: {
    eventCreated: function(val, oldVal) {

    }
  },
  methods: {
    onSubmit: function(form) {
      let that = this;
      this.$refs[form].validate((valid) => {
        if (valid) {
          let data = Object.assign({}, that.form);
          data.start = moment(that.form.start.day).format('YYYY-MM-DD')+' '+that.form.start.time
          data.end = moment(that.form.end.day).format('YYYY-MM-DD')+' '+that.form.end.time
          that.$store.dispatch('calendar/createEvent', data);
          that.$router.go(-1);
        } else {
          that.$message.error('Input form invalid !');
          return false;
        }
      });
    },
    backCalendar: function() {
      this.$router.go(-1);
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
