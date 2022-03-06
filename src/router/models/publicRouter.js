// 公共路由管理-不校验token
import Router from 'koa-router'
const router = new Router()
import PublicController from '@/api/PublicController'
import ContentController from '@/api/ContentController'
import CommentController from '@/api/CommentController'
router.prefix('/public')
// 获取验证码
router.post('/getCaptcha', PublicController.getCaptcha)
// 获取文章列表
router.post('/list', ContentController.getContentList)
router.get('/linkList', ContentController.getLinkList)
// 重置密码
router.post('/reset', PublicController.reSetPassWord)
// 获取文章详情
router.get('/postDetails', ContentController.getPostDetails)
// 获取文章评论数据
router.post('/commentList', CommentController.getCommentList)
export default router
