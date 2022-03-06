/**
 * 评论Controller层
 */
import CommentRecords from '@/model/CommentRecords'
import Post from '@/model/Post'
import { responseFail, responseSuccess, getTokenInfo, responsePage } from '@/common/utils'
class CommentController {
  // 新增评论
  async addComment(ctx) {
    try {
      const tokenInfo = getTokenInfo(ctx)
      const { tid, content } = ctx.request.body
      const commentRecords = new CommentRecords({
        tid,
        content,
        uid: tokenInfo.userId
      })
      commentRecords.save()
      // 评论数+1
      await Post.updateOne({ _id: tid }, { $inc: { answer: 1 }})
      responseSuccess(ctx, '添加评论成功', commentRecords)
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
  // 获取评论列表
  async getCommentList(ctx) {
    try {
      const { tid, pageNum, pageSize } = ctx.request.body
      const result = await CommentRecords.getCommentList(tid, pageNum, pageSize)
      const total = await CommentRecords.countDocuments({ tid })
      responsePage(ctx, '获取评论数据成功', result, pageNum, pageSize, total)
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
}
export default new CommentController()
