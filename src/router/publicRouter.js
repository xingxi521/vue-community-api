// 公共路由管理
import Router from 'koa-router'
const router = new Router()
import PublicController from '../api/PublicController'
router.prefix('/public')
router.post('/getCaptcha', PublicController.getCaptcha)
export default router
