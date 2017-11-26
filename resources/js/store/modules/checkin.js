export const ADD_QUESTION = 'ADD_QUESTION'
export const LOAD_QUESTION = 'LOAD_QUESTION'
export const LOAD_QUESTION_EDITED = 'LOAD_QUESTION_EDITED'
export const LOAD_ANSWERS = 'LOAD_ANSWERS'
export const ADD_ANSWER = 'ADD_ANSWER'
export const ADD_ANSWER_EDITED = 'ADD_ANSWER_EDITED'

import axios from 'axios'
import _ from 'lodash'

const state = {
  questions: [],
  questionEdited: {},
  answers: [],
  answerEdited: {}
}

// getters
const getters = {

}

const mutations = {
    [ADD_ANSWER](state, data) {

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
      _.forEach(data, function(value) {
        state.answers.push(value);
      });
    },
    [ADD_ANSWER_EDITED](state, data) {
      state.answerEdited = data;
    }
};

const actions = {
  loadAnswerEdited({commit, state, rootState}, data) {
    let url = '/api/projects/'+rootState.route.params.id+'/checkin/'+rootState.route.params.question_id+'/answers/'+rootState.route.params.answer_id+'/edit';
    return axios.get(url).then(function(res) {
      if (res.status == 200) {
        commit(ADD_ANSWER_EDITED, res.data.data);
      }
    });
  },
  goEditAnswer({commit, state, rootState}, data) {
    commit(ADD_ANSWER_EDITED, data);
  },
  createAnswer({commit, state, rootState}, data) {
    return axios.post('/api/projects/'+rootState.route.params.id+'/checkin/'+rootState.route.params.question_id+'/create', data).then(function(res) {
      if (res.status == 200) {
        commit(ADD_ANSWER, res.data.data);
      }
    });
  },
  loadAnswers({commit, state, rootState}, page) {
    return axios.get('/api/projects/'+rootState.route.params.id+'/checkin/'+rootState.route.params.question_id+'/answers', {
      params: {
        page: page,
      }
    }).then(function(res) {
      if (res.status == 200) {
        commit(LOAD_ANSWERS, res.data.data);
      }
    });
  },
  loadQuestionEdited({commit, state, rootState}) {
    return axios.get('/api/projects/'+rootState.route.params.id+'/checkin/'+rootState.route.params.question_id).then(function(res) {
      if (res.status == 200) {
        commit(LOAD_QUESTION_EDITED, res.data.data);
      }
    });
  },
  createQuestion({commit, state, rootState}, data) {
    return axios.post('/api/projects/'+rootState.route.params.id+'/checkin/create', data).then(function(res) {
      if (res.status == 200) {
        commit(ADD_QUESTION, res.data.data);
      }
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
