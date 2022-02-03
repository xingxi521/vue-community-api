// 公共路由管理
import Router from 'koa-router'
const router = new Router()
import PublicController from '../api/PublicController'
import ContentController from '../api/ContentController'
router.prefix('/public')
router.post('/getCaptcha', PublicController.getCaptcha)
router.post('/list', ContentController.getContentList)
router.get('/linkList', ContentController.getLinkList)
export default router
