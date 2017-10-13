<template lang="html">
  <div class="frame" >
    <p class="name-frame">{{frame.name}}</p>
    <draggable v-model="tasks" class="dragArea" :options="{group:'frames'}">
        <Task v-for="task in tasks" :task="task" :key="task.id"
        ></Task>
    </draggable>
  </div>
</template>

<script>
import axios from 'axios';
import draggable from 'vuedraggable';
import Task from './Task';
import { mapGetters, mapActions, mapState } from 'vuex';
import _ from 'lodash';

export default {
  created() {

  },
  props: ['id'],
  data: function() {
    return {
    }
  },
  computed: {
    frame: {
      get() {
        return this.$store.state.trello.frames[this.id];
      }
    },
    tasks: {
      get() {
        return this.$store.state.trello.frames[this.id].Tasks;
      },
      set(value) {
        console.log('Frame', this.id, value);
        this.$store.dispatch('trello/syncTaskSort', {index: this.id, data: value});
      }
    }
  },

  methods: {
    ...mapActions('trello', [

    ]),
    onEndFrame: function(evt) {
      
      // let data = _.map(this.frames, function(value, key) {
      //     return {id: value.id, order: key};
      // });
      // this.$store.dispatch('trello/syncFrameSort', {project_id: this.$route.params.id, data: data});
    },
  },
  components: {
    draggable,
    Task,
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
</style>
