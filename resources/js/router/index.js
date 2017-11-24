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
import Checkin from '../components/checkin/Checkin.vue'
import AskQuestion from '../components/checkin/AskQuestion.vue'
import ListQuestion from '../components/checkin/ListQuestion.vue'
import CreateAnswer from '../components/checkin/CreateAnswer.vue'
import ShowQuestion from '../components/checkin/ShowQuestion.vue'

const router = [
  {
    path: '/', component: MainApp,
    children: [
      { path: '/login', component: Login, name: 'login' },
      { path: '/', component: HomePage, name: 'homepage' },
    ]
  },
  ...authGuard([
    {
      path: '/', component: MainApp,
      children: [
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
            { path: 'checkin',
              component: Checkin,
              children: [
                  { path: '/', component: ListQuestion, name: 'checkin.list_question' },
                  { path: 'new-question', component: AskQuestion, name: 'checkin.new_question' },
                  { path: 'show-question/:question_id', component: ShowQuestion, name: 'checkin.show_question' },
                  { path: 'edit-question/:question_id', component: AskQuestion, name: 'checkin.edit_question' },
                  { path: ':question_id/answers/new', component: CreateAnswer, name: 'checkin.new_answer' },
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
]

export default router
