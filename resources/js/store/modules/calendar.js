export const LOAD_EVENTS = 'LOAD_EVENTS'
export const LOAD_USERS = 'LOAD_USERS'
export const ADD_EVENT = 'ADD_EVENT'
export const SOCKET_ADD_EVENT = 'SOCKET_ADD_EVENT'
export const SOCKET_UPDATE_EVENT = 'SOCKET_UPDATE_EVENT'
export const SET_EDIT_EVENT = 'SET_EDIT_EVENT'
export const SET_CREATED_EVENT = 'SET_CREATED_EVENT'
export const SOCKET_ARCHIVE_EVENT = 'SOCKET_ARCHIVE_EVENT'

import axios from 'axios'

const state = {
  events: [],
  users: [],
  eventEdited: {},
  eventCreated: {}
}

// getters
const getters = {

}

const mutations = {
    [LOAD_EVENTS] (state, data) {
      _.forEach(data, function(value) {
        value.allDay = !!value.is_allday;
      });
      state.events = data;
    },
    [LOAD_USERS] (state, data) {
      state.users = data;
    },
    [SOCKET_ADD_EVENT] (state, data) {
      let deltas = data.deltas;
      deltas.allDay = !!deltas.is_allday;
      state.events.push(data.deltas);
    },
    [SOCKET_UPDATE_EVENT] (state, data) {
      let deltas = data.deltas;
      let eventEdited = _.find(state.events, function(o) { return o.id == deltas.id; });
      deltas.allDay = !!deltas.is_allday;
      _.assign(eventEdited, deltas);
    },
    [SOCKET_ARCHIVE_EVENT] (state, data) {
      let deltas = data.deltas;
      state.events = _.filter(state.events, function(e) {
        return e.id != deltas;
      });
    },
    [SET_EDIT_EVENT] (state, data) {
      state.eventEdited = data;
    },
    [SET_CREATED_EVENT] (state, data) {
      state.eventCreated = data;
    }
};

const actions = {
  archiveEvent({ commit, rootState }, data) {
    axios.delete('/api/projects/' + rootState.route.params.id + '/calendars/events/' + rootState.route.params.event_id + '/archive').then(function(res) {
      if (res.status == 200) {

      }
    });
  },
  setCreatedEvent({ commit, rootState }, data) {
    commit(SET_CREATED_EVENT, data);
  },
  setEditEvent({ commit, rootState }, data) {
    commit(SET_EDIT_EVENT, data);
  },
  loadUsers({ commit, rootState }, data) {
    axios.get('/api/projects/' + rootState.route.params.id + '/calendars/users').then(function(res) {
      if (res.status == 200) {
        commit(LOAD_USERS, res.data.data);
      }
    });
  },
  loadEvents({ commit, rootState }, data) {
    axios.get('/api/projects/' + rootState.route.params.id + '/calendars/events').then(function(res) {
      if (res.status == 200) {
        commit(LOAD_EVENTS, res.data.data);
      }
    });
  },
  createEvent({ commit, rootState }, data) {
    axios.post('/api/projects/' + rootState.route.params.id + '/calendars/events/create', data).then(function(res) {
      if (res.status == 200) {

      }
    });
  },
  updateEvent({ commit, rootState }, data) {
    axios.put('/api/projects/' + rootState.route.params.id + '/calendars/events/'+rootState.route.params.event_id+'/update', data).then(function(res) {
      if (res.status == 200) {

      }
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
