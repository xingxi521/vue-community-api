/**
 * 初始化超级管理账号
 */
import User from '@/model/User'
import config from '@/config/index'
import { setValue } from '@/config/RedisConfig'
export const initAdmin = async() => {
  const adminList = config.ADMIN_LIST
  const result = []
  for (const value of adminList) {
    const records = await User.findOne({ userName: value })
    if (records) {
      result.push(records._id + '')
    }
  }
  setValue('adminList', JSON.stringify(result))
}
