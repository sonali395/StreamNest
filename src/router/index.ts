import DashboardView from '@/features/shows/views/DashboardView.vue'
import GenreView from '@/features/shows/views/GenreView.vue'
import SearchView from '@/features/shows/views/SearchView.vue'
import ShowDetailView from '@/features/shows/views/ShowDetailView.vue'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      component: DashboardView,
      meta: { title: 'Browse' },
    },
    {
      path: '/search',
      name: 'search',
      component: SearchView,
      meta: { title: 'Search' },
    },
    {
      path: '/show/:id',
      name: 'show-detail',
      component: ShowDetailView,
      props: true,
      meta: { title: 'Show' },
    },
    {
      path: '/genre/:genre',
      name: 'genre',
      component: GenreView,
      meta: { title: 'Genre' },
    },
  ],
  scrollBehavior() {
    return { top: 0 }
  },
})

router.afterEach((to) => {
  const base = 'StreamNest'
  const piece = to.meta.title as string | undefined
  document.title = piece ? `${piece} · ${base}` : base
})

export default router
