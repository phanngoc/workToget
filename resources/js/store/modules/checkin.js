export const ADD_QUESTION = 'ADD_QUESTION'
export const LOAD_QUESTION = 'LOAD_QUESTION'
export const LOAD_QUESTION_EDITED = 'LOAD_QUESTION_EDITED'
export const LOAD_ANSWERS = 'LOAD_ANSWERS'
export const ADD_ANSWER = 'ADD_ANSWER'
export const UPDATE_ANSWER = 'UPDATE_ANSWER'
export const LOAD_ANSWER_EDITED = 'LOAD_ANSWER_EDITED'
export const LOAD_MORE_COMMENT = 'LOAD_MORE_COMMENT'
export const ANSWER_ADD_COMMENT = 'ANSWER_ADD_COMMENT'
export const ANSWER_UPDATE_COMMENT = 'ANSWER_UPDATE_COMMENT'
export const ANSWER_DELETE_COMMENT = 'ANSWER_DELETE_COMMENT'
export const UPDATE_QUESTION = 'UPDATE_QUESTION'

import axios from 'axios'
import _ from 'lodash'
import moment from 'moment'

const state = {
  questions: [],
  questionEdited: {},
  answers: [],
  answerEdited: {},
  comments: []
}

// getters
const getters = {

}

const mutations = {
    [ADD_ANSWER](state, data) {
      let answerP = _.find(state.answers, function(val) {
        return moment(val.date).format('MM/DD/YYYY') == moment(data.date_created).format('MM/DD/YYYY');
      });
      if (!_.isUndefined(answerP)) {
        answerP.answers.unshift(data);
      } else {
        state.answers.unshift({answers: [data], date: data.date_created});
      }
    },

    [ADD_QUESTION](state, data) {
      state.questions.push(data);
    },

    [LOAD_QUESTION](state, data) {
      state.questions = data;
    },

    [LOAD_QUESTION_EDITED](state, data) {
      state.questionEdited = data;
    },

    [LOAD_ANSWERS](state, data) {
      if (data[1] == 1) {
        state.answers = [];
      }
      _.forEach(data[0], function(value) {
        state.answers.push(value);
      });
    },
    [LOAD_ANSWER_EDITED](state, data) {
      state.answerEdited = data;
    },
    [UPDATE_ANSWER](state, data) {

    },
    [ANSWER_ADD_COMMENT](state, comment) {
      state.comments.unshift(comment);
    },
    [ANSWER_UPDATE_COMMENT](state, comment) {
      var key = _.findKey(state.comments, function(o) { return o.id == comment.id; });
      state.comments.splice(key, 1, comment);
    },
    [ANSWER_DELETE_COMMENT](state, comment) {
      state.comments = _.filter(state.comments, function(o) { return o.id != comment.id; });
    },
    [LOAD_MORE_COMMENT](state, comments) {
      _.forEach(comments, function(value) {
        state.comments.push(value);
      });
    },
    [UPDATE_QUESTION](state, data) {
      var key = _.findKey(state.questions, function(o) { return o.id == data.id; });
      state.questions.splice(key, 1, data);
    }
};

