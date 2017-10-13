export const OPEN_EDIT_TASK = 'OPEN_EDIT_TASK'
export const CLOSE_EDIT_TASK = 'CLOSE_EDIT_TASK'
export const SAVE_SIMPLE_TASK = 'SAVE_SIMPLE_TASK'
export const LOAD_FRAMES = 'LOAD_FRAMES'
export const UPDATE_FRAME_SORT = 'UPDATE_FRAME_SORT'
export const SAVE_SORT_FRAME = 'SAVE_SORT_FRAME'
export const SYNC_TASK_SORT = 'SYNC_TASK_SORT'
export const SAVE_SORT_TASK = 'SAVE_SORT_TASK'

import {ERROR} from '../mutation-types'
import qs from 'qs'
import axios from 'axios'
import _ from 'lodash'

const state = {
  isOpen: false,
  activeTask: {},
  frames: []
}

// getters
const getters = {
  
}

// actions
const actions = {
  loadFrames({commit, state}, project_id) {
    axios.get('/api/projects/' + project_id + '/frames')
    .then(function (response) {
      if (response.status == 200) {
        commit(LOAD_FRAMES, response.data.frames);
      }
    })
    .catch(function (error) {
        commit(ERROR, error);
    });
  },
  openEditTask ({ commit, state }, task) {
    commit(OPEN_EDIT_TASK, task);
  },
  closeEditTask ({ commit, state }) {
    commit(CLOSE_EDIT_TASK);
  },
  saveSimpleTask ({ commit, state }, task) {
    axios.put('/api/task/' + task.id + '/update', {
      title: task.title,
      description: task.description
    })
    .then(function (response) {
      if (response.status==200) {
        commit(SAVE_SIMPLE_TASK, task);
      }
    })
    .catch(function (error) {
      commit(ERROR, error);
    });
  },
  updateFrameSort ({commit, state}, frames) {
    commit(UPDATE_FRAME_SORT, frames);
  },
  syncFrameSort ({commit, state}, obj) {
    axios.post('/api/projects/' + obj.project_id + '/update-sort-frame', {data: obj.data})
    .then(function (response) {
      if (response.status==200) {
        commit(SAVE_SORT_FRAME);
      }
    })
    .catch(function (error) {
      commit(ERROR, error);
    });
  },
  syncTaskSort ({commit, state}, obj) {
    commit(SYNC_TASK_SORT, obj);
    let data = _.map(obj.data, function(value, key) {
        return {id: value.id, order: key};
    });
    let frame_id = state.frames[obj.index].id;

    axios.post('/api/projects/update-sort-task', {frame_id: frame_id, data: data})
    .then(function (response) {
      if (response.status==200) {
          commit(SAVE_SORT_TASK);
      }
    })
    .catch(function (error) {
      commit(ERROR, error);
    });
  },
}

const mutations = {
  [OPEN_EDIT_TASK] (state, task) {
    state.isOpen = true;
    state.activeTask = task;
  },
  [CLOSE_EDIT_TASK] (state) {
    state.isOpen = false;
    state.activeTask = {};
  },
  [LOAD_FRAMES] (state, frames) {
    state.frames = frames;
  },
  [SAVE_SIMPLE_TASK] (state, task) {
    var frame = _.find(state.frames, function(o) { return o.id == task.frame_id; });
    var taskSet = _.find(frame.Tasks, function(o) { return o.id == task.id; });
    taskSet.title = task.title;
    taskSet.description = task.description;
    // console.log("SAVE_SIMPLE_TASK: ", task.title, task.description, taskSet);
  },
  [UPDATE_FRAME_SORT] (state, frames) {
    state.frames = frames;
  },
  [SYNC_TASK_SORT] (state, obj) {
    state.frames[obj.index].Tasks = obj.data;
  },
  [SAVE_SORT_TASK] (state) {

  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
