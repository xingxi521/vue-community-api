/**
 * 评论Controller层
 */
import CommentRecords from '@/model/CommentRecords'
import Post from '@/model/Post'
import User from '@/model/User'
import NiceRecords from '@/model/NiceRecords'
import { responseFail, responseSuccess, getTokenInfo, responsePage, getObjByAttr } from '@/common/utils'
class CommentController {
  constructor() {
    this.getCommentList = this.getCommentList.bind(this)
  }
  // 新增评论
  async addComment(ctx) {
    try {
      const tokenInfo = getTokenInfo(ctx)
      const { tid, content, cid, replyToCid } = ctx.request.body
      let commentRecords
      if (cid && !replyToCid) { // 用户是回复别人的评论而且是一级评论
        commentRecords = new CommentRecords({
          tid,
          content,
          uid: tokenInfo.userId,
          cid
        })
      } else if (cid && replyToCid) { // 用户回复的是别人回复别人的评论
        commentRecords = new CommentRecords({
          tid,
          content,
          uid: tokenInfo.userId,
          cid,
          replyToCid
        })
      } else {
        commentRecords = new CommentRecords({
          tid,
          content,
          uid: tokenInfo.userId
        })
      }
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
  // async getCommentList(ctx) {
  //   try {
  //     const { tid, pageNum, pageSize } = ctx.request.body
  //     let result = await CommentRecords.getCommentList(tid, pageNum, pageSize)
  //     const total = await CommentRecords.countDocuments({ tid })
  //     const isLogin = ctx.headers.authorization
  //     if (isLogin) { // 如果用户是登录状态则需要查出哪些评论是用户点赞过的
  //       // 将查询结果先做转换
  //       const tokenInfo = getTokenInfo(ctx)
  //       result = result.map(item => item.toJSON())
  //       for (let i = 0; i < result.length; i++) {
  //         result[i].isNice = false
  //         const hasNiceRecords = await NiceRecords.findOne({ cid: result[i]._id, uid: tokenInfo.userId })
  //         if (hasNiceRecords) {
  //           result[i].isNice = true
  //         }
  //       }
  //     }
  //     responsePage(ctx, '获取评论数据成功', result, pageNum, pageSize, total)
  //   } catch (error) {
  //     console.log(error)
  //     responseFail(ctx, error.stack)
  //   }
  // }
  async getCommentList(ctx) {
    try {
      const { tid, pageNum, pageSize } = ctx.request.body
      let result = await CommentRecords.getComment(tid, pageNum, pageSize)
      // 把结果处理成功children
      result = await this.resultToChildren(result)
      result.forEach(item => {
        item.children.forEach(child => {
          if (child.replyToCid) {
            child.replyToData = getObjByAttr(item.children, '_id', child.replyToCid, true)
          }
        })
      })
      const total = await CommentRecords.countDocuments({ tid, cid: null })
      responsePage(ctx, '获取评论数据成功', result, pageNum, pageSize, total)
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
  // 处理父级查询结果
  async resultToChildren(data) {
    const result = data.map(item => item.toJSON())
    for (let i = 0; i < result.length; i++) {
      let replyData = await CommentRecords.find({ cid: result[i]._id }).populate({ path: 'uid', select: 'nickName pic vip role status' })
      replyData = replyData.map(item => item.toJSON())
      result[i].children = replyData
    }
    return result
  }
  // 采纳为最佳评论
  async setBestComment(ctx) {
    try {
      const { tid, cid } = ctx.request.body
      const tokenInfo = getTokenInfo(ctx)
      const postData = await Post.findById(tid)
      if (postData) {
        if (tokenInfo.userId === postData.userInfo) {
          await CommentRecords.updateOne({ _id: cid }, { $set: { isBest: true }})
          const commentData = await CommentRecords.findById(cid)
          await User.updateOne({ _id: commentData.uid }, { $inc: { favs: postData.fav }})
          await Post.updateOne({ _id: tid }, { $set: { isEnd: 1 }})
          responseSuccess(ctx, '采纳最佳答案成功！', commentData)
        } else {
          responseFail(ctx, '您不是该帖的贴主，无法采纳为最佳答案！')
        }
      } else {
        responseFail(ctx, '文章数据获取异常！')
      }
      console.log(tokenInfo)
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
  // 点赞评论
  async setNice(ctx) {
    try {
      const { cid } = ctx.request.body
      const tokenInfo = getTokenInfo(ctx)
      const isNice = await NiceRecords.findOne({ cid, uid: tokenInfo.userId })
      if (isNice) {
        responseFail(ctx, '您已点赞过了，无需重复点赞！')
      } else {
        const newNiceRecords = new NiceRecords({
          cid,
          uid: tokenInfo.userId
        })
        const result = newNiceRecords.save()
        await CommentRecords.updateOne({ _id: cid }, { $inc: { niceCount: 1 }})
        responseSuccess(ctx, '点赞成功！', result)
      }
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
}
export default new CommentController()
