import mongoose from 'mongoose'
import dayjs from 'dayjs'
const signRecords = mongoose.Schema({
  uid: { type: String, ref: 'users' },
  fav: { type: Number },
  createTime: { type: Date }
})
// 前置钩子处理创建时间
signRecords.pre('save', function(next) {
  this.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  next()
})
signRecords.statics = {
  // 根据用户ID查出最近一条签到记录
  findByUid(uid) {
    return this.findOne({ uid }).sort({ createTime: -1 })
  }
}
export default mongoose.model('signRecords', signRecords, 'signRecords')
