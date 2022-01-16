import { getValue } from '../config/RedisConfig'

// 校验验证码
const checkCaptcha = async (uid, captcha) => {
  const redisCaptcha = await getValue(uid)
  if (redisCaptcha) {
    if (redisCaptcha.toLocaleLowerCase() === captcha.toLocaleLowerCase()) {
      return true
    } else {
      return false
    }
  } else {
    return false
  }
}

// 成功响应
const responseSuccess = (ctx, msg = '', data = {}, code = 200) => {
  ctx.body = {
    code,
    data,
    msg
  }
}

// 失败响应
const responseFail = (ctx, msg = '', data = {}, code = 500) => {
  ctx.status = code
  ctx.body = {
    code,
    data,
    msg
  }
}

export {
  checkCaptcha,
  responseSuccess,
  responseFail
}
