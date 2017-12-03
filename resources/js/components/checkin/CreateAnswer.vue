<template lang="html">
  <el-card class="box-card wr-add-answer">
    <div slot="header" class="clearfix">
      <span>Write your answer</span>
      <el-button style="float: right;" type="primary" @click="backCalendar">Back</el-button>
    </div>

    <h2 class="flush">
      {{questionEdited.question}}
    </h2>
    <p class="flush">
      <i class="fa fa-refresh" aria-hidden="true"></i>
      {{'Asking ' + numPeople + ' people ' }}{{questionEdited.cron | cron}}
    </p>

    <el-form ref="add_answer_form" :model="form" :rules="rules" :label-position="'top'" label-width="300px">
      <el-form-item>
        <el-date-picker
          v-model="form.date_created"
          type="date"
          placeholder="Pick a day">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <Trix ref="trix_editor" id="x-content" name="content" :change="changeValue" :value="form.content"/>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSubmit()">Post my answer</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>


<script>

import { mapGetters, mapActions, mapState } from 'vuex';
import _ from 'lodash';
import moment from 'moment';
import Trix from '../common/Trix';

export default {
  created() {
    console.log("create answer", this.form);
  },
  data: function() {
    let that = this;
    return {
      form: {
        date_created: (new Date()).toISOString(),
        content: '',
      },
      rules: {
        date_created: [
          {required: true, message: "Date created is required"},
        ]
      }
    };
  },
  computed: {
    ...mapState('checkin', [
      'questionEdited',
    ]),
    numPeople: {
      get() {
        return (typeof this.questionEdited.Users !== 'undefined') ? this.questionEdited.Users.length : 'no one';
      },
      set(value) {

      }
    }
  },
  watch: {

  },
  methods: {
    onSubmit: function() {
      this.$store.dispatch('checkin/createAnswer', this.form).then((response) => {
        this.$refs.trix_editor.reset();
        this.$router.push({name: 'checkin.show_question', params: {id: this.$route.params.id, question_id: this.$route.params.question_id}});
      });
    },
    backCalendar: function() {
      this.$router.go(-1);
    },
    changeValue: function(value) {
      this.form.content = value;
    }
  },
  components: {
    Trix
  },
  mounted() {
    let that = this;
  }
}
</script>

<style lang="scss" scoped>
  @import "../../../sass/_vars.scss";

</style>
