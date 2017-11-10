import Vue from 'vue'
import Router from 'vue-router'
import axios from 'axios'
import store from '../store'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/**
 * Create a router instance.
 *
 * @param  {Array} routes
 * @return {Router}
 */
export default function router(routes) {
    const router = new Router({
        routes,
        scrollBehavior,
        mode: 'history'
    })

    router.beforeEach((to, from, next) => {
        const components = router.getMatchedComponents(to)
        const access_token = localStorage.getItem('access_token')
        console.log('before check:', access_token, to);
        //check access token exists within Api local storage
        if (!store.state.auth.authenticated && access_token) {
            store.dispatch('auth/check')
                // get info user
            axios.get('/api/user').then((res) => {
              if (res.status == 200) {
                store.dispatch('auth/setUser', res.data.data.user)
                next()
              }
            })
            .catch((err) => {
                store.dispatch('auth/logout')
                next({ name: 'login' })
            })
        } else {
            next()
        }
    })

    return router
}

/**
 * Add the "authenticated" guard.
 *
 * @param  {Array} routes
 * @return {Array}
 */
export function authGuard(routes) {
  console.log('co auth guard:');
  return guard(routes, (to, from, next) => {
    console.log('co vao guide ne', store.state.auth.authenticated);
    if (store.state.auth.authenticated) {
      next()
    } else {
      next('/login')
    }
  })
}

/**
 * Add the "guest" guard.
 *
 * @param  {Array} routes
 * @return {Array}
 */
export function guestGuard(routes) {
    return guard(routes, (to, from, next) => {
        if (store.state.auth.authenticated) {
            next('/')
        } else {
            next()
        }
    })
}

/**
 * @param  {Array} routes
 * @param  {Function} guard
 * @return {Array}
 */
function guard(routes, guard) {
    routes.forEach(route => {
        route.beforeEnter = guard
    })

    return routes
}

/**
 * @param  {Route} to
 * @param  {Route} from
 * @param  {Object|undefined} savedPosition
 * @return {Object}
 */
function scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
        return savedPosition
    }

    const position = {}

    if (to.hash) {
        position.selector = to.hash
    }

    if (to.matched.some(m => m.meta.scrollToTop)) {
        position.x = 0
        position.y = 0
    }

    return position
}
