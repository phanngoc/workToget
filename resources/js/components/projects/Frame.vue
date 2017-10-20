<template lang="html">
  <div class="frame" >
    <p class="name-frame">{{frame.name}}</p>
    <el-dropdown trigger="click" @command="handleCommand">
      <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="add-card">Add card</el-dropdown-item>
        <el-dropdown-item>Action 2</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
    <div class="add-card" v-if="isAddCard">
      <el-form :model="form">
          <el-input type="textarea" name="title" v-model="form.title"></el-input>
          <el-form-item>
             <el-button type="success" @click="onSave">Save</el-button>
             <el-button @click="onCancel"><i class="fa fa-times" aria-hidden="true"></i></el-button>
          </el-form-item>
      </el-form>
    </div>
    <draggable v-model="tasks" class="dragArea" :options="{group:'frames'}" @end="onEndFrame">
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
      form: {},
      isAddCard: false
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
        this.$store.dispatch('trello/syncTaskSort', {index: this.id, data: value});
      }
    }
  },

  methods: {
    ...mapActions('trello', [

    ]),
    onEndFrame: function(evt) {
    },
    handleCommand: function(command) {
      if (command=='add-card') {
        this.isAddCard = true;
      }
    },
    onSave: function() {
      this.$store.dispatch('trello/saveAddTask', {frame_id: this.frame.id, title: this.form.title});
      this.form.title = '';
      this.isAddCard = false;
    },
    onCancel: function() {
      this.form.title = '';
      this.isAddCard = false;
    }
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
