import Router from 'koa-router'
import CommentRecords from '@/api/CommentController'
const router = new Router()
router.prefix('/comment')
// 添加评论
router.post('/addComment', CommentRecords.addComment)
export default router
