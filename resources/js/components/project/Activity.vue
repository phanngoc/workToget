<template lang="html">
  <div class="container-fluid wr-activity">
    <div class="in-activity text-center col-md-8 ml-auto mr-auto">
      <div class="row">
        <h2>Activity</h2>
        <div class="timeline">
          <ItemActivity v-for="(activity, key) in activities" :key="activity['.key']" :activity="activity" :date="key">
          </ItemActivity>
        </div> <!-- .timeline -->
      </div>
    </div> <!-- .col-md-12 -->
  </div> <!-- .wr-project-activity -->
</template>

<script>
import axios from 'axios';
import { mapGetters, mapActions, mapState } from 'vuex';
import _ from 'lodash';
import ItemActivity from './ItemActivity.vue';

export default {
  created() {
    this.$store.dispatch('activity/loadActivity');
  },
  props: ['comment'],
  data: function() {
    return {
      act_data: []
    }
  },
  watch: {
    activities: function(val, oldVal) {
      console.log('activities', val);
    }
  },
  computed: {
    // ...mapState('activity', [
    //     'activities',
    // ]),
    activities: {
      get() {
        let results = _.map(this.$store.state.activity.activities, function(value) {
          // We must change to replace reference and ensure state in store is immutable
          let act_temp = value.slice(0);
          act_temp[0] = JSON.parse(act_temp[0]);
          act_temp[1] = parseInt(act_temp[1]);
          return act_temp;
        });
        return _.groupBy(results, function(activity) {
          let time = activity[1];
          let date = moment.unix(time).format("MMM Do YY");
          return date;
        });
      },
      set(val) {

      }
    }
  },

  methods: {

  },
  components: {
    ItemActivity
  },
  mounted() {

  }
}
</script>

<style lang="scss">
.timeline {
  width: 100%;
  position: relative;
  padding: 1px 0;
  list-style: none;
  font-weight: 300;
  .timeline-item {
    padding-left: 0;
    padding-right: 30px;
    &.timeline-item-right, &:nth-of-type(even):not(.timeline-item-left) {
      padding-left: 30px;
      padding-right: 0;
    }
    .timeline-event {
      width: 100%;
    }
  }
  &:before {
    border-right-style: solid;
    content: " ";
    display: block;
  }
  &:after {
    content: " ";
    display: block;
    clear: both;
  }
  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 50%;
    height: 100% !important;
    margin-left: 1px;
    border-right-width: 2px;
    border-right-style: solid;
    border-right-color: #888888;
  }
  &.timeline-single-column.timeline {
    width: 100%;
    max-width: 768px;
    .timeline-item {
      padding-left: 72px;
      padding-right: 0;
      &.timeline-item-right, &:nth-of-type(even):not(.timeline-item-left) {
        padding-left: 72px;
        padding-right: 0;
      }
      .timeline-event {
        width: 100%;
      }
    }
    &:before {
      left: 42px;
      width: 0;
      margin-left: -1px;
    }
    .timeline-item {
      width: 100%;
      margin-bottom: 20px;
      &:nth-of-type(even) {
        margin-top: 0;
      }
      > {
        .timeline-event {
          float: right !important;
          &:before, &:after {
            right: auto !important;
            border-left-width: 0 !important;
          }
          &:before {
            left: -15px !important;
            border-right-width: 15px !important;
          }
          &:after {
            left: -14px !important;
            border-right-width: 14px !important;
          }
        }
        .timeline-point {
          transform: translateX(-50%);
          left: 42px !important;
          margin-left: 0;
        }
      }
    }
    .timeline-label {
      transform: translateX(-50%);
      margin: 0 0 20px 42px;
      + .timeline-item + .timeline-item {
        margin-top: 0;
      }
    }
  }
  &.timeline-line-solid:before {
    border-right-style: solid;
  }
  &.timeline-line-dotted:before {
    border-right-style: dotted;
  }
  &.timeline-line-dashed:before {
    border-right-style: dashed;
  }
  .timeline-item {
    position: relative;
    float: left;
    clear: left;
    width: 50%;
    margin-bottom: 20px;
    &:before {
      content: "";
      display: table;
    }
    &:after {
      content: "";
      display: table;
      clear: both;
    }
    &:last-child {
      margin-bottom: 0 !important;
    }
    &.timeline-item-right > .timeline-event, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event {
      float: right !important;
    }
    &.timeline-item-right > .timeline-event:before, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event:before, &.timeline-item-right > .timeline-event:after, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event:after {
      right: auto !important;
      border-left-width: 0 !important;
    }
    &.timeline-item-right > .timeline-event:before, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event:before {
      left: -15px !important;
      border-right-width: 15px !important;
    }
    &.timeline-item-right > .timeline-event:after, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event:after {
      left: -14px !important;
      border-right-width: 14px !important;
    }
    > {
      .timeline-event {
        &:before {
          top: 10px;
          right: -15px;
          border-top: 15px solid transparent;
          border-left-width: 15px;
          border-left-style: solid;
          border-right-width: 0;
          border-right-style: solid;
          border-bottom: 15px solid transparent;
        }
        &:after {
          top: 11px;
          right: -14px;
          border-top: 14px solid transparent;
          border-left-width: 14px;
          border-left-style: solid;
          border-right-width: 0;
          border-right-style: solid;
          border-bottom: 14px solid transparent;
        }
      }
      .timeline-point {
        top: 25px;
      }
    }
  }
}

