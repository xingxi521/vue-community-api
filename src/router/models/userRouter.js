import Router from 'koa-router'
import UserController from '@/api/UserController'
const router = new Router()
router.prefix('/user')
// 签到接口
router.get('/sign', UserController.sign)
// 获取今天是否已签到接口
router.get('/getIsSign', UserController.getIsSign)

// 更新用户信息
router.post('/updateInfo', UserController.updateUserInfo)
// 获取用户信息
router.get('/getUserInfo', UserController.getUserInfo)
// 修改密码
router.post('/updatePassWord', UserController.updatePassWord)
export default router
