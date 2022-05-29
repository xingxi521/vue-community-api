import Router from 'koa-router'
import HomeController from '@/api/HomeController'
const router = new Router()
router.prefix('/home')
router.get('/getStatistics', HomeController.getStatistics)
export default router
