import Router from 'koa-router'
import UserController from '@/api/UserController'
const router = new Router()
router.prefix('/user')
// 签到接口
router.get('/sign', UserController.sign)
// 获取今天是否已签到接口
router.get('/getIsSign', UserController.getIsSign)
export default router
