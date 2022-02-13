import SignRecords from '../model/SignRecords'
import Users from '../model/User'
import { getTokenInfo, responseSuccess, responseFail } from '../common/utils'
import dayjs from 'dayjs'
class UserController {
  // 用户签到接口
  async sign(ctx) {
    const tokenInfo = getTokenInfo(ctx)
    // 查询出最新一条的签到记录
    const signRecords = await SignRecords.findByUid(tokenInfo.userId)
    const user = await Users.findById(tokenInfo.userId)
    // 需要增加的积分数
    let favs = 0
    // 是否重置签到天数
    let reSetSign = false
    if (signRecords) {
      // 当前日期
      const nowDay = dayjs().format('YYYY-MM-DD')
      // 上一次签到日期
      const lastDay = dayjs(signRecords.createTime).format('YYYY-MM-DD')
      // 如果最新一条签到记录的创建日期等于当前日期则证明已经签到过
      if (nowDay === lastDay) {
        responseFail(ctx, '您今天已经签过到了，请明天再来！', {
          favs: user.favs,
          count: user.count
        })
        return
      } else {
        // 如果当前日期减一天等于上一次签到时间 则证明是连续签到
        if (dayjs().subtract(1, 'day').format('YYYY-MM-DD') === lastDay) {
          const count = user.count + 1
          if (count < 5) {
            favs = 5
          } else if (count >= 5 && count < 15) {
            favs = 10
          } else if (count >= 15 && count < 30) {
            favs = 10
          } else if (count >= 30 && count < 100) {
            favs = 20
          } else if (count >= 100 && count < 365) {
            favs = 30
          } else if (count >= 365) {
            favs = 50
          }
          await Users.updateOne({ _id: tokenInfo.userId }, { $inc: { favs, count: 1 }})
        } else {
          favs = 5
          reSetSign = true
          await Users.updateOne({ _id: tokenInfo.userId }, { $set: { count: 1 }, $inc: { favs }})
        }
      }
    } else { // 没签到记录，证明是第一次签到
      // 更新用户表里的连续签到次数和累加签到积分
      favs = 5
      reSetSign = true
      await Users.updateOne({ _id: tokenInfo.userId }, { $set: { count: 1 }, $inc: { favs }})
    }
    const addSignRecord = new SignRecords({
      uid: tokenInfo.userId,
      fav: favs
    })
    addSignRecord.save()
    responseSuccess(ctx, '签到成功', {
      favs: user.favs + favs,
      count: reSetSign ? 1 : user.count + 1
    })
  }
  // 获取今天是否已签到接口
  async getIsSign(ctx) {
    const tokenInfo = getTokenInfo(ctx)
    // 查询出最新一条的签到记录
    const signRecords = await SignRecords.findByUid(tokenInfo.userId)
    const user = await Users.findById(tokenInfo.userId)
    if (signRecords) {
      // 当前日期
      const nowDay = dayjs().format('YYYY-MM-DD')
      // 上一次签到日期
      const lastDay = dayjs(signRecords.createTime).format('YYYY-MM-DD')
      // 如果最新一条签到记录的创建日期等于当前日期则证明已经签到过
      if (nowDay === lastDay) {
        responseSuccess(ctx, '', {
          favs: user.favs,
          count: user.count,
          isSign: true
        })
      } else {
        responseSuccess(ctx, '', {
          favs: user.favs,
          count: user.count,
          isSign: false
        })
      }
    } else {
      responseSuccess(ctx, '', {
        favs: user.favs,
        count: user.count,
        isSign: false
      })
    }
  }
}
export default new UserController()
