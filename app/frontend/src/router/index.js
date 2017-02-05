import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router)
import Index from 'components/IndexPage'
import Show from 'components/ShowPage'
import Hello from 'components/Hello'

export default new Router({
  routes: [
    {
      path: '/hello',
      name: 'hello',
      component: Hello
    },
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/:id',
      name: 'show',
      component: Show
    }
  ]
})
