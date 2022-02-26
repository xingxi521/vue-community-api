import svgCaptcha from 'svg-captcha'
import { setValue, getValue, delKey } from '@/config/RedisConfig'
import { responseSuccess, responseFail } from '@/common/utils'
import config from '@/config/index'
import jsonwebtoken from 'jsonwebtoken'
import Users from '@/model/User'
class PublicController {
  // 获取验证码
  async getCaptcha(ctx) {
    const { uid } = ctx.request.body
    const captcha = svgCaptcha.create({
      size: 4,
      ignoreChars: '0o1i',
      color: true,
      noise: Math.floor(Math.random() * 5)
    })
    setValue(uid, captcha.text, 5 * 60)
    ctx.body = captcha
  }
  // 重置密码
  async reSetPassWord(ctx) {
    try {
      const { uuid, newPassWord } = ctx.request.body
      if (uuid) {
        const payLoad = await getValue(uuid)
        if (payLoad) {
          // 根据uuid取出token，token里存了需要修改的用户ID
          const tokenInfo = jsonwebtoken.verify(payLoad, config.JWT_SECRET)
          await Users.updateOne({ _id: tokenInfo.userId }, { $set: { passWord: newPassWord }})
          responseSuccess(ctx, '您的密码已重置成功！')
          // 删掉redis里的uuid
          delKey(uuid)
        } else {
          responseFail(ctx, '(error:2)重置链接已超时或者异常，请重新发送邮件重置！')
        }
      } else {
        responseFail(ctx, '(error:1)重置链接异常，请重新发送邮件重置！')
      }
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.message)
    }
  }
}
export default new PublicController()
