import Vue from 'vue'
// import VueTouch from 'vue-touch'
import lang from 'element-ui/lib/locale/lang/ko'
import locale from 'element-ui/lib/locale'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import 'bootstrap/dist/css/bootstrap.css'
import Router from 'vue-router'
import 'font-awesome/css/font-awesome.css'

// import Index from 'components/IndexPage'
// import Show from 'components/ShowPage'
// import Hello from 'components/Hello'
// import TestComponent from 'components/TestComponentPage'
import restApi from 'components/restApiPage'
import webSocket from 'components/WebSocketPage'
import ajaxServer from 'components/AjaxServerPage'
import gameApi from 'components/GameApiPage'
import memberAuth from 'components/MemberAuthPage'
import main from 'components/MainPage'
import login from 'components/LoginPage'

Vue.use(Router)

// Vue.use(VueTouch)

Vue.use(ElementUI)

// configure language
locale.use(lang) // 지역에 따른 언어 작용 적용

// VueTouch.registerCustomEvent('doubletap', {
//   type: 'tap',
//   taps: 2
// })

export default new Router({
  routes: [
    {
      path: '/',
      name: 'main',
      component: main
    },
    {
      path: '/main',
      name: 'main',
      component: main
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/webSocket',
      name: 'webSocket',
      component: webSocket
    },
    {
      path: '/ajaxServer',
      name: 'ajaxServer',
      component: ajaxServer
    },
    {
      path: '/gameApi',
      name: 'gameApi',
      component: gameApi
    },
    {
      path: '/memberAuth',
      name: 'memberAuth',
      component: memberAuth
    },
    {
      path: '/restApi',
      name: 'restApi',
      component: restApi
    }
  ]
})
