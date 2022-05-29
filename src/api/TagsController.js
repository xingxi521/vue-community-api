import Tags from '@/model/Tags'
import { responseSuccess, responseFail, responsePage } from '@/common/utils'
import { errorLog4js } from '@/common/log4js'
class TagsController {
  // 获取标签分页数据
  async getTagList(ctx) {
    try {
      const body = ctx.request.body
      const records = await Tags.getList({}, 'createTime', body.pageNum, body.pageSize)
      const total = await Tags.countDocuments(body)
      responsePage(ctx, '获取标签分页数据成功', records, body.pageNum, body.pageSize, total)
    } catch (error) {
      errorLog4js(error.stack, ctx)
      responseFail(ctx, error.stack)
    }
  }
  // 新增/修改标签
  async addTag(ctx) {
    try {
      const { name, className, _id } = ctx.request.body
      if (!_id) { // 新增逻辑
        const TagsRecords = new Tags({
          name,
          className
        })
        TagsRecords.save()
        responseSuccess(ctx, '新增标签成功！')
      } else {
        const tagRecord = await Tags.findById(_id)
        if (tagRecord) {
          await Tags.updateOne({ _id }, { name, className })
          responseSuccess(ctx, '更新标签数据成功！')
        } else {
          responseFail(ctx, '标签数据不存在，更新失败！')
        }
      }
    } catch (error) {
      errorLog4js(error.stack, ctx)
      responseFail(ctx, error.stack)
    }
  }
  // 删除标签
  async deleteTag(ctx) {
    try {
      const { _id } = ctx.request.body
      const tagRecord = await Tags.findById(_id)
      if (tagRecord) {
        await Tags.deleteOne({ _id })
        responseSuccess(ctx, '删除标签成功！')
      } else {
        responseFail(ctx, '标签数据不存在，删除失败！')
      }
    } catch (error) {
      errorLog4js(error.stack, ctx)
      responseFail(ctx, error.stack)
    }
  }
}

export default new TagsController()
