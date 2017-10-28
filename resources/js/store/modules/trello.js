export const OPEN_EDIT_TASK = 'OPEN_EDIT_TASK'
export const CLOSE_EDIT_TASK = 'CLOSE_EDIT_TASK'
// export const SAVE_SIMPLE_TASK = 'SAVE_SIMPLE_TASK'
export const LOAD_FRAMES = 'LOAD_FRAMES'
export const UPDATE_FRAME_SORT = 'UPDATE_FRAME_SORT'
export const SYNC_TASK_SORT = 'SYNC_TASK_SORT'
export const SAVE_SORT_TASK = 'SAVE_SORT_TASK'
export const SAVE_ADD_COMMENT = 'SAVE_ADD_COMMENT'
export const SAVE_LIST_COMMENT = 'SAVE_LIST_COMMENT'
export const SAVE_EDIT_COMMENT = 'SAVE_EDIT_COMMENT'
export const SAVE_DUE_DATE = 'SAVE_DUE_DATE'
export const LOAD_LABELS = 'LOAD_LABELS'
export const UPDATE_LABEL = 'UPDATE_LABEL'
export const ADD_FRAME = 'ADD_FRAME'
export const ARCHIVE_FRAME = 'ARCHIVE_FRAME'

export const ERROR = 'ERROR'

