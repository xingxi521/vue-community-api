import sendEmail from '@/config/MailerConfig'
import moment from 'dayjs'
import jwt from 'jsonwebtoken'
import config from '@/config/index'
import Users from '@/model/User'
import { checkCaptcha, responseSuccess, responseFail } from '@/common/utils'
class LoginController {
  // 忘记密码
  async forget(ctx) {
    try {
      const { userName, captcha } = ctx.request.body
      const res = await sendEmail({
        code: captcha,
        expire: moment().add('30', 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        email: userName,
        userName: 'CorderX'
      })
      ctx.body = {
        code: 200,
        data: res,
        msg: '发送邮件成功！'
      }
    } catch (error) {
      console.log(error)
    }
  }
  // 登录接口
  async login(ctx) {
    try {
      const { userName, passWord, captcha, uid } = ctx.request.body
      const checkPassCaptcha = await checkCaptcha(uid, captcha)
      if (checkPassCaptcha) {
        const query = await Users.findOne({ userName })
        if (query && query.passWord === passWord) {
          const token = jwt.sign({ userId: query._id }, config.JWT_SECRET, {
            expiresIn: '1d'
          })
          const userInfo = query.toJSON()
          const filterFiled = ['userName', 'passWord']
          filterFiled.forEach(item => {
            delete userInfo[item]
          })
          responseSuccess(ctx, '登录成功', {
            token,
            userInfo
          })
        } else {
          responseFail(ctx, '账号或密码错误，请重新输入！')
        }
      } else {
        responseFail(ctx, '验证码不正确，请重新输入！')
      }
    } catch (error) {
      console.log(error)
    }
  }
  // 注册接口
  async register(ctx) {
    try {
      const { userName, passWord, captcha, uid, nickName } = ctx.request.body
      const checkPassCaptcha = await checkCaptcha(uid, captcha)
      if (checkPassCaptcha) {
        const queryUserName = await Users.findOne({ userName })
        const queryNickName = await Users.findOne({ nickName })
        if (queryUserName && queryUserName.userName) {
          responseFail(ctx, `您需要注册的用户名：${userName}已被注册，请重新输入！`)
        } else if (queryNickName && queryNickName.userName) {
          responseFail(ctx, `您填写的昵称已被使用，请重新输入！`)
        } else {
          const addUsers = new Users({
            userName,
            passWord,
            nickName
          })
          addUsers.save()
          responseSuccess(ctx, `用户名：${userName}，注册成功，请牢记您的密码！`)
        }
      } else {
        responseFail(ctx, '验证码不正确，请重新输入！')
      }
    } catch (error) {
      console.log(error)
    }
  }
}
export default new LoginController()
