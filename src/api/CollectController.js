/**
 * 收藏Controller层
 */
import CollectRecords from '@/model/CollectRecords'
import { responseFail, responseSuccess, getTokenInfo, responsePage } from '@/common/utils'
class CollectController {
  // 收藏帖子
  async collectPost(ctx) {
    try {
      const tokenInfo = getTokenInfo(ctx)
      const { tid } = ctx.request.body
      const isCollect = await CollectRecords.findOne({ tid, uid: tokenInfo.userId })
      if (!isCollect) {
        const collectRecords = new CollectRecords({
          tid,
          uid: tokenInfo.userId
        })
        collectRecords.save()
        responseSuccess(ctx, '收藏文章成功！', collectRecords)
      } else {
        await CollectRecords.deleteOne({ _id: isCollect._id })
        responseSuccess(ctx, '取消收藏成功！')
      }
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
  // 获取收藏帖子
  async getCollectPost(ctx) {
    try {
      const tokenInfo = getTokenInfo(ctx)
      const { pageSize, pageNum } = ctx.request.body
      const result = await CollectRecords.getCollectList(tokenInfo.userId, pageNum, pageSize)
      const total = await CollectRecords.countDocuments({ uid: tokenInfo.userId })
      responsePage(ctx, '获取收藏帖子成功', result, pageNum, pageSize, total)
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
}
export default new CollectController()
