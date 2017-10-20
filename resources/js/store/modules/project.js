export const LOAD_PROJECT = 'LOAD_PROJECT'
import axios from 'axios'

const state = {
  project: {},
}

// getters
const getters = {

}

const mutations = {
    [LOAD_PROJECT](state, data) {
        state.project=data;
    }
};

const actions = {
  loadProject({ commit }, projectId) {
    axios.get('/api/projects/' + projectId).then(function(res) {
      if (res.status == 200) {
        commit(LOAD_PROJECT, res.data.data);
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
