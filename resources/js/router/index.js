import { authGuard, guestGuard } from './middleware'
import Vue from 'vue'

import ListProject from '../components/trello/ListProject.vue'
import Trello from '../components/trello/Trello.vue'
import Login from '../components/auth/Login.vue'
import Chat from '../components/chat/Chat.vue'
import Calendar from '../components/calendar/Calendar.vue'
import ListCalendar from '../components/calendar/ListCalendar.vue'
import AddEvent from '../components/calendar/AddEvent.vue'
import EditEvent from '../components/calendar/EditEvent.vue'
import Overview from '../components/project/Overview.vue'
import TreeProject from '../components/project/TreeProject.vue'
import MainApp from '../components/MainApp.vue'
import Activity from '../components/project/Activity.vue'
import ShowEvent from '../components/calendar/ShowEvent.vue'
import HomePage from '../components/home/HomePage.vue'
import CreateProject from '../components/home/CreateProject.vue'

const router = [
    ...authGuard([
      {
        path: '/', component: MainApp,
        children: [
          { path: '/', component: HomePage, name: 'homepage' },
          { path: '/create_project', component: CreateProject, name: 'create_project' },
          { path: '/projects/:id', component: Overview, name: 'overview_project' },
          { path: '/projects/:id', component: TreeProject,
            children: [
              { path: 'trello', component: Trello,
                children: [
                    { path: '/', component: Trello, name: 'trello' },
                    { path: ':task_id/:title', component: Trello, name: 'trello.modal' },
                ]
              },
              { path: 'activity', component: Activity, name: 'activity' },
              { path: 'chat', component: Chat, name: 'chat.index' },
              { path: 'calendar',
                component: Calendar,
                children: [
                    { path: '/', component: ListCalendar, name: 'calendar.list_event' },
                    { path: 'add-event', component: AddEvent, name: 'calendar.add_event' },
                    { path: 'edit-event/:event_id', component: EditEvent, name: 'calendar.edit_event' },
                    { path: 'show-event/:event_id', component: ShowEvent, name: 'calendar.show_event' },
                ]
              },
            ]
          },
        ]
      }
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
