<template lang="html">
  <div class="timeline-item">
    <div class="timeline-point timeline-point-primary">
      <i class="fa fa-star"></i>
    </div>
    <div class="timeline-event timeline-event-primary">
      <div class="timeline-heading">
        <div class="text">
          <img :src="'/img/' + activity[0].owner.avatar" alt="avatar" class="avatar">
          <span>
            <b>{{activity[0].owner.fullname}}</b>
            <span class="action">{{action}}</span>
            <span class="target" v-if="activity[0].rely_on">
              <span class="ta-box-wr" v-if="activity[0].rely_on.type=='Task'">
                <b class="ta-re">{{activity[0].rely_on.data.title}}</b>
              </span>
              <span class="ta-box-wr" v-if="activity[0].rely_on.type=='Event'">
                <b class="ta-re">{{activity[0].rely_on.data.title}}</b>
              </span>
              <span class="ta-box-wr" v-if="activity[0].rely_on.type=='Project'">
                <b class="ta-re">{{activity[0].rely_on.data.name}}</b>
              </span>
            </span>
          </span>
        </div>
      </div>
      <div class="timeline-body">
        <div class="card" v-if="activity[0].target.type=='Comment'">
          <router-link :to="{ name: activity[0].target.link.name, params: activity[0].target.link.params }">
            <div class="card-block">
              <p class="card-text">{{activity[0].target.data.content}}</p>
            </div>
          </router-link>
        </div>
        <div class="card" v-if="activity[0].target.type=='Event'">
          <router-link :to="{ name: activity[0].target.link.name, params: activity[0].target.link.params }">
            <div class="card-block">
              <p class="card-text">{{activity[0].target.data.title}}</p>
            </div>
          </router-link>
        </div>
      </div>
      <div class="timeline-footer">
        <p class="text-right">{{time}}</p>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';
import moment from 'moment';
import _ from 'lodash';

export default {
  created() {

  },
  props: ['activity'],
  data: () => {
    return {
      action: '',
      time: '',
    }
  },
  computed: {

  },
  methods: {

  },
  components: {

  },
  mounted() {
    this.time = moment.unix(this.activity[1]).format("hh:mm:ss");
    if (_.isUndefined(this.activity[0].target)) {
      console.log('sao lai under', this.activity[0]);
    }
    this.action = this.me_activity(this.activity[0]).action;
  }
}
</script>

<style lang="scss" scoped>
  .timeline-item{
    .timeline-heading{
      .text{
        .avatar{
          width: 48px;
          height: 48px;
        }
        .ta-re{
          font-weight: bold;
        }
      }
    }
  }
</style>
