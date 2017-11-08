export const CHECK = 'CHECK'
export const LOGIN = 'LOGIN'
export const LOGOUT = 'LOGOUT'
export const SET_USER = 'SET_USER'
export const LOAD_USERS = 'LOAD_USERS'
export const LOAD_NOTIFICATION = 'LOAD_NOTIFICATION'
export const SOCKET_NOTIFICATION = 'SOCKET_NOTIFICATION'
export const CHECK_NOTIFICATION = 'CHECK_NOTIFICATION'
export const VISIT_NOTIFICATION = 'VISIT_NOTIFICATION'
export const LOAD_MORE_NOTIFICATION = 'LOAD_MORE_NOTIFICATION'

import axios from 'axios'

const state = {
  authenticated: false,
  access_token: {},
  user: {},
  users: [],
  notifications: []
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
    },

    [LOAD_NOTIFICATION] (state, data) {
      state.notifications = data;
    },

    [SOCKET_NOTIFICATION] (state, data) {
      state.notifications.unshift(data);
    },

    [CHECK_NOTIFICATION] (state, data) {
      state.notifications = data;
    },

    [VISIT_NOTIFICATION] (state, data) {
      let noti = JSON.parse(data[0]);
      let keyItem = _.findKey(state.notifications, function(o) {
        let notiTem = JSON.parse(o[0]);
        return notiTem.uuid == noti.uuid;
      });

      state.notifications[keyItem] = data;
    },

    [LOAD_MORE_NOTIFICATION] (state, data) {
      _.forEach(data, function(value) {
        state.notifications.push(value);
      });
    }
};

const actions = {
  loadMoreNotification({commit, state}) {
    let offset = state.notifications.length;
    return axios.get('/api/users/load-notification', {
      params: {
        offset: offset
      }
    }).then(function(res) {
      if (res.status == 200) {
        commit(LOAD_MORE_NOTIFICATION, res.data.data);
      }
      return res;
    });
  },
  visitNotification({commit, state}, data) {
    axios.post('/api/users/visit-notification', {data: data}).then(function(res) {
      if (res.status == 200) {
        commit(VISIT_NOTIFICATION, res.data.data);
      }
    });
  },
  checkNotification({commit, state}) {
    axios.post('/api/users/check-notification', {data: state.notifications}).then(function(res) {
      if (res.status == 200) {
        commit(CHECK_NOTIFICATION, res.data.data);
      }
    });
  },
  loadNotification({commit}, data) {
    axios.get('/api/users/load-notification').then(function(res) {
      if (res.status == 200) {
        commit(LOAD_NOTIFICATION, res.data.data);
      }
    });
  },
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
