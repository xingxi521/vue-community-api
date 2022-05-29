import CommentRecords from '@/model/CommentRecords'
import { responseFail, responsePage, getObjByAttr } from '@/common/utils'
import { errorLog4js } from '@/common/log4js'
class AdminController {
  constructor() {
    this.getCommentList = this.getCommentList.bind(this)
  }
  // 获取所有评论列表
  async getCommentList(ctx) {
    try {
      const { pageNum, pageSize } = ctx.request.body
      let result = await CommentRecords.getCommentAll(pageNum, pageSize)
      // 把结果处理成功children
      result = await this.resultToChildren(result)
      // 处理回复评论里的评论数据
      result.forEach(item => {
        item.childrens.forEach(child => {
          if (child.replyToCid) {
            child.replyToData = getObjByAttr(item.childrens, '_id', child.replyToCid, true)
          }
        })
      })
      const total = await CommentRecords.countDocuments({ cid: null })
      responsePage(ctx, '获取所有评论成功', result, pageNum, pageSize, total)
    } catch (error) {
      errorLog4js(error.stack, ctx)
      responseFail(ctx, error.stack)
    }
  }
  // 处理父级查询结果
  async resultToChildren(data) {
    const result = data.map(item => item.toJSON())
    for (let i = 0; i < result.length; i++) {
      let replyData = await CommentRecords.find({ cid: result[i]._id }).populate({ path: 'uid', select: 'nickName pic vip role status' })
      replyData = replyData.map(item => item.toJSON())
      result[i].childrens = replyData
    }
    return result
  }
}
export default new AdminController()