const actions = {
  updateQuestion({commit, state, rootState}, data) {
    console.log('update question', data);
    return axios.put('/api/projects/'+rootState.route.params.id+'/checkin/'+data.id, data).then(function(res) {
      if (res.status == 200) {
        commit(UPDATE_QUESTION, res.data.data);
        return Promise.resolve(res.data.data);
      }
    });
  },
  loadComments({commit, state, rootState}, page) {
    axios.get('/api/projects/'+rootState.route.params.id+'/checkin/'+rootState.route.params.question_id+'/answers/' + rootState.route.params.answer_id + '/comments', {
      params: {
        page: page
      }
    })
    .then(function (response) {
      if (response.status==200) {
        commit(LOAD_MORE_COMMENT, response.data.data);
      }
    })
    .catch(function (error) {
      console.log('error', error);
      commit(ERROR, error);
    });
  },
  addComment({commit, state, rootState}, obj) {
    axios.post('/api/projects/'+rootState.route.params.id+'/checkin/'+rootState.route.params.question_id+'/answers/' + rootState.route.params.answer_id + '/comments', {
      content: obj.content,
    })
    .then(function (response) {
      if (response.status==200) {
        commit(ANSWER_ADD_COMMENT, response.data.data);
      }
    })
    .catch(function (error) {
      commit(ERROR, error);
    });
  },
  saveComment({commit, state, rootState}, obj) {
    axios.put('/api/projects/'+rootState.route.params.id+'/checkin/'+rootState.route.params.question_id+'/answers/'+rootState.route.params.answer_id+'/comments/'+obj.id, {
      content: obj.content,
      id: obj.id
    })
    .then(function (response) {
      if (response.status==200) {
        commit(ANSWER_UPDATE_COMMENT, response.data.data);
      }
    })
    .catch(function (error) {
      commit(ERROR, error);
    });
  },
  deleteComment({commit, state, rootState}, data) {
    let url = '/api/projects/'+rootState.route.params.id+'/checkin/'+rootState.route.params.question_id+'/answers/'+rootState.route.params.answer_id+'/comments/'+data.id;
    axios.delete(url)
    .then(function (response) {
      if (response.status==200) {
        commit(ANSWER_DELETE_COMMENT, response.data.data);
      }
    })
    .catch(function (error) {
      console.log('err', error);
      commit(ERROR, error);
    });
  },
  updateAnswer({commit, state, rootState}, data) {
    return axios.put('/api/projects/'+rootState.route.params.id+'/checkin/'+rootState.route.params.question_id+'/answers/'+rootState.route.params.answer_id, data).then(function(res) {
      if (res.status == 200) {
        commit(UPDATE_ANSWER, res.data.data);
      }
    });
  },
  loadAnswerEdited({commit, state, rootState}, params) {
    let url = '/api/projects/'+params.id+'/checkin/'+params.question_id+'/answers/'+params.answer_id;
    return axios.get(url).then(function(res) {
      if (res.status == 200) {
        commit(LOAD_ANSWER_EDITED, res.data.data);
        return Promise.resolve(res.data.data);
      }
    });
  },
  goEditAnswer({commit, state, rootState}, data) {
    commit(LOAD_ANSWER_EDITED, data);
  },
  createAnswer({commit, state, rootState}, data) {
    return axios.post('/api/projects/'+rootState.route.params.id+'/checkin/'+rootState.route.params.question_id+'/create', data).then(function(res) {
      if (res.status == 200) {
        commit(ADD_ANSWER, res.data.data);
      }
      return Promise.resolve (res.data.data);
    });
  },
  loadAnswers({commit, state, rootState}, page) {
    return axios.get('/api/projects/'+rootState.route.params.id+'/checkin/'+rootState.route.params.question_id+'/answers', {
      params: {
        page: page,
      }
    }).then(function(res) {
      if (res.status == 200) {
        commit(LOAD_ANSWERS, [res.data.data, page]);
      }
    });
  },
  loadQuestionEdited({commit, state, rootState}, params) {
    return axios.get('/api/projects/'+params.id+'/checkin/'+params.question_id).then(function(res) {
      if (res.status == 200) {
        commit(LOAD_QUESTION_EDITED, res.data.data);
        return Promise.resolve(res.data.data);
      }
    });
  },
  createQuestion({commit, state, rootState}, data) {
    return axios.post('/api/projects/'+rootState.route.params.id+'/checkin/create', data).then(function(res) {
      if (res.status == 200) {
        commit(ADD_QUESTION, res.data.data);
        return Promise.resolve(res.data.data);
      }
    }).catch((err) => {
      return Promise.reject(err);
    });
  },
  loadCheckin({commit, state, rootState}) {
    return axios.get('/api/projects/'+rootState.route.params.id+'/checkin').then(function(res) {
      if (res.status == 200) {
        commit(LOAD_QUESTION, res.data.data);
      }
    });
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
