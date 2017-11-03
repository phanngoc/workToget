export const CHECK = 'CHECK'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const SET_USER = 'SET_USER'
export const LOAD_USERS = 'LOAD_USERS'

import axios from 'axios'

const state = {
  authenticated: false,
  access_token: {},
  user: {},
  users: []
}

// getters
const getters = {

}

const mutations = {
    [CHECK](state) {
      state.authenticated = !!localStorage.getItem('access_token');
      axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`
    },

    [LOGIN](state, data) {
      const token = data.access_token
      state.authenticated = true
      state.user = data.user
      localStorage.setItem('access_token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    },

    [LOGOUT](state) {
      state.authenticated = false
      state.user = ''
      localStorage.removeItem('access_token')
      axios.defaults.headers.common['Authorization']
    },

    [SET_USER](state, user) {
      state.user = user
    },

    [LOAD_USERS](state, users) {
      state.users = users;
    }
};

const actions = {
  check({ commit }) {
    commit(CHECK);
  },
  login({ commit }, data) {
    axios.post('/authenticate', data).then(function(res) {
      if (res.status == 200) {
        commit(LOGIN, res.data.data);
      }
    });
  },
  logout({ commit }) {
    commit(LOGOUT);
  },
  setUser({ commit }, user) {
    commit(SET_USER, user);
  },
  loadUsers({commit}) {
    axios.get('/api/users/load').then(function(res) {
      if (res.status == 200) {
        commit(LOAD_USERS, res.data.data);
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
