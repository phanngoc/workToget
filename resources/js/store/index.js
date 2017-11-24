import Vue from 'vue'
import Vuex from 'vuex'
import trello from './modules/trello'
import auth from './modules/auth'
import project from './modules/project'
import chat from './modules/chat'
import calendar from './modules/calendar'
import activity from './modules/activity'
import checkin from './modules/checkin'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
    //Assign the modules to the store
    modules: {
        trello,
        auth,
        project,
        chat,
        calendar,
        activity,
        checkin
    },
    // #root state
    state: {
        loading: false,
    },
    // #root mutations
    mutations: {
        SET_LOADING(state, loading) {
            state.loading = loading
        },
    },
    // If strict mode should be enabled
    strict: debug,
});
