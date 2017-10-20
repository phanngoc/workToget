export const LOAD_CHAT_MESSAGES = 'LOAD_CHAT_MESSAGES'
export const SOCKET_ADD_MESSAGE = 'SOCKET_ADD_MESSAGE'

import axios from 'axios'

const state = {
  chats: [],
}

// getters
const getters = {

}

const mutations = {
    [LOAD_CHAT_MESSAGES] (state, data) {
      state.chats = data;
    },
    [SOCKET_ADD_MESSAGE] (state, data) {
      state.chats.push(data.deltas);
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
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
