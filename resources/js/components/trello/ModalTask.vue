<template lang="html">
  <div class="modal fade" id="modal-edit-task">
    <div class="modal-dialog modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <Editable name="title" className="modal-title" @update="tempTask.title = $event" :content="activeTask.title"></Editable>
          <span v-show="errors.has('title')" class="help is-danger">{{ errors.first('title') }}</span>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <div class="wr-af-ti d-flex flex-row justify-content-end">
            <div class="wr-description p-2 mr-auto">
              <div class="sub-label">
                <h4 class="su-ti-la ti-sm">Labels</h4>
                <div class="su-li-la">
                  <span v-for="(label, index) in tempTask.Labels" :key="label.id" class="badge" :style="'background-color:' + label.color">
                    {{label.name}}
                  </span>
                </div>
              </div>
              <div class="sub-label" v-if="tempTask.due_date">
                <h4 class="su-ti-la ti-sm">Due date</h4>
                <div class="su-li-la m-due-date" :style="'background-color:' + colorDuaDate">
                  <span>{{ tempTask.due_date | moment("calendar") }}</span>
                </div>
              </div>
              <Editable name="description" className="description" @update="tempTask.description = $event" :content="activeTask.description"></Editable>
              <span v-show="errors.has('description')" class="help is-danger">{{ errors.first('description') }}</span>
              <button type="button" class="btn btn-primary btn-save" @click="saveAndClose">Save</button>
            </div>
            <div class="wr-action p-2">
              <div class="wr-add">
                <h4>Add</h4>
                <Labels></Labels>
                <div class="list-btn add-duedate dropdown">
                  <a href="javascript:" class="btn btn-outline-primary" data-toggle="dropdown">Due Date</a>
                  <div class="dropdown-menu">
                    <el-date-picker
                      v-model="tempTask.due_date"
                      type="datetime"
                      @change="changeDueDate"
                      placeholder="Select date and time">
                    </el-date-picker>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <hr>
          <div class="task-comments">
            <h4 class="ti-sm">Add Comment</h4>
            <form class="d-flex flex-column new-comment">
              <div class="d-flex flex-row">
                <div class="p-2">
                  <img :src="'/img/' + user.avatar" alt="" class="sm-avatar">
                </div>
                <div class="p-2">
                  <textarea name="comment" class="form-control" v-model="newComment" rows="5" cols="80">
                  </textarea>
                </div>
              </div>
              <div class="d-flex flex-row">
                <button type="button" class="btn btn-primary" @click="addComment">Save</button>
              </div>
            </form>
          </div>
          <hr>
          <div class="list-comments">
            <Comment v-for="(comment, index) in comments" :comment="comment" :key="comment.id"></Comment>
          </div>
        </div>
        <div class="modal-footer">

        </div>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios';
import draggable from 'vuedraggable';
import Editable from '../common/Editable';
import { mapGetters, mapActions, mapState } from 'vuex';
import { Validator } from 'vee-validate';
import Comment from './Comment';
import Labels from './Labels';
import moment from 'moment';
import _ from 'lodash';

export default {
  created() {
    this.validator = new Validator({
      title: 'required|min:3|max:500',
      description: 'required|min:3'
    });
    this.$set(this, 'errors', this.validator.errors);
  },
  computed: {
    ...mapState('trello', [
        'isOpen',
        'activeTask',
        'saveSimpleTask',
        'comments'
    ]),
    ...mapState('auth', [
        'user',
    ]),
    ...mapState('project', [
        'project',
    ]),
    due_date() {
      return this.tempTask.due_date;
    }
  },
  watch: {
    isOpen: function(val, oldVal) {
      if (val) {
        $('#modal-edit-task').modal('show');
      } else {
        $('#modal-edit-task').modal('hide');
      }
    },
    activeTask: function(val, oldVal) {
      this.$store.dispatch('trello/getListComment', val.id);
      this.tempTask = _.pick(val, ['id', 'title', 'description', 'frame_id',
        'due_date', 'Labels']);
    },
    due_date: function(val, oldVal) {
      this.colorDuaDate = this.getColorByTime(val);
    }
  },
  updated: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been re-rendered
    })
  },
  data: function() {
    return {
      tempTask: {},
      errors: null,
      newComment: '',
      color: {past: '#b04632', future: '#D9B51C', none: '#97a8be'},
      diffTime: '',
      colorDuaDate: '#97a8be',
    }
  },
  methods: {
    addComment: function() {
      this.$store.dispatch('trello/addComment', {task_id: this.activeTask.id,
        content: this.newComment,
        user_id: this.user.id
      });
      this.newComment = "";
    },
    saveAndClose: function() {
      let that = this;
      this.validator.validateAll({
        title: this.tempTask.title,
        description: this.tempTask.description
      }).then((result) => {
        if (result) {
          // eslint-disable-next-line
          this.$store.dispatch('trello/saveSimpleTask', _.assignIn(this.tempTask, {project_id: that.$route.params.id}));
          return;
        }
        // eslint-disable-next-line
        console.log('Oops!');
      });
    },
    clearErrors() {
      this.errors.clear();
    },
    changeDueDate: function() {
      if (!_.isNull(this.tempTask.due_date)) {
        this.$store.dispatch('trello/changeDueDate', {id: this.tempTask.id,
          due_date: this.tempTask.due_date});
      }
    }
  },
  components: {
    draggable,
    Editable,
    Comment,
    Labels
  },
  mounted() {
    var self = this;
    $('#modal-edit-task').on('hide.bs.modal', function () {
      self.$router.push({name: 'trello', params: {id: self.$route.params.id}});
      self.$store.dispatch('trello/closeEditTask');
    });
  }
}
</script>

<style lang="scss" scoped>
  .m-due-date{
    border-radius: 4px;
    padding: 1px;
    color: white;
    font-size: 15px;
  }
  .btn-save{
    margin-top: 6px;
  }
  .sub-label{
    margin-bottom: 22px;
    display: inline-block;
    margin-right: 8px;
  }
  .list-btn{
    margin-bottom: 4px;
    a{
      width: 92px;
      margin-bottom: 3px;
    }
  }
  .description{

  }
  .is-danger{
    display: block;
    color: red;
    font-weight: bold;
    font-size: 12px;
    clear: both;
  }
  .sm-avatar{
    width: 44px;
    height: 44px;
    border-radius: 50%;
  }
</style>
