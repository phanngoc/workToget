export const OPEN_EDIT_TASK = 'OPEN_EDIT_TASK'
export const CLOSE_EDIT_TASK = 'CLOSE_EDIT_TASK'

const state = {
  isOpen: false,
  activeTask: {}
}

// getters
const getters = {
  isOpenModal: state => state.isOpen
}

// actions
const actions = {
  openEditTask ({ commit, state }, task) {
    commit(OPEN_EDIT_TASK, task);
  },
  closeEditTask ({ commit, state }) {
    commit(CLOSE_EDIT_TASK);
  }
}

const mutations = {
  [OPEN_EDIT_TASK] (state, task) {
    state.isOpen = true;
    state.activeTask = task;
  },
  [CLOSE_EDIT_TASK] (state) {
    state.isOpen = false;
    state.activeTask = {};
  },
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
