export const LOAD_PROJECT = 'LOAD_PROJECT'
export const ADD_MORE_USER = 'ADD_MORE_USER'
export const ACCEPT_INVITATION = 'ACCEPT_INVITATION'
export const LOAD_INVITATION = 'LOAD_INVITATION'
export const SEND_WELCOME_NEW_MEMBER = 'SEND_WELCOME_NEW_MEMBER'
export const HIDE_WELCOME = 'HIDE_WELCOME'
export const RECEIVE_INVITATION = 'RECEIVE_INVITATION'

import axios from 'axios'

const state = {
  project: {},
  users: [],
  isInvita: false,
  isWecomeNewMem: {
    status: false,
    user: {}
  },
}

// getters
const getters = {

}

const mutations = {
    [LOAD_PROJECT] (state, data) {
      state.project = data;
      state.users = data.Users;
    },
    [ADD_MORE_USER] (state, data) {
      _.forEach(data.deltas, function(value) {
        state.users.push(value);
      });
    },
    [ACCEPT_INVITATION] (state, data) {
      state.isInvita = false;
    },
    [RECEIVE_INVITATION] (state, data) {
      state.isInvita = true;
    },
    [LOAD_INVITATION] (state, data) {
      state.isInvita = (data == 'guest');
    },
    [SEND_WELCOME_NEW_MEMBER] (state, user) {
      state.isWecomeNewMem.status = true;
      state.isWecomeNewMem.user = user;
    },
    [HIDE_WELCOME] (state) {
      state.isWecomeNewMem.status = false;
      state.isWecomeNewMem.user = {};
    }
};

const actions = {
  hideWelcome({commit}) {
    commit(HIDE_WELCOME);
  },
  socket_addMoreUser({commit, rootState}, data) {
    commit(ADD_MORE_USER, data.deltas);
    let users_ids = _.map(data.deltas, function(value) {
      return value.id;
    });
    if (users_ids.indexOf(rootState.auth.user.id) != -1) {
      commit(RECEIVE_INVITATION);
    }
  },
  socket_acceptInvitation({ commit, rootState }, data) {
    let user = data.deltas;
    if (user.id == rootState.auth.user.id) {
      commit(ACCEPT_INVITATION);
    } else {
      commit(SEND_WELCOME_NEW_MEMBER, user);
    }
  },
  acceptInvitation({ commit, rootState }, projectId) {
    axios.put('/api/projects/' + rootState.route.params.id + '/users/accept-join').then(function(res) {
      if (res.status == 200) {

      }
    });
  },
  loadInvitation({ commit, rootState }, projectId) {
    axios.get('/api/projects/' + rootState.route.params.id + '/load-invitation').then(function(res) {
      if (res.status == 200) {
        commit(LOAD_INVITATION, res.data.data);
      }
    });
  },
  loadProject({ commit }, projectId) {
    axios.get('/api/projects/' + projectId).then(function(res) {
      if (res.status == 200) {
        commit(LOAD_PROJECT, res.data.data);
      }
    });
  },
  addMorePeople({ commit, state, rootState }, data) {
    return new Promise((resolve, reject) => {
      axios.put('/api/projects/' + rootState.route.params.id +'/users/add-people', {
        user_ids: data
      })
      .then(function (response) {
        if (response.status==200) {
          resolve(response.data);
        }
      })
      .catch(function (error) {
        commit(ERROR, error);
        reject(error);
      });
    });
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
