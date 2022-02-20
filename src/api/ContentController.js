import Post from '@/model/Post'
import Link from '@/model/Link'
import { checkTrim, responseFail, responsePage, responseSuccess } from '@/common/utils'
class ContentController {
  // 文章列表接口
  async getContentList(ctx) {
    try {
      const body = ctx.request.body
      const params = {}
      if (body.type !== 'index' && !checkTrim(body.type)) {
        params.type = body.type
      }
      if (!checkTrim(body.status)) {
        params.isEnd = body.status
      }
      if (!checkTrim(body.tags)) {
        params.tags = {
          $elemMatch: {
            title: body.tags
          }
        }
      }
      params.isTop = body.isTop
      const records = await Post.getList(params, body.sort || 'createTime', body.pageNum, body.pageSize)
      const total = await Post.countDocuments(params)
      responsePage(ctx, '获取文章分页数据成功', records, body.pageNum, body.pageSize, total)
    } catch (error) {
      console.log(error)
    }
  }
  // 获取温馨通道/友情链接
  async getLinkList(ctx) {
    try {
      const { type } = ctx.request.query
      if (!type) {
        responseFail(ctx, 'type参数未空！')
        return
      }
      const data = await Link.getLinkList(type)
      responseSuccess(ctx, '', data)
    } catch (error) {
      console.log(error)
    }
  }
}
export default new ContentController()
