<template lang="html">
  <div class="trello row">
    <draggable v-model="frames" @end="onEndFrame">
      <Frame v-for="(frame, index) in frames" :id="index" :key="frame.id">
      </Frame>
    </draggable>
    <ModalTask></ModalTask>
  </div>
</template>

<script>

import axios from 'axios';
import draggable from 'vuedraggable';
import Task from './Task';
import ModalTask from './ModalTask';
import Frame from './Frame';
import { mapGetters, mapActions, mapState } from 'vuex';
import _ from 'lodash';

export default {
  created() {
    this.$store.dispatch('trello/loadFrames', this.$route.params.id);
    this.$store.dispatch('trello/loadLabels', this.$route.params.id);
    this.$store.dispatch('project/loadProject', this.$route.params.id);
    this.$socket.emit('JOIN_PROJECT', this.$route.params.id);
  },
  data: function() {
    return {
    }
  },
  computed: {
    ...mapState('trello', [
        'isOpen',
        'activeTask'
    ]),
    ...mapState('project', [
        'project'
    ]),
    frames: {
      get() {
        return this.$store.state.trello.frames;
      },
      set(value) {
        this.$store.dispatch('trello/updateFrameSort', value);
      }
    }
  },
  watch: {
    project: function(val, oldVal) {

    }
  },
  methods: {
    ...mapActions('trello', [
        'openEditTask',
        'closeEditTask'
    ]),
    onEndFrame: function(evt) {
      let data = _.map(this.frames, function(value, key) {
          return {id: value.id, order: key};
      });
      this.$store.dispatch('trello/syncFrameSort', {project_id: this.$route.params.id, data: data});
    },
  },
  components: {
    draggable,
    Task,
    ModalTask,
    Frame
  },
  mounted() {

  }
}
</script>

<style lang="scss" scoped>
  .trello {
    overflow-x: scroll;
    .frame{
        background-color: #ecebeb;
        display: block;
        float: left;
        width: 260px;
        padding: 5px;
        margin-left: 4px;
        .name-frame{
            font-weight: bold;
        }
        .task{
            .ta-title{
                border: 1px solid black;
            }
        }
    }
  }
</style>
