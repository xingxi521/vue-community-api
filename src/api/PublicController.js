import svgCaptcha from 'svg-captcha'
import { setValue } from '@/config/RedisConfig'
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
}
export default new PublicController()
