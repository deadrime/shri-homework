import VueRouter from 'vue-router'
import Events from '@/components/Events'
import Camera from '@/components/Camera'

const routes = [
  { path: '/events', component: Events },
  { path: '/camera', component: Camera}
]

const router = new VueRouter({
  mode: 'history',
  routes,
})

export default router