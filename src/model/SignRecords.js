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
  },
  // 查询最新签到
  getNewComment() {
    return this.find()
      .sort({ createTime: -1 })
      .limit(20)
      .populate({
        path: 'uid',
        select: 'nickName pic'
      })
  },
  // 查询今日最快签到
  getFaskComment() {
    return this.find({ createTime: { $gte: new Date(dayjs().format('YYYY-MM-DD 00:00:00')) }})
      .sort({ createTime: -1 })
      .limit(20)
      .populate({
        path: 'uid',
        select: 'nickName pic'
      })
  }
}
export default mongoose.model('signRecords', signRecords, 'signRecords')
