<template lang="html">
  <div class="modal fade" id="modal-edit-task">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <Editable name="title" className="modal-title" @update="tempTask.title = $event" :content="activeTask.title"></Editable>
          <span v-show="errors.has('title')" class="help is-danger">{{ errors.first('title') }}</span>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <Editable name="description" className="description" @update="tempTask.description = $event" :content="activeTask.description"></Editable>
          <span v-show="errors.has('description')" class="help is-danger">{{ errors.first('description') }}</span>
          <button type="button" class="btn btn-primary" @click="saveAndClose">Save</button>
          <hr>
          <div class="task-comments">
            <h4>Add Comment</h4>
            <div class="new-comment">
              <div class="member">
                <img :src="'/img/' + user.avatar" alt="" class="sm-avatar">
              </div>
              <div class="add-comment">
                <textarea name="comment" class="form-control" v-model="newComment" rows="5" cols="80">
                </textarea>
              </div>
            </div>
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
        'saveSimpleTask'
    ]),
    ...mapState('auth', [
        'user',
    ])
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
      this.tempTask = _.pick(val, ['id', 'title', 'description', 'frame_id']);
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
      newComment: ''
    }
  },
  methods: {
    saveAndClose: function() {
      this.validator.validateAll({
        title: this.tempTask.title,
        description: this.tempTask.description
      }).then((result) => {
        if (result) {
          // eslint-disable-next-line
          this.$store.dispatch('trello/saveSimpleTask', this.tempTask);
          return;
        }
        // eslint-disable-next-line
        console.log('Oops!');
      });
    },
    clearErrors() {
      this.errors.clear();
    }
  },
  components: {
    draggable,
    Editable
  },
  mounted() {
    var self = this;
    $('#modal-edit-task').on('hide.bs.modal', function () {
       self.$store.dispatch('trello/closeEditTask');
    });
  }
}
</script>

<style lang="scss" scoped>
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
