import Vue from 'vue'
import VueRouter from 'vue-router'

import ListProject from '../components/projects/ListProject.vue'
import Trello from '../components/projects/Trello.vue'

const router = [

    { path: '/:id/projects', component: ListProject, name: 'listproject' },

    { path: '/projects/:id/trello', component: Trello, name: 'trello' },
]

Vue.use(VueRouter)

export default router
