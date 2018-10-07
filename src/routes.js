import VueRouter from 'vue-router'
import Events from '@/components/Events'
import Camera from '@/components/Camera'

const routes = [
  { path: '/', redirect: '/events' },
  { path: '/events', component: Events },
  { path: '/camera', component: Camera}
]

const router = new VueRouter({
  routes,
})

export default router