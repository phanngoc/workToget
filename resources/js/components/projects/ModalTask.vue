<template lang="html">
  <div class="modal fade" id="modal-edit-task">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <Editable className="modal-title" :content="activeTask.title"></Editable>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <Editable className="description" :content="activeTask.description"></Editable>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary">Save</button>
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
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

export default {
  created() {

  },
  computed: {
    ...mapState('trello', [
        'isOpen',
        'activeTask'
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
  },
  updated: function () {
    this.$nextTick(function () {
      // Code that will run only after the
      // entire view has been re-rendered
    })
  },
  data: function() {
    return {

    }
  },
  methods: {

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


</style>
