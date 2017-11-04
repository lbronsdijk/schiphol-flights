import Vue from 'vue'
import Router from 'vue-router'
import FlightOverview from '@/components/FlightOverview'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'departures',
      component: FlightOverview
    }
  ]
})