.timeline-single-column.timeline .timeline-item > .timeline-event {
  float: right !important;
  &:before, &:after {
    right: auto !important;
    border-left-width: 0 !important;
  }
  &:before {
    left: -15px !important;
    border-right-width: 15px !important;
  }
  &:after {
    left: -14px !important;
    border-right-width: 14px !important;
  }
}

.timeline .timeline-item {
  &:nth-of-type(2) {
    margin-top: 40px;
  }
  &.timeline-item-left {
    clear: both !important;
  }
  &.timeline-item-right {
    clear: both !important;
    float: right;
    clear: right;
  }
  &:nth-of-type(even):not(.timeline-item-left) {
    float: right;
    clear: right;
  }
  &.timeline-item-right > .timeline-point, &:nth-of-type(even):not(.timeline-item-left) > .timeline-point {
    left: -24px;
  }
  &.timeline-item-right > .timeline-point.timeline-point-blank, &:nth-of-type(even):not(.timeline-item-left) > .timeline-point.timeline-point-blank {
    left: -12px;
  }
  &.timeline-item-arrow-sm {
    &.timeline-item-right > .timeline-event, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event {
      float: right !important;
    }
    &.timeline-item-right > .timeline-event:before, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event:before, &.timeline-item-right > .timeline-event:after, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event:after {
      right: auto !important;
      border-left-width: 0 !important;
    }
    &.timeline-item-right > .timeline-event:before, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event:before {
      left: -10px !important;
      border-right-width: 10px !important;
    }
    &.timeline-item-right > .timeline-event:after, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event:after {
      left: -9px !important;
      border-right-width: 9px !important;
    }
    > {
      .timeline-event {
        &:before {
          top: 4px;
          right: -10px;
          border-top: 10px solid transparent;
          border-left-width: 10px;
          border-left-style: solid;
          border-right-width: 0;
          border-right-style: solid;
          border-bottom: 10px solid transparent;
        }
        &:after {
          top: 5px;
          right: -9px;
          border-top: 9px solid transparent;
          border-left-width: 9px;
          border-left-style: solid;
          border-right-width: 0;
          border-right-style: solid;
          border-bottom: 9px solid transparent;
        }
      }
      .timeline-point {
        top: 14px;
      }
    }
  }
}

.timeline-single-column.timeline .timeline-item.timeline-item-arrow-sm > .timeline-event {
  float: right !important;
  &:before, &:after {
    right: auto !important;
    border-left-width: 0 !important;
  }
  &:before {
    left: -10px !important;
    border-right-width: 10px !important;
  }
  &:after {
    left: -9px !important;
    border-right-width: 9px !important;
  }
}

.timeline .timeline-item.timeline-item-arrow-md {
  &.timeline-item-right > .timeline-event, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event {
    float: right !important;
  }
  &.timeline-item-right > .timeline-event:before, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event:before, &.timeline-item-right > .timeline-event:after, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event:after {
    right: auto !important;
    border-left-width: 0 !important;
  }
  &.timeline-item-right > .timeline-event:before, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event:before {
    left: -15px !important;
    border-right-width: 15px !important;
  }
  &.timeline-item-right > .timeline-event:after, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event:after {
    left: -14px !important;
    border-right-width: 14px !important;
  }
  > {
    .timeline-event {
      &:before {
        top: 10px;
        right: -15px;
        border-top: 15px solid transparent;
        border-left-width: 15px;
        border-left-style: solid;
        border-right-width: 0;
        border-right-style: solid;
        border-bottom: 15px solid transparent;
      }
      &:after {
        top: 11px;
        right: -14px;
        border-top: 14px solid transparent;
        border-left-width: 14px;
        border-left-style: solid;
        border-right-width: 0;
        border-right-style: solid;
        border-bottom: 14px solid transparent;
      }
    }
    .timeline-point {
      top: 25px;
    }
  }
}

