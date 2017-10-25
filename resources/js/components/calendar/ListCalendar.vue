<template lang="html">
  <div class="d-flex flex-column wr-list-calendar">
    <div class="wr-title p-2">
        <el-button type="success" @click="addEvent">Add event</el-button>
    </div>
    <div class="wr-calendar p-2">
      <h3 class="title">Schedule</h3>
      <full-calendar ref="calendar"
        @event-selected="eventSelected"
        @event-created="eventCreated"
        @event-resize="eventResize"
        :events="events"
        :editable="true"
        :selectable="true"
        :config="config"
        ></full-calendar>
    </div>
  </div>
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
    return {
      config: {
        editable: true,
        droppable: true,
        defaultView: 'month',
        select: function(start, end) {
          let data = {title: 'Untitled', start: start.toDate(), end: end.toDate()};
          that.$confirm('Create event with this time', 'Info', {
             confirmButtonText: 'OK',
             cancelButtonText: 'Cancel',
             type: 'info'
           }).then(() => {
             that.$store.dispatch('calendar/setCreatedEvent', data);
             that.$router.push({ name: 'calendar.add_event', params: {id: that.$route.params.id}})
           }).catch(() => {

           });
  			},

      },
      selected: {},
      test: 0,
    };
  },
  computed: {
    ...mapState('calendar', [
        'events',
    ]),
  },
  watch: {

  },
  methods: {
    eventSelected(event) {
      console.log('eventSelected:', event);
      this.selected = event;
      this.$store.dispatch('calendar/setEditEvent', event);
      this.$router.push({ name: 'calendar.edit_event', params: {id: this.$route.params.id, event_id: event.id}});
    },
    eventCreated(...events) {
      console.log('eventCreated', events);
      // this.$router.push({ name: 'calendar.add_event', params: {id: this.$route.params.id}})
    },
    eventResize(event) {
      console.log('eventResize:', event);
    },
    addEvent() {
      this.$router.push({ name: 'calendar.add_event', params: {id: this.$route.params.id}})
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
  @import '~fullcalendar/dist/fullcalendar.css';

</style>
