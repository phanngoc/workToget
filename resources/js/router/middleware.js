import Vue from 'vue'
import Router from 'vue-router'


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

    // router.beforeEach((to, from, next) => {
    //     const components = router.getMatchedComponents(to)
    //     const access_token = localStorage.getItem('access_token')

    //     if (components.length) {
    //         setTimeout(() => {
    //             router.app.setLayout(components[components.length - 1].layout || '')
    //         }, 0);
    //     }

    //     //check access token exists within Api local storage
    //     if (!store.state.auth.user.id && access_token) {
    //         store.dispatch('auth/check')
    //             // get info user
    //         get(getUser).then((res) => {
    //             store.dispatch('auth/setUser', res.data)
    //             next()
    //         })
    //         .catch((err) => {
    //             store.dispatch('auth/logout')
    //             next({ name: 'login' })
    //         })
    //     } else {
    //         next()
    //     }
    // })

    return router
}

/**
 * Add the "authenticated" guard.
 *
 * @param  {Array} routes
 * @return {Array}
 */
export function authGuard(routes) {
    return guard(routes, (to, from, next) => {
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
