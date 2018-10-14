import VueRouter from 'vue-router'
import Events from '@/components/Events'
import Camera from '@/components/Camera'
import Live from '@/components/Live'

const routes = [
  { path: '/', redirect: '/events' },
  { path: '/events', component: Events },
  { path: '/camera', component: Camera},
  { path: '/live', component: Live},
]

const router = new VueRouter({
  routes,
})

export default router