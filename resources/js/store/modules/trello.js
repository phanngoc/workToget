export const OPEN_EDIT_TASK = 'OPEN_EDIT_TASK'
export const CLOSE_EDIT_TASK = 'CLOSE_EDIT_TASK'
export const SAVE_SIMPLE_TASK = 'SAVE_SIMPLE_TASK'
export const LOAD_FRAMES = 'LOAD_FRAMES'
export const UPDATE_FRAME_SORT = 'UPDATE_FRAME_SORT'
export const SAVE_SORT_FRAME = 'SAVE_SORT_FRAME'
export const SYNC_TASK_SORT = 'SYNC_TASK_SORT'
export const SAVE_SORT_TASK = 'SAVE_SORT_TASK'
export const SAVE_ADD_COMMENT = 'SAVE_ADD_COMMENT'
export const SAVE_LIST_COMMENT = 'SAVE_LIST_COMMENT'
export const SAVE_EDIT_COMMENT = 'SAVE_EDIT_COMMENT'
export const SAVE_DUE_DATE = 'SAVE_DUE_DATE'
export const LOAD_LABELS = 'LOAD_LABELS'
export const UPDATE_LABEL = 'UPDATE_LABEL'

export const ERROR = 'ERROR'
export const SOCKET_CONNECT = 'SOCKET_CONNECT'
export const SOCKET_UPDATE_MODELS = 'SOCKET_UPDATE_MODELS'

// import {ERROR} from '../mutation-types'

import qs from 'qs'
import axios from 'axios'
import _ from 'lodash'

const state = {
  isOpen: false,
  activeTask: {},
  comments: [],
  frames: [],
  labels: [],
  connect: false,
}

// getters
const getters = {
  getComments: (state) => state.comments
}

// actions
const actions = {
  chooseLabel({commit, state}, obj) {
    axios.put('/api/task/' + obj.id + '/update-label', {
      label_ids: obj.label_ids
    })
    .then(function (response) {
      if (response.status == 200) {

      }
    })
    .catch(function (error) {
        commit(ERROR, error);
    });
  },
  deleteLabel({commit, state}, label) {
    axios.delete('/api/labels/' + label.id + '/delete')
    .then(function (response) {
      if (response.status == 200) {
        commit(UPDATE_LABEL, response.data.data);
      }
    })
    .catch(function (error) {
        commit(ERROR, error);
    });
  },
  updateLabel({commit, state}, label) {
    axios.put('/api/labels/' + label.id + '/update', {
      name: label.name,
      color: label.color
    })
    .then(function (response) {
      if (response.status == 200) {
        commit(UPDATE_LABEL, response.data.data);
      }
    })
    .catch(function (error) {
        commit(ERROR, error);
    });
  },
  loadLabels({commit, state}, project_id) {
    axios.get('/api/projects/' + project_id + '/labels')
    .then(function (response) {
      if (response.status == 200) {
        commit(LOAD_LABELS, response.data.data);
      }
    })
    .catch(function (error) {
        commit(ERROR, error);
    });
  },
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
  getListComment({commit, state}, task_id) {
    axios.get('/api/task/'+task_id+'/comments', {})
    .then(function (response) {
      if (response.status==200) {
          commit(SAVE_LIST_COMMENT, response.data.data);
      }
    })
    .catch(function (error) {
      commit(ERROR, error);
    });
  },
  addComment ({commit, state}, obj) {
    axios.post('/api/task/'+obj.task_id+'/comment', {
      content: obj.content,
      user_id: obj.user_id})
    .then(function (response) {
      if (response.status==200) {
          commit(SAVE_ADD_COMMENT, response.data.data);
      }
    })
    .catch(function (error) {
      commit(ERROR, error);
    });
  },
  saveComment ({commit, state}, obj) {
    axios.put('/api/task/comment/' + obj.id, {
      content: obj.content,
    })
    .then(function (response) {
      if (response.status==200) {
          commit(SAVE_EDIT_COMMENT, response.data.data);
      }
    })
    .catch(function (error) {
      console.log('error ne', error);
      commit(ERROR, error);
    });
  },
  changeDueDate ({commit, state}, obj) {
    axios.put('/api/task/' + obj.id + '/update-due-date', {
      due_date: obj.due_date,
    })
    .then(function (response) {
      if (response.status==200) {
          commit(SAVE_DUE_DATE, response.data.data);
      }
    })
    .catch(function (error) {
      commit(ERROR, error);
    });
  }
}

const mutations = {
  [SOCKET_CONNECT]: (state) => {
      state.connect = true;
  },
  [SOCKET_UPDATE_MODELS] (state, data) {
    console.log('co vao emit method:', data);
  },
  [UPDATE_LABEL] (state, label) {
    var key = _.findKey(state.labels, function(o) { return o.id == label.id; });
    state.labels[key] = label;
    state.labels = Object.assign({}, state.labels);
  },
  [LOAD_LABELS] (state, data) {
    state.labels = data;
  },
  [SAVE_DUE_DATE] (state) {

  },
  [SAVE_EDIT_COMMENT] (state, obj) {
    var key = _.findKey(state.comments, function(o) { return o.id == obj.id; });
    state.comments[key] = obj;
    state.comments = Object.assign({}, state.comments);
  },
  [SAVE_ADD_COMMENT] (state, comment) {
    state.comments.unshift(comment);
  },
  [SAVE_LIST_COMMENT] (state, comments) {
    state.comments =  comments;
  },
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
