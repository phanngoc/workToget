<template lang="html">
  <el-card class="box-card wr-add-answer">
    <div slot="header" class="clearfix">
      <span>Edit answer</span>
      <el-button style="float: right;" type="primary" @click="backCalendar">Back</el-button>
    </div>

    <h2 class="flush">
      {{questionEdited.question}}
    </h2>
    <p class="flush">
      <i class="fa fa-refresh" aria-hidden="true"></i>
      {{'Asking ' + numPeople + ' people ' }}{{questionEdited.cron | cron}}
    </p>

    <el-form ref="update_answer_form" :model="form" :rules="rules" :label-position="'top'" label-width="300px">
      <el-form-item>
        <el-date-picker
          v-model="form.date_created"
          type="date"
          placeholder="Pick a day">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <Trix ref="x_content" id="x-content" name="content" :change="changeContent" :value="form.content"/>
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onSubmit()">Update my answer</el-button>
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
    // this.$store.dispatch('checkin/loadQuestionEdited');
    // this.$store.dispatch('checkin/loadAnswerEdited');
  },
  data: function() {
    return {
      form: {
        date_created: '',
        content: '',
        id: 0
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
      'questionEdited'
    ]),
    answerEdited: {
      get() {
        let that = this;
        let answerEdited = this.$store.state.checkin.answerEdited;
        if (!_.isEmpty(answerEdited)) {
          // We must use nexttick because child Trix component han't been rerendered
          this.$nextTick(() => {
            this.$refs.x_content.init(answerEdited.content);
          })

          this.convertToForm(answerEdited);
          return answerEdited;
        } else {
          return {};
        }
      },
      set(value) {
      }
    },
    numPeople: {
      get() {
         return (typeof this.questionEdited.Users !== 'undefined') ? this.questionEdited.Users.length : 'no one';
      },
      set(value) {

      }
    }
  },
  beforeUpdate() {

  },
  watch: {
    answerEdited: function(val, oldVal) {

    }
  },
  methods: {
    changeContent: function(value) {
      this.form.content = value;
    },
    onSubmit: function() {
      this.$store.dispatch('checkin/updateAnswer', this.form);
    },
    backCalendar: function() {
      this.$router.go(-1);
    },
    convertToForm: function(answerEdited) {
      this.form = Object.assign({}, answerEdited);
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
