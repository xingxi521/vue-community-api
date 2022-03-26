import Router from 'koa-router'
import CommentRecords from '@/api/CommentController'
const router = new Router()
router.prefix('/comment')
// 添加评论
router.post('/addComment', CommentRecords.addComment)
// 采纳为最佳评论
router.post('/setBestComment', CommentRecords.setBestComment)
// 点赞评论
router.post('/setNice', CommentRecords.setNice)
// 编辑评论
router.post('/updateComment', CommentRecords.updateComment)
// 删除评论
router.post('/deleteComment', CommentRecords.deleteComment)
// 获取未读消息
router.post('/getNoReadComment', CommentRecords.getNoReadComment)
// 标记为已读消息
router.get('/markCommentRead', CommentRecords.markCommentRead)
// 清空所有未读消息
router.get('/markAllComment', CommentRecords.markAllComment)
export default router
