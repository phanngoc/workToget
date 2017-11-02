<template lang="html">
  <div class="timeline-item">
    <div class="timeline-point timeline-point-primary">
      <i class="fa fa-star"></i>
    </div>
    <div class="timeline-event timeline-event-primary">
      <div class="timeline-heading">
        <h4>
          <img :src="'/img/' + activity[0].owner.avatar" alt="avatar" class="avatar">
          <span>
            <b>{{activity[0].owner.fullname}}</b>
            <p class="action">{{action}}</p>
            <p class="target" v-if="activity[0].rely_on">
              <div class="ta-box-wr" v-if="activity[0].rely_on.type=='Task'">
                <b class="ta-re">{{activity[0].rely_on.data.title}}</b>
              </div>
              <div class="ta-box-wr" v-if="activity[0].rely_on.type=='Event'">
                <b class="ta-re">{{activity[0].rely_on.data.title}}</b>
              </div>
            </p>
          </span>
        </h4>
      </div>
      <div class="timeline-body">
        <div class="card" v-if="activity[0].target.type=='Comment'">
          <router-link :to="{ name: activity[0].target.link.name, params: activity[0].target.link.params }">
            <div class="card-block">
              <p class="card-text">{{activity[0].target.data.content}}</p>
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
    let type = this.activity[0].action;
    switch (type) {
      case "save_edit_comment":
        this.action = "updated comment on";
        break;
      case "save_add_comment":
        this.action = "added comment on";
        break;
      case "event_add_comment":
        this.action = "added comment on";
        break;
      case "event_update_comment":
        this.action = "updated comment on";
        break;
      case "event_delete_comment":
        this.action = "deleted comment on";
        break;
      default:

    }
  }
}
</script>

<style lang="scss" scoped>
  .timeline-item{
    .timeline-heading{
      h4{
        .avatar{
          width: 48px;
          height: 48px;
        }
      }
    }
  }
</style>
