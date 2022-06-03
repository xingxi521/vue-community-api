import Router from 'koa-router'
import AdminController from '@/api/AdminController'
import CommentController from '@/api/CommentController'
import ContentController from '@/api/ContentController'
import UserController from '@/api/UserController'
const router = new Router()
router.prefix('/admin')
// 获取评论列表
router.post('/getCommentList', AdminController.getCommentList)
// 修改评论
router.post('/updateComment', CommentController.updateComment)
// 删除评论
router.post('/deleteComment', CommentController.deleteComment)
// 获取文章列表
router.post('/list', ContentController.getContentList)
// 删除帖子
router.post('/delPost', ContentController.deletePost)
// 获取文章详情
router.get('/postDetails', ContentController.getPostDetails)
// 编辑帖子-后台
router.post('/editPostManage', ContentController.updatePostManage)
// 获取用户信息
router.get('/getUserInfo', UserController.getUserInfo)
// 获取用户列表
router.post('/getUserList', UserController.getUserList)
// 新增用户
router.post('/createUser', UserController.addUser)
// 删除用户
router.post('/deleteUser', UserController.deleteUser)
// 更新用户-后台
router.post('/updateUser', UserController.updateUser)
export default router
