import Router from 'koa-router'
import UserController from '@/api/UserController'
import ContentController from '@/api/ContentController'
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
// 获取用户发表过的帖子数据
router.post('/getSendPost', ContentController.getSendPost)
// 获取用户列表
router.post('/getUserList', UserController.getUserList)
// 新增用户
router.post('/createUser', UserController.addUser)
// 删除用户
router.post('/deleteUser', UserController.deleteUser)
// 更新用户-后台
router.post('/updateUser', UserController.updateUser)
export default router
