import { authGuard, guestGuard } from './middleware'
import Vue from 'vue'

import ListProject from '../components/projects/ListProject.vue'
import Trello from '../components/projects/Trello.vue'
import Login from '../components/auth/Login.vue'
import Chat from '../components/chat/Chat.vue'

const router = [
    ...authGuard([
      { path: '/:id/projects', component: ListProject, name: 'listproject' },
      { path: '/projects/:id/trello', component: Trello, name: 'trello' },
      { path: '/projects/:id/chat', component: Chat, name: 'chat.index' },
    ]),
    ...guestGuard([
      { path: '/login', component: Login, name: 'login' },
    ])
]

export default router
