export const LOAD_CHAT_MESSAGES = 'LOAD_CHAT_MESSAGES'
export const SOCKET_ADD_MESSAGE = 'SOCKET_ADD_MESSAGE'
export const LOAD_MORE_MESSAGE = 'LOAD_MORE_MESSAGE'
export const SOCKET_DELETE_MESSAGE = 'SOCKET_DELETE_MESSAGE'

import axios from 'axios'

const state = {
  chats: [],
}

// getters
const getters = {

}

const mutations = {
    [LOAD_CHAT_MESSAGES] (state, data) {
      state.chats = _.reverse(data);
    },
    [SOCKET_ADD_MESSAGE] (state, data) {
      state.chats.push(data.deltas);
    },
    [LOAD_MORE_MESSAGE] (state, data) {
      _.forEach(data, function(val) {
          state.chats.unshift(val);
      });
    },
    [SOCKET_DELETE_MESSAGE] (state, data) {
      state.chats = _.filter(state.chats, function(c) {
          return c.id != data.deltas;
      });
    }
};

const actions = {
  check({ commit }) {
    commit(CHECK);
  },
  loadChatMessage({ commit, rootState }, data) {
    axios.get('/api/projects/' + rootState.route.params.id + '/messages').then(function(res) {
      if (res.status == 200) {
        commit(LOAD_CHAT_MESSAGES, res.data.data);
      }
    });
  },
  addMessage({ commit, rootState }, data) {
    axios.post('/api/projects/' + rootState.route.params.id + '/messages/create', {content: data.text, type: data.type}).then(function(res) {
      if (res.status == 200) {
        // commit(ADD_MESSAGE, res.data.data);
      }
    });
  },
  loadMoreMessage({ commit, rootState }, data) {
    axios.get('/api/projects/' + rootState.route.params.id + '/messages?createdAt=' + data.createdAt).then(function(res) {
      if (res.status == 200) {
        commit(LOAD_MORE_MESSAGE, res.data.data);
      }
    });
  },
  deleteChat({commit, rootState}, id) {
    axios.delete('/api/projects/' + rootState.route.params.id + '/messages/' + id + '/delete').then(function(res) {
      if (res.status == 200) {

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