.timeline-single-column.timeline .timeline-item.timeline-item-arrow-md > .timeline-event {
  float: right !important;
  &:before, &:after {
    right: auto !important;
    border-left-width: 0 !important;
  }
  &:before {
    left: -15px !important;
    border-right-width: 15px !important;
  }
  &:after {
    left: -14px !important;
    border-right-width: 14px !important;
  }
}

.timeline .timeline-item.timeline-item-arrow-lg {
  &.timeline-item-right > .timeline-event, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event {
    float: right !important;
  }
  &.timeline-item-right > .timeline-event:before, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event:before, &.timeline-item-right > .timeline-event:after, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event:after {
    right: auto !important;
    border-left-width: 0 !important;
  }
  &.timeline-item-right > .timeline-event:before, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event:before {
    left: -18px !important;
    border-right-width: 18px !important;
  }
  &.timeline-item-right > .timeline-event:after, &:nth-of-type(even):not(.timeline-item-left) > .timeline-event:after {
    left: -17px !important;
    border-right-width: 17px !important;
  }
  > {
    .timeline-event {
      &:before {
        top: 10px;
        right: -18px;
        border-top: 18px solid transparent;
        border-left-width: 18px;
        border-left-style: solid;
        border-right-width: 0;
        border-right-style: solid;
        border-bottom: 18px solid transparent;
      }
      &:after {
        top: 11px;
        right: -17px;
        border-top: 17px solid transparent;
        border-left-width: 17px;
        border-left-style: solid;
        border-right-width: 0;
        border-right-style: solid;
        border-bottom: 17px solid transparent;
      }
    }
    .timeline-point {
      top: 28px;
    }
  }
}

.timeline-single-column.timeline .timeline-item.timeline-item-arrow-lg > .timeline-event {
  float: right !important;
  &:before, &:after {
    right: auto !important;
    border-left-width: 0 !important;
  }
  &:before {
    left: -18px !important;
    border-right-width: 18px !important;
  }
  &:after {
    left: -17px !important;
    border-right-width: 17px !important;
  }
}

