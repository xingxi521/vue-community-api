import mongoose from 'mongoose'
import dayjs from 'dayjs'
const Roles = mongoose.Schema({
  name: { type: String, default: '' },
  code: { type: String, default: '' },
  desc: { type: String, default: '' },
  menus: { type: Array, default: [] },
  createTime: { type: String }
})
// 前置钩子处理创建时间
Roles.pre('save', function(next) {
  this.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  next()
})
export default mongoose.model('roles', Roles, 'roles')
