import { getValue } from '@/config/RedisConfig'
import jsonwebtoken from 'jsonwebtoken'
import config from '@/config/index'
import mongoose from 'mongoose'
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
// 将ObjectID转字符串
const objectIdToStirng = (str) => {
  if (!str) return ''
  return mongoose.Types.ObjectId(str).toString()
}
// 将字符串转ObjectID
const stringToObjectId = (id) => {
  if (!id) return ''
  return mongoose.Types.ObjectId(id)
}
// 从数组对象里根据key取出匹配的对象
const getObjByAttr = (lst, originKey, originVal, isString) => {
  if (!Array.isArray(lst)) {
    return null
  }
  var result = null
  for (const value of lst) {
    if ((isString ? objectIdToStirng(value[originKey]) : value[originKey]) === originVal) {
      result = value
      break
    }
  }
  return result
}
// 数组对象里根据key和value匹配取出指定key值
const getAttrByAttr = (lst, originKey, originVal, targetKey, defaultValue) => {
  if (!Array.isArray(lst)) {
    return ''
  }
  var result = '未知' + originKey + ':' + originVal
  if (defaultValue !== undefined) {
    result = defaultValue
  }
  for (const value of lst) {
    if (value[originKey] === originVal) {
      result = value[targetKey]
      break
    }
  }
  return result
}
export {
  checkCaptcha,
  responseSuccess,
  responseFail,
  pager,
  checkTrim,
  responsePage,
  getTokenInfo,
  objectIdToStirng,
  getObjByAttr,
  getAttrByAttr,
  stringToObjectId
}
