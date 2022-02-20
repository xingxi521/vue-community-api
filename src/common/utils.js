import { getValue } from '@/config/RedisConfig'
import jsonwebtoken from 'jsonwebtoken'
import config from '@/config/index'
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

// 分页类接口的响应
const responsePage = (ctx, msg = '', data = [], pageNum, pageSize, total, code = 200) => {
  ctx.body = {
    code,
    data: {
      records: data,
      pageSize,
      pageNum,
      total
    },
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

// 分页参数处理
const pager = (pageNum, pageSize) => {
  pageNum *= 1
  pageSize *= 1
  const skipIndex = (pageNum - 1) * pageSize
  return {
    pageNum,
    pageSize,
    skipIndex
  }
}
/**
 * 检查是否为空
 * @param {String} value
 * @returns 空返回true否则返回false
 */
const checkTrim = (value) => {
  if (value === '' || value === undefined || value == null) {
    return true
  } else {
    return false
  }
}
/**
 * 解密token取出token数据
 * @param {String} token
 * @returns
 */
const getTokenInfo = (ctx) => {
  const token = ctx.headers.authorization.substr(7)
  return jsonwebtoken.verify(token, config.JWT_SECRET)
}
export {
  checkCaptcha,
  responseSuccess,
  responseFail,
  pager,
  checkTrim,
  responsePage,
  getTokenInfo
}