export const SOCKET_CONNECT = 'SOCKET_CONNECT'
export const SOCKET_SAVE_SIMPLE_TASK = 'SOCKET_SAVE_SIMPLE_TASK'
export const SOCKET_UPDATE_LABEL = 'SOCKET_UPDATE_LABEL'
export const SOCKET_UPDATE_LABEL_FOR_TASK = 'SOCKET_UPDATE_LABEL_FOR_TASK'
export const SOCKET_UPDATE_SORT_FRAME = 'SOCKET_UPDATE_SORT_FRAME'
export const SOCKET_UPDATE_SORT_TASK = 'SOCKET_UPDATE_SORT_TASK'
export const SOCKET_SAVE_ADD_COMMENT = 'SOCKET_SAVE_ADD_COMMENT'
export const SOCKET_SAVE_EDIT_COMMENT = 'SOCKET_SAVE_EDIT_COMMENT'
export const SOCKET_SAVE_DUE_DATE = 'SOCKET_SAVE_DUE_DATE'
export const SOCKET_SAVE_ADD_TASK = 'SOCKET_SAVE_ADD_TASK'
export const SOCKET_ADD_FRAME = 'SOCKET_ADD_FRAME'
export const SOCKET_UPDATE_FRAME = 'SOCKET_UPDATE_FRAME'
export const SOCKET_ARCHIVE_FRAME = 'SOCKET_ARCHIVE_FRAME'

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
  archiveFrame({commit, state, rootState}, id) {
    axios.delete('/api/projects/' + rootState.route.params.id + '/frames/' + id + '/delete')
    .then(function (response) {
      if (response.status == 200) {

      }
    })
    .catch(function (error) {
        commit(ERROR, error);
    });
  },
  updateFrame({commit, state, rootState}, data) {
    axios.put('/api/projects/' + rootState.route.params.id + '/frames/' + data.id + '/update', {
      name: data.name,
    })
    .then(function (response) {
      if (response.status == 200) {

      }
    })
    .catch(function (error) {
        commit(ERROR, error);
    });
  },
  addFrame({commit, state, rootState}, data) {
    axios.post('/api/projects/' + rootState.route.params.id + '/frames', {
      name: data.name,
    })
    .then(function (response) {
      if (response.status == 200) {

      }
    })
    .catch(function (error) {
        commit(ERROR, error);
    });
  },
  saveAddTask({commit, state, rootState}, obj) {
    axios.post('/api/projects/' + rootState.route.params.id + '/tasks', {
      title: obj.title,
      frame_id: obj.frame_id
    })
    .then(function (response) {
      if (response.status == 200) {

      }
    })
    .catch(function (error) {
        commit(ERROR, error);
    });
  },
  chooseLabel({commit, state, rootState}, obj) {
    axios.put('/api/projects/' + rootState.route.params.id + '/task/' + obj.id + '/update-label', {
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
    axios.put('/api/projects/' + label.project_id + '/labels/' + label.id + '/update', {
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
    return new Promise((resolve, reject) => {
      axios.get('/api/projects/' + project_id + '/labels')
      .then(function (response) {
        if (response.status == 200) {
          resolve(response.data.data);
          commit(LOAD_LABELS, response.data.data);
        }
      })
      .catch(function (error) {
        reject(error);
        commit(ERROR, error);
      });
    });
  },
  loadFrames({commit, state}, project_id) {
    return new Promise((resolve, reject) => {
      axios.get('/api/projects/' + project_id + '/frames')
      .then(function (response) {
        if (response.status == 200) {
          commit(LOAD_FRAMES, response.data.data.frames);
          resolve(response.data.data.frames);
        }
      })
      .catch(function (error) {
        reject(error);
        commit(ERROR, error);
      });
    });
  },
  openEditTask ({ commit, state }, data) {
    let taskS = data;
    let isFind = false;
    data = parseInt(data);
    if (!_.isNaN(data)) {
      _.forEach(state.frames, function(f) {
        if (isFind) return false;
        _.forEach(f.Tasks, function(task) {
          if (task.id == data) {
            taskS = task;
            isFind = true;
            return false;
          }
        });
      });
    }
    commit(OPEN_EDIT_TASK, taskS);
  },
  closeEditTask ({ commit, state }) {
    commit(CLOSE_EDIT_TASK);
  },
  saveSimpleTask ({ commit, state, rootState }, task) {
    axios.put('/api/task/' + task.id + '/update', {
      title: task.title,
      description: task.description,
      project_id: rootState.route.params.id
    })
    .then(function (response) {
      if (response.status==200) {

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

      }
    })
    .catch(function (error) {
      commit(ERROR, error);
    });
  },
  syncTaskSort ({commit, state, rootState}, obj) {
    commit(SYNC_TASK_SORT, obj);
    let data = _.map(obj.data, function(value, key) {
        return {id: value.id, order: key};
    });
    let frame_id = state.frames[obj.index].id;

    axios.post('/api/projects/' + rootState.route.params.id + '/update-sort-task', {frame_id: frame_id, data: data})
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
  addComment ({commit, state, rootState}, obj) {
    axios.post('/api/task/'+obj.task_id+'/comment', {
      content: obj.content,
      user_id: obj.user_id,
      project_id: rootState.route.params.id,
    })
    .then(function (response) {
      if (response.status==200) {
          // commit(SAVE_ADD_COMMENT, response.data.data);
      }
    })
    .catch(function (error) {
      commit(ERROR, error);
    });
  },
  saveComment ({commit, state, rootState}, obj) {
    axios.put('/api/task/comment/' + obj.id, {
      content: obj.content,
      project_id: rootState.route.params.id
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
  changeDueDate ({commit, state, rootState}, obj) {
    axios.put('/api/projects/'+rootState.route.params.id+'/task/' + obj.id + '/update-due-date', {
      due_date: obj.due_date,
    })
    .then(function (response) {
      if (response.status==200) {
          // commit(SAVE_DUE_DATE, response.data.data);
      }
    })
    .catch(function (error) {
      commit(ERROR, error);
    });
  }
}

const mutations = {
  [SOCKET_ARCHIVE_FRAME]: (state, data) => {
    let frameId = data.deltas;
    state.frames = _.filter(state.frames, function(o) { return o.id != frameId; });
  },
  [SOCKET_UPDATE_FRAME]: (state, data) => {
    let deltas = data.deltas;
    let frame = _.find(state.frames, function(o) { return o.id == deltas.id; });
    frame.name = deltas.name;
  },
  [SOCKET_ADD_FRAME]: (state, data) => {
    state.frames.push(data.deltas);
  },
  [SOCKET_SAVE_ADD_TASK]: (state, data) => {
    console.log(SOCKET_SAVE_ADD_TASK, data);
    var frame = _.find(state.frames, function(o) { return o.id == data.frameId; });
    frame.Tasks.unshift(data.deltas);
  },
  [SOCKET_CONNECT]: (state) => {
    state.connect = true;
  },
  [SOCKET_SAVE_DUE_DATE] (state, data) {
    let due_date = data.deltas;
    var frame = _.find(state.frames, function(o) { return o.id == data.frameId; });
    var taskSet = _.find(frame.Tasks, function(o) { return o.id == data.taskId; });
    taskSet.due_date = due_date;
    state.activeTask = Object.assign({}, taskSet);
  },
  [SOCKET_SAVE_ADD_COMMENT] (state, data) {
    let comment = data.deltas;
    state.comments.unshift(comment);
    var frame = _.find(state.frames, function(o) { return o.id == data.frameId; });
    var taskSet = _.find(frame.Tasks, function(o) { return o.id == data.taskId; });
    taskSet.countComment = data.countComment;
  },
  [SOCKET_SAVE_EDIT_COMMENT] (state, data) {
    let comment = data.deltas;
    var key = _.findKey(state.comments, function(o) { return o.id == comment.id; });
    state.comments.splice(key, 1, comment);
  },
  [SOCKET_UPDATE_SORT_TASK] (state, data) {
    let deltas = data.deltas;
    let frame = _.find(state.frames, function(o) { return o.id == data.frameId; });
    frame.Tasks = _.filter(frame.Tasks, function(o) {
      let isExTask = _.find(deltas, function(d) { return d.id == o.id; });
      return isExTask;
    });

    let diff = _.differenceWith(deltas, frame.Tasks, function(arrVal, oVal) {
      return arrVal.id == oVal.id;
    });

    if (!_.isEmpty(diff)) {
      let isFind = false;
      _.forEach(state.frames, function(f) {
        if (isFind) return false;
        _.forEach(f.Tasks, function(task) {
          if (task.id == diff[0].id) {
            frame.Tasks.push(task);
            isFind = true;
            return false;
          }
        });
      });
    }

    frame.Tasks = _.sortBy(frame.Tasks, [function(o) {
      let s = _.find(deltas, function(d) { return d.id == o.id; });
      return s.order;
    }]);
  },
  [SOCKET_SAVE_SIMPLE_TASK] (state, data) {
    let task = data.deltas;
    var frame = _.find(state.frames, function(o) { return o.id == data.frameId; });
    var taskSet = _.find(frame.Tasks, function(o) { return o.id == task.id; });
    taskSet.title = task.title;
    taskSet.description = task.description;

    state.activeTask = Object.assign({}, taskSet);
  },
  [SOCKET_UPDATE_LABEL] (state, data) {
    let labelD = data.deltas;
    _.forEach(state.frames, function(frame) {
      _.forEach(frame.Tasks, function(task) {
        _.forEach(task.Labels, function(label) {
          if (label.id == labelD.id) {
            label.name = labelD.name;
            label.color = labelD.color;
          }
        });
      });
    });
  },
  [SOCKET_UPDATE_LABEL_FOR_TASK] (state, data) {
    let labels = data.deltas;
    var frame = _.find(state.frames, function(o) { return o.id == data.frameId; });
    var taskSet = _.find(frame.Tasks, function(o) { return o.id == data.taskId; });
    console.log(SOCKET_UPDATE_LABEL_FOR_TASK, labels, taskSet);
    taskSet.Labels = labels;
    state.activeTask = Object.assign({}, taskSet);
  },
  [SOCKET_UPDATE_SORT_FRAME] (state, data) {
    let deltas = data.deltas;
    state.frames = _.sortBy(state.frames, [function(o) {
      let s = _.find(deltas, function(d) { return d.id == o.id; });
      return s.order;
    }]);
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
    // var key = _.findKey(state.comments, function(o) { return o.id == obj.id; });
    // state.comments[key] = obj;
    // state.comments = Object.assign({}, state.comments);
  },
  [SAVE_ADD_COMMENT] (state, comment) {
    state.comments.unshift(comment);
  },
  [SAVE_LIST_COMMENT] (state, comments) {
    state.comments = comments;
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
