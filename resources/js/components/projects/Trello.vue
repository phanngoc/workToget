<template lang="html">
  <div class="trello row">
    <draggable v-model="frames" @end="onEndFrame">
      <div v-for="frame in frames" class="frame" :key="frame.id">
        <p class="name-frame">{{frame.name}}</p>
        <draggable v-model="frame.Tasks" class="dragArea" :options="{group:'people'}">
            <Task v-for="task in frame.Tasks" :task="task" :key="task.id"
            ></Task>
        </draggable>
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
import { mapGetters, mapActions, mapState } from 'vuex';

export default {
  created() {

  },
  data: () => {
    return {
      frames: [],
    }
  },
  computed: {
    ...mapState('trello', [
        'isOpen',
        'activeTask'
    ])
  },

  methods: {
    ...mapActions('trello', [
        'openEditTask',
        'closeEditTask'
    ]),
    onEndFrame: function(evt) {
      console.log(evt.item);
    },
  },
  components: {
    draggable,
    Task,
    ModalTask
  },
  mounted() {
    var self = this;
    axios.get(this.baseUrl + '/api/projects/' + this.$route.params.id + '/frames')
      .then(function (response) {
        if (response.status == 200) {
          self.frames = response.data.frames;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
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
