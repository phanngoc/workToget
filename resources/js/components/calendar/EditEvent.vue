<template lang="html">
    <el-card class="box-card wr-add-event">
      <div slot="header" class="clearfix">
         <el-button style="float: left;" type="primary" @click="backCalendar">Back</el-button>
         <el-button style="float: right;" type="danger" icon="delete" @click="archiveEvent">Archive this</el-button>
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
           <el-form-item prop="lesday">
             <el-date-picker type="date" placeholder="Pick a day" style="width:100%" v-model="form.start.day"
             ></el-date-picker>
           </el-form-item>
         </el-col>
         <el-col class="line" :span="1" style="text-align: center;" v-if="!form.is_allday">-</el-col>
         <el-col :span="6" v-if="!form.is_allday">
           <el-form-item prop="lestime">
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
                v-for="item in usersCan"
                :key="item.id"
                :label="item.fullname"
                :value="item.id">
              </el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="Note">
          <el-input type="textarea" v-model="form.note"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="success" @click="onSubmit('add_event_form')">Update this event</el-button>
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
    let checkLessDayStart = (rule, value, callback) => {
      let end = moment(moment(that.form.end.day).format('YYYY-MM-DD')+' '+that.form.end.time);
      let start = moment(moment(that.form.start.day).format('YYYY-MM-DD')+' '+that.form.start.time);
      if (!start.isBefore(end)) {
        callback(new Error('Start day must be less than end date'));
      }
      callback();
    };
    let checkLessTimeStart = (rule, value, callback) => {
      let end = moment(moment(that.form.end.day).format('YYYY-MM-DD')+' '+that.form.end.time);
      let start = moment(moment(that.form.start.day).format('YYYY-MM-DD')+' '+that.form.start.time);
      if (!start.isBefore(end)) {
        callback(new Error('Start day must be less than end date'));
      }
      callback();
    };
    let checkLargerDayEnd = (rule, value, callback) => {
      let end = moment(moment(that.form.end.day).format('YYYY-MM-DD')+' '+that.form.end.time);
      let start = moment(moment(that.form.start.day).format('YYYY-MM-DD')+' '+that.form.start.time);
      if (!start.isBefore(end)) {
        callback(new Error('End day must be after start day'));
      }
      callback();
    };
    let checkLargerTimeEnd = (rule, value, callback) => {
      let end = moment(moment(that.form.end.day).format('YYYY-MM-DD')+' '+that.form.end.time);
      let start = moment(moment(that.form.start.day).format('YYYY-MM-DD')+' '+that.form.start.time);
      if (!start.isBefore(end)) {
        callback(new Error('End day must be after start day'));
      }
      callback();
    };

    return {
      form: {
        id: 0,
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
        lesday: [
          {validator: checkLessDayStart, trigger: 'none'}
        ],
        lestime: [
          {validator: checkLessTimeStart, trigger: 'none'}
        ],
        ltday: [
          {validator: checkLargerDayEnd, trigger: 'none'}
        ],
        lttime: [
          {validator: checkLargerTimeEnd, trigger: 'none'}
        ]
      },
    };
  },
  computed: {
    ...mapState('calendar', [
        'users',
    ]),
    ...mapState('auth', [
        'user',
    ]),
    usersCan: {
      get() {
        let that = this;
        let users = _.map(this.users, function(value) {
          return value.User;
        });
        return _.filter(users, function(value) {
          return value.id != that.user.id;
        });
      },
      set(value) {

      }
    },
    eventEdited: {
        get() {
          let that = this;

          if (this.$store.state.calendar.events.length != 0) {
            let eventEdited = _.find(this.$store.state.calendar.events, function(o) { return o.id == that.$route.params.event_id; });
            this.convertEventToForm(eventEdited);
            return eventEdited;
          } else {
            return {};
          }
        },
        set(value) {
            // this.event = value;
        }
    }
  },
  watch: {
    eventEdited: function(val, oldVal) {

    }
  },
  methods: {
    archiveEvent: function() {
      let that = this;
      that.$confirm('Are you sure want to archive this event', 'Warning', {
         confirmButtonText: 'OK',
         cancelButtonText: 'Cancel',
         type: 'warning'
      }).then(() => {
       that.$store.dispatch('calendar/archiveEvent', that.form.id);
       that.$router.go(-1);
      }).catch(() => {

      });
    },
    convertEventToForm: function(val) {
      if (!_.isEmpty(val)) {
        this.form.id = val.id;
        this.form.title = val.title;
        this.form.note = val.note;
        this.form.with = JSON.parse(val.with_user);
        this.form.is_allday = val.allDay;

        this.form.start.day = moment(val.start).toDate();
        this.form.start.time = moment(val.start).format('HH:mm');

        this.form.end.day = moment(val.end).toDate();
        this.form.end.time = moment(val.end).format('HH:mm');
      }
    },
    onSubmit: function(form) {
      let that = this;
      this.$refs[form].validate((valid) => {
        if (valid) {
          let data = Object.assign({}, that.form);
          data.start = moment(that.form.start.day).format('YYYY-MM-DD')+' '+that.form.start.time
          data.end = moment(that.form.end.day).format('YYYY-MM-DD')+' '+that.form.end.time
          that.$store.dispatch('calendar/updateEvent', data);
          that.$router.go(-1);
        } else {
          this.$message.error('Input form invalid !');
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
