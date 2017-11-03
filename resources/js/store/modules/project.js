export const LOAD_PROJECT = 'LOAD_PROJECT'
export const SOCKET_ADD_MORE_USER = 'SOCKET_ADD_MORE_USER'
export const SOCKET_ACCEPT_INVITATION = 'SOCKET_ACCEPT_INVITATION'

import axios from 'axios'

const state = {
  project: {},
  users: [],
}

// getters
const getters = {

}

const mutations = {
    [LOAD_PROJECT] (state, data) {
      state.project = data;
      state.users = data.Users;
    },
    [SOCKET_ADD_MORE_USER] (state, data) {
      console.log(SOCKET_ADD_MORE_USER, data);
      _.forEach(data.deltas, function(value) {
        state.users.push(value);
      });
    },
    [SOCKET_ACCEPT_INVITATION] (state, data) {
      console.log(SOCKET_ACCEPT_INVITATION, data);
    }
};

const actions = {
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
