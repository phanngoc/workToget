<template lang="html">
  <div class="trello">
    <draggable v-model="frames" @end="onEndFrame">
      <Frame v-for="(frame, index) in frames" :id="index" :key="frame.id">
      </Frame>
      <div class="frame" slot="footer">
        <el-form ref="create_frame" :model="form" :rules="rules">
          <el-form-item prop="name">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="onCreateFrame('create_frame')">Save</el-button>
            <el-button icon="close" @click="cancel"></el-button>
          </el-form-item>
        </el-form>
      </div>
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
      form: {
        name: ''
      },
      rules: {
        name: [
          {required: true, message: "Name is required"},
        ]
      },
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
    // "$route": function(val, oldVal) {
    //   console.log('route change', val);
    //
    // }
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
    onCreateFrame: function(formName) {
      let that = this;
      this.$refs[formName].validate((valid) => {
        if (valid) {
          that.$store.dispatch('trello/addFrame', {name: that.form.name});
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    cancel: function() {

    }
  },
  components: {
    draggable,
    Task,
    ModalTask,
    Frame
  },
  mounted() {
    if (this.$route.name == "trello.modal") {
        this.$store.dispatch('trello/openEditTask', this.$route.params.task_id);
    }
  }
}
</script>

<style lang="scss" scoped>
  .trello {
    overflow-x: auto;
    white-space: nowrap;
    width: 100%;
    .frame{
        background-color: #ecebeb;
        display: inline-block;
        vertical-align:top;
        // float: left;
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
