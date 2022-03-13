/**
 * 点赞信息model
 */
import mongoose from 'mongoose'
import dayjs from 'dayjs'
const NiceRecords = mongoose.Schema({
  cid: { type: String },
  uid: { type: String },
  createTime: { type: Date }
})
// 前置钩子处理创建时间
NiceRecords.pre('save', function(next) {
  this.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  next()
})
export default mongoose.model('niceRecords', NiceRecords, 'niceRecords')
