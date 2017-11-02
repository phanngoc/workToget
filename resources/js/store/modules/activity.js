export const LOAD_ACTIVITY = 'LOAD_ACTIVITY'
export const SYNC_ACTIVITY = 'SYNC_ACTIVITY'

import axios from 'axios'

const state = {
  activities: []
}

// getters
const getters = {

}

const mutations = {
  [SYNC_ACTIVITY] (state, data) {
    state.activities = data;
  }
};

const actions = {
  loadActivity({ commit, rootState }, data) {
    axios.get('/api/projects/' + rootState.route.params.id + '/activities').then(function(res) {
      if (res.status == 200) {
        commit(SYNC_ACTIVITY, res.data.data);
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
