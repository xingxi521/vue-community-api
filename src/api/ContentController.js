import Post from '@/model/Post'
import Link from '@/model/Link'
import { checkTrim, responseFail, responsePage, responseSuccess } from '@/common/utils'
import config from '@/config/index'
import dayjs from 'dayjs'
import { v4 as uuidv4 } from 'uuid'
import mkdir from 'make-dir'
import fs from 'fs'
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
      responseFail(ctx, error.stack)
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
      responseFail(ctx, error.stack)
    }
  }
  // 上传文件
  async uploadFile(ctx) {
    try {
      // 取出传过来的文件类型数据
      const file = ctx.request.files.file
      // 取出文件类型
      const ext = file.name.split('.').pop()
      const saveFileName = uuidv4() + '.' + ext
      // 文件存放路径
      const saveDir = `${config.UPLOAD_PATH}/${dayjs().format('YYYYMMDD')}`
      const destPath = dayjs().format('YYYYMMDD')
      await mkdir(saveDir)
      // 读取传过来的文件流
      const readFile = fs.createReadStream(file.path)
      // 把文件流写入到对应路径的文件去
      const writeFile = fs.createWriteStream(`${saveDir}/${saveFileName}`)
      readFile.pipe(writeFile)
      responseSuccess(ctx, '上传成功', {
        pic: `${destPath}/${saveFileName}`
      })
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
}
export default new ContentController()
