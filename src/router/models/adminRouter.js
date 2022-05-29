import Router from 'koa-router'
import AdminController from '@/api/AdminController'
import CommentController from '@/api/CommentController'
const router = new Router()
router.prefix('/admin')
// 获取评论列表
router.post('/getCommentList', AdminController.getCommentList)
// 修改评论
router.post('/updateComment', CommentController.updateComment)
// 删除评论
router.post('/deleteComment', CommentController.deleteComment)
export default router
