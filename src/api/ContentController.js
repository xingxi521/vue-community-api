import Post from '@/model/Post'
import Link from '@/model/Link'
import Users from '@/model/User'
import CollectRecords from '@/model/CollectRecords'
import config from '@/config/index'
import dayjs from 'dayjs'
import mkdir from 'make-dir'
import fs from 'fs'
import { v4 as uuidv4 } from 'uuid'
import { checkTrim, responseFail, responsePage, responseSuccess, checkCaptcha, getTokenInfo } from '@/common/utils'
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
      if (!checkTrim(body.isTop)) {
        params.isTop = body.isTop
      }
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
  // 发表新帖
  async createPost(ctx) {
    try {
      const { title, type, fav, content, captcha, uid } = ctx.request.body
      const checkPassCaptcha = await checkCaptcha(uid, captcha)
      if (checkPassCaptcha) {
        const tokenInfo = getTokenInfo(ctx)
        const userQuery = await Users.findById(tokenInfo.userId)
        if (userQuery.favs >= fav) {
          await Users.updateOne({ _id: tokenInfo.userId }, { $inc: { favs: -fav }})
          const addPost = new Post({
            title,
            type,
            fav,
            content,
            userInfo: tokenInfo.userId
          })
          addPost.save()
          responseSuccess(ctx, '发表新帖成功！')
        } else {
          responseFail(ctx, '您的积分不足，请重新调整输入悬赏积分！')
        }
      } else {
        responseFail(ctx, '您输入的验证码不正确，请重新输入！')
      }
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
  // 获取文章详情
  async getPostDetails(ctx) {
    try {
      const tid = ctx.request.query.tid
      if (!tid) {
        responseFail(ctx, '文章不存在，请重新查询！')
      } else {
        let res = await Post.getDetails(tid)
        if (res) {
          await Post.updateOne({ _id: tid }, { $inc: { read: 1 }})
          res = res.toJSON()
          const isLogin = ctx.headers.authorization
          if (isLogin) { // 如果用户是登录状态则需要查出哪些评论是用户点赞过的
            const tokenInfo = getTokenInfo(ctx)
            const hasCollect = await CollectRecords.findOne({ uid: tokenInfo.userId, tid })
            if (hasCollect) {
              res.isCollect = true
            } else {
              res.isCollect = false
            }
          }
          responseSuccess(ctx, '获取成功', res)
        } else {
          responseSuccess(ctx, '获取文章详情数据失败！')
        }
      }
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
  // 更细文章数据-前台
  async updatePost(ctx) {
    try {
      const { title, content, _id, captcha, uid } = ctx.request.body
      const checkPassCaptcha = await checkCaptcha(uid, captcha)
      if (checkPassCaptcha) {
        const tokenInfo = getTokenInfo(ctx)
        const postData = await Post.getDetails(_id)
        if (postData) {
          if (postData.userInfo.id === tokenInfo.userId) {
            await Post.updateOne({ _id }, { $set: { content, title }})
            responseSuccess(ctx, '更新帖子成功！')
          } else {
            responseFail(ctx, '您不是该帖的贴主，无权进行编辑！')
          }
        } else {
          responseFail(ctx, '文章不存在！')
        }
      } else {
        responseFail(ctx, '您输入的验证码不正确，请重新输入！')
      }
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
  // 更新文章数据-后台管理系统
  async updatePostManage(ctx) {
    try {
      const { title, content, _id, tags, fav, isTop, isEnd, type } = ctx.request.body
      const postData = await Post.getDetails(_id)
      if (postData) {
        await Post.updateOne({ _id }, { $set: { content, title, tags, fav, isTop, isEnd, type }})
        responseSuccess(ctx, '更新帖子成功！')
      } else {
        responseFail(ctx, '文章不存在！')
      }
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
  // 获取用户发表帖子数据
  async getSendPost(ctx) {
    try {
      const tokenInfo = getTokenInfo(ctx)
      const { pageSize, pageNum } = ctx.request.body
      const result = await Post.getListByUid(tokenInfo.userId, pageNum, pageSize)
      const total = await Post.countDocuments({ userInfo: tokenInfo.userId })
      responsePage(ctx, '获取用户发表帖子数据成功', result, pageNum, pageSize, total)
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
  // 获取用户发帖数据-（最近发帖记录）
  async getPostPublic(ctx) {
    try {
      const { uid } = ctx.request.body
      const result = await Post.getListByUid(uid, 1, 20)
      responseSuccess(ctx, '获取用户发表帖子数据成功', result)
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
  // 删除文章
  async deletePost(ctx) {
    try {
      const { tid } = ctx.request.body
      const postData = await Post.getDetails(tid)
      if (postData) {
        if (postData.isEnd !== 1) {
          await Post.deleteOne({ _id: tid })
          responseSuccess(ctx, '删除成功！')
        } else {
          responseFail(ctx, '该文章已结贴，无法删除！')
        }
      } else {
        responseFail(ctx, '文章不存在，删除失败！')
      }
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
  // 获取本周热议
  async getTopWeek(ctx) {
    try {
      const result = await Post.getTopWeek()
      responseSuccess(ctx, '获取本周热议成功', result)
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
}
export default new ContentController()
