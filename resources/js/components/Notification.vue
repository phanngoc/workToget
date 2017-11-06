<template lang="html">
  <div class="dropdown">
    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button"
      aria-haspopup="true" :aria-expanded="stateOpen" @click="toggleStateOpen">Notification (<b>{{numNewNoti}}</b>)</a>
    <ul class="dropdown-menu notify-drop">
      <div class="notify-drop-title">
      	<div class="row">
      		<div class="col-md-6 col-sm-6 col-xs-6">Bildirimler (<b>2</b>)</div>
      		<div class="col-md-6 col-sm-6 col-xs-6 text-right"><a href="" class="rIcon allRead" data-tooltip="tooltip" data-placement="bottom" title="tümü okundu."><i class="fa fa-dot-circle-o"></i></a></div>
      	</div>
      </div>
      <!-- end notify title -->
      <!-- notify content -->
      <div class="drop-content">
      	<NotiItem v-for="(notification, index) in notifications" :key="index"
          :notification="notification[0]" :time="notification[1]"/>
      </div>
      <div class="notify-drop-footer text-center">
      	<a href=""><i class="fa fa-eye"></i> Tümünü Göster</a>
      </div>
    </ul>
  </div>
</template>


<script>

import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';
import NotiItem from './NotiItem';
import _ from 'lodash';
import PopupNoti from './PopupNoti';

export default {
  sockets: {
    NOTIFICATION: function(val) {
      console.log('da nhan duoc noti o component', val);
      let act_temp = val.slice(0);
      act_temp[0] = JSON.parse(act_temp[0]);
      act_temp[1] = parseInt(act_temp[1]);

      this.$notify({
        title: 'New notification',
        message: this.contentPopup(act_temp),
      });
    }
  },
  created() {
    this.$store.dispatch('auth/loadNotification');
  },
  data: () => {
    return {
      stateOpen: false,
      numNewNoti: 0,
      title: '',
      description: '',
      action: ''
    }
  },
  computed: {
    ...mapState('auth', [
      'user'
    ]),
    notifications: {
      get() {
        let results = _.map(this.$store.state.auth.notifications, function(value) {
          // We must change to replace reference and ensure state in store is immutable
          let act_temp = value.slice(0);
          act_temp[0] = JSON.parse(act_temp[0]);
          act_temp[1] = parseInt(act_temp[1]);
          return act_temp;
        });

        return results;
      },
      set(val) {

      }
    }
  },
  watch: {
    notifications: function(val, oldVal) {
      this.numNewNoti = _.reduce(val, function(sum, subValue) {
        if (subValue[0].type == 0) {
          return sum + 1;
        } else {
          return sum;
        }
      }, 0);
    }
  },
  methods: {
    toggleStateOpen: function() {
      this.stateOpen = ! this.stateOpen;
      this.$store.dispatch('auth/checkNotification');
    },
    contentPopup: function(val) {
      const h = this.$createElement;
      return (
        <PopupNoti notification={val[0]} time={val[1]} />
      );
    }
  },
  components: {
    NotiItem
  },
  mounted() {

  }
}
</script>

<style lang="scss">
.drop-content{
  .li-item{
    .at-link{
      display: flex;
      flex-direction: row;
      text-decoration: none;
      .wr-avatar{

      }
      .wr-info{
        flex-grow: 1;
      }
    }
  }

}
.dropdown-menu.notify-drop {
  right: 0;
  left: auto;
  min-width: 330px;
  background-color: #fff;
  min-height: 360px;
  max-height: 360px;
  .notify-drop-title {
    border-bottom: 1px solid #e2e2e2;
    padding: 5px 15px 10px 15px;
  }
  .drop-content {
    min-height: 280px;
    max-height: 280px;
    overflow-y: scroll;
    &::-webkit-scrollbar-track {
      background-color: #F5F5F5;
    }
    &::-webkit-scrollbar {
      width: 8px;
      background-color: #F5F5F5;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #ccc;
    }
    > li {
      border-bottom: 1px solid #e2e2e2;
      padding: 10px 0px 5px 0px;
      &:nth-child(2n+0) {
        background-color: #fafafa;
      }
      &:after {
        content: "";
        clear: both;
        display: block;
      }
      &:hover {
        background-color: #fcfcfc;
      }
      &:last-child {
        border-bottom: none;
      }
      .notify-img {
        float: left;
        display: inline-block;
        width: 45px;
        height: 45px;
        margin: 0px 0px 8px 0px;
      }
    }
  }
  .allRead {
    margin-right: 7px;
  }
  .rIcon {
    float: right;
    color: #999;
    &:hover {
      color: #333;
    }
  }
  .drop-content {
    > li {
      a {
        font-size: 12px;
        font-weight: normal;
      }
      font-weight: bold;
      font-size: 11px;
      hr {
        margin: 5px 0;
        width: 70%;
        border-color: #e2e2e2;
      }
    }
    .pd-l0 {
      padding-left: 0;
    }
    > li p {
      font-size: 11px;
      color: #666;
      font-weight: normal;
      margin: 3px 0;
      &.time {
        font-size: 10px;
        font-weight: 600;
        top: -6px;
        margin: 8px 0px 0px 0px;
        padding: 0px 3px;
        border: 1px solid #e2e2e2;
        position: relative;
        background-image: linear-gradient(#fff, #f2f2f2);
        display: inline-block;
        border-radius: 2px;
        color: #B97745;
        &:hover {
          background-image: linear-gradient(#fff, #fff);
        }
      }
    }
  }
  .notify-drop-footer {
    border-top: 1px solid #e2e2e2;
    bottom: 0;
    position: relative;
    padding: 8px 15px;
    a {
      color: #777;
      text-decoration: none;
      &:hover {
        color: #333;
      }
    }
  }
}
</style>
