import { authGuard, guestGuard } from './middleware'
import Vue from 'vue'

import ListProject from '../components/projects/ListProject.vue'
import Trello from '../components/projects/Trello.vue'
import Login from '../components/auth/Login.vue'
import Chat from '../components/chat/Chat.vue'
import Calendar from '../components/calendar/Calendar.vue'
import ListCalendar from '../components/calendar/ListCalendar.vue'
import AddEvent from '../components/calendar/AddEvent.vue'
import EditEvent from '../components/calendar/EditEvent.vue'
import Overview from '../components/projects/Overview.vue'
import TreeProject from '../components/TreeProject.vue'

const router = [
    ...authGuard([

      { path: '/projects/:id', component: Overview, name: 'overview_project' },
      { path: '/projects/:id', component: TreeProject,
        children: [
          { path: 'trello', component: Trello,
            children: [
                { path: '/', component: Trello, name: 'trello' },
                { path: ':task_id/:title', component: Trello, name: 'trello.modal' },
            ]
          },
          { path: 'chat', component: Chat, name: 'chat.index' },
          { path: 'calendar',
            component: Calendar,
            children: [
                { path: '/', component: ListCalendar, name: 'calendar.list_event' },
                { path: 'add-event', component: AddEvent, name: 'calendar.add_event' },
                { path: 'edit-event/:event_id', component: EditEvent, name: 'calendar.edit_event' },
            ]
          },
        ]
      },
      // { path: '/projects/:id/trello', component: Trello, name: 'trello' },
      // { path: '/projects/:id/chat', component: Chat, name: 'chat.index' },
      // { path: '/projects/:id/calendar',
      //   component: Calendar,
      //   children: [
      //       { path: '/', component: ListCalendar, name: 'calendar.list_event' },
      //       { path: 'add-event', component: AddEvent, name: 'calendar.add_event' },
      //       { path: 'edit-event/:event_id', component: EditEvent, name: 'calendar.edit_event' },
      //   ]
      // },
    ]),
    ...guestGuard([
      { path: '/login', component: Login, name: 'login' },
    ])
]

export default router