.timeline {
  .timeline-item > {
    .timeline-event {
      background: #fff;
      border: 1px solid #888888;
      color: #555;
      position: relative;
      float: left;
      border-radius: 3px;
      &:before {
        border-left-color: #888888;
        border-right-color: #888888;
      }
      &:after {
        border-left-color: #fff;
        border-right-color: #fff;
      }
      * {
        color: inherit;
      }
      &.timeline-event-default {
        background: #fff;
        border: 1px solid #888888;
        color: #555;
        &:before {
          border-left-color: #888888;
          border-right-color: #888888;
        }
        &:after {
          border-left-color: #fff;
          border-right-color: #fff;
        }
        * {
          color: inherit;
        }
      }
      &.timeline-event-primary {
        background: #f5f5f5;
        border: 1px solid #888888;
        color: #555;
        &:before {
          border-left-color: #888888;
          border-right-color: #888888;
        }
        &:after {
          border-left-color: #f5f5f5;
          border-right-color: #f5f5f5;
        }
        * {
          color: inherit;
        }
      }
      &.timeline-event-success {
        background: #F3F8ED;
        border: 1px solid #72b92e;
        color: #3F8100;
        &:before {
          border-left-color: #72b92e;
          border-right-color: #72b92e;
        }
        &:after {
          border-left-color: #F3F8ED;
          border-right-color: #F3F8ED;
        }
        * {
          color: inherit;
        }
      }
      &.timeline-event-info {
        background: #F0F8FD;
        border: 1px solid #3e93cf;
        color: #0062A7;
        &:before {
          border-left-color: #3e93cf;
          border-right-color: #3e93cf;
        }
        &:after {
          border-left-color: #F0F8FD;
          border-right-color: #F0F8FD;
        }
        * {
          color: inherit;
        }
      }
      &.timeline-event-warning {
        background: #FFF9E9;
        border: 1px solid #d0aa42;
        color: #ac7e00;
        &:before {
          border-left-color: #d0aa42;
          border-right-color: #d0aa42;
        }
        &:after {
          border-left-color: #FFF9E9;
          border-right-color: #FFF9E9;
        }
        * {
          color: inherit;
        }
      }
      &.timeline-event-danger {
        background: #FFC4BC;
        border: 1px solid #d25a4b;
        color: #B71500;
        &:before {
          border-left-color: #d25a4b;
          border-right-color: #d25a4b;
        }
        &:after {
          border-left-color: #FFC4BC;
          border-right-color: #FFC4BC;
        }
        * {
          color: inherit;
        }
      }
      &:before, &:after {
        content: "";
        display: inline-block;
        position: absolute;
      }
      .timeline-heading, .timeline-body, .timeline-footer {
        padding: 4px 10px;
      }
      .timeline-heading p, .timeline-body p, .timeline-footer p, .timeline-heading ul, .timeline-body ul, .timeline-footer ul {
        margin-bottom: 0;
      }
      .timeline-heading h4 {
        font-weight: 400;
      }
      .timeline-footer a {
        cursor: pointer;
        text-decoration: none;
      }
      .panel, .table, .blankslate {
        margin: 0;
        border: none;
        border-radius: inherit;
        overflow: hidden;
      }
      .table th {
        border-top: 0;
      }
    }
    .timeline-point {
      color: #888888;
      background: #fff;
      right: -24px;
      width: 24px;
      height: 24px;
      margin-top: -12px;
      margin-left: 12px;
      margin-right: 12px;
      position: absolute;
      z-index: 100;
      border-width: 2px;
      border-style: solid;
      border-radius: 100%;
      line-height: 20px;
      text-align: center;
      &.timeline-point-blank {
        right: -12px;
        width: 12px;
        height: 12px;
        margin-top: -6px;
        margin-left: 6px;
        margin-right: 6px;
        color: #888888;
        background: #888888;
      }
      &.timeline-point-default, &.timeline-point-primary {
        color: #888888;
        background: #fff;
      }
      &.timeline-point-success {
        color: #72b92e;
        background: #fff;
      }
      &.timeline-point-info {
        color: #3e93cf;
        background: #fff;
      }
      &.timeline-point-warning {
        color: #d0aa42;
        background: #fff;
      }
      &.timeline-point-danger {
        color: #d25a4b;
        background: #fff;
      }
    }
  }
  .timeline-label {
    position: relative;
    float: left;
    clear: left;
    width: 50%;
    margin-bottom: 20px;
    top: 1px;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    padding: 0;
    text-align: center;
    &:before {
      content: "";
      display: table;
    }
    &:after {
      content: "";
      display: table;
      clear: both;
    }
    &:last-child {
      margin-bottom: 0 !important;
    }
    + .timeline-item {
      margin-top: 0;
      + .timeline-item {
        margin-top: 40px;
      }
    }
    .label-default, .label-primary {
      background-color: #888888;
    }
    .label-info {
      background-color: #3e93cf;
    }
    .label-warning {
      background-color: #d0aa42;
    }
    .label-danger {
      background-color: #d25a4b;
    }
  }
}

@media (max-width: 768px) {
  .timeline.timeline {
    width: 100%;
    max-width: 100%;
    .timeline-item {
      padding-left: 72px;
      padding-right: 0;
      &.timeline-item-right, &:nth-of-type(even):not(.timeline-item-left) {
        padding-left: 72px;
        padding-right: 0;
      }
      .timeline-event {
        width: 100%;
      }
    }
    &:before {
      left: 42px;
      width: 0;
      margin-left: -1px;
    }
    .timeline-item {
      width: 100%;
      margin-bottom: 20px;
      &:nth-of-type(even) {
        margin-top: 0;
      }
      > {
        .timeline-event {
          float: right !important;
          &:before, &:after {
            right: auto !important;
            border-left-width: 0 !important;
          }
          &:before {
            left: -15px !important;
            border-right-width: 15px !important;
          }
          &:after {
            left: -14px !important;
            border-right-width: 14px !important;
          }
        }
        .timeline-point {
          transform: translateX(-50%);
          left: 42px !important;
          margin-left: 0;
        }
      }
    }
    .timeline-label {
      transform: translateX(-50%);
      margin: 0 0 20px 42px;
      + .timeline-item + .timeline-item {
        margin-top: 0;
      }
    }
  }
}
</style>
