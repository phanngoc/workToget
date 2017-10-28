<template lang="html">
  <div class="frame">
    <div class="list-content">
      <div class="list-header">
        <p class="name-frame" @click="toggleEdit" v-show="!is_editting">{{name}}</p>
        <input name="name" ref="edit_frame" class="edit-frame" @blur="toggleEdit"
          v-on:keyup.13="keySubmit" v-model="name" v-show="is_editting"/>
        <el-dropdown class="att-menu" trigger="click" @command="handleCommand">
          <a href="javascript:" class="wr-at-icon">
            <i class="fa fa-ellipsis-h" aria-hidden="true"></i>
          </a>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="add-card">Add card</el-dropdown-item>
            <el-dropdown-item command="archive-list">Archive this list</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div class="add-card" v-if="isAddCard">
        <el-form :model="form">
            <el-form-item>
              <el-input type="textarea" name="title" v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item>
               <el-button type="success" @click="onSave">Save</el-button>
               <a href="javascript:" @click="onCancel" class="btn-remove"><i class="fa fa-times" aria-hidden="true"></i></a>
            </el-form-item>
        </el-form>
      </div>
      <draggable v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10"
          v-model="tasks" class="dragArea" :options="{group:'frames'}" @end="onEndFrame">
          <Task v-for="task in tasks" :task="task" :key="task.id"
          ></Task>
      </draggable>
    </div>
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
      isAddCard: false,
      is_editting: false,
      name: '',
    }
  },
  watch: {
    frame: function(val, oldVal) {

    }
  },
  computed: {
    frame: {
      get() {
        let frame = this.$store.state.trello.frames[this.id];
        this.name = frame.name;
        return frame;
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
    loadMore: function() {

    },
    onEndFrame: function(evt) {
    },
    keySubmit: function() {
      this.$refs.edit_frame.blur();
    },
    toggleEdit: function() {
      let that = this;
      this.is_editting = !this.is_editting;
      if (this.is_editting) {
        this.$nextTick(function() {
          that.$refs.edit_frame.focus();
        });
      } else {
        this.$store.dispatch('trello/updateFrame', {id: this.frame.id, name: this.name});
      }
    },
    handleCommand: function(command) {
      if (command=='add-card') {
        this.isAddCard = true;
      } else if (command == 'archive-list') {
        this.$confirm('Are you sure to delete this list', 'Warning', {
          confirmButtonText: 'OK',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          this.$store.dispatch('trello/archiveFrame', this.frame.id);
        }).catch(() => {

        });
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
  .frame{
    height: 100%;
    .list-content{
      max-height: 100%;
      display: flex;
      flex-direction: column;
      position: relative;
      background-color: #8ecbf9;
      padding: 3px 5px 4px 5px;
      .list-header{
        flex: 0 0 auto;
        position: relative;
        .att-menu{
          position: absolute;
          top: 2px;
          right: 2px;
        }
        .edit-frame{
          margin-bottom: 1rem;
        }
      }
      .dragArea{
        flex: 1 1 auto;
        overflow-y: auto;
        overflow-x: hidden;
      }
      .add-card{
        .el-form-item {
          margin-bottom: 2px;
        }
        .btn-remove{
          font-size: 21px;
          margin-left: 7px;
          color: #a09f9f;
        }
      }
    }
  }
</style>
