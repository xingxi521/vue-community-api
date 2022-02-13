import mongoose from 'mongoose'
import dayjs from 'dayjs'
const Link = mongoose.Schema({
  title: { type: String, default: '' },
  link: { type: String, default: '' },
  isTop: { type: Number, default: 0 },
  sort: { type: Number, default: 0 },
  createTime: { type: String },
  type: { type: String }
})
// 前置钩子处理创建时间
Link.pre('save', function(next) {
  this.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  next()
})
Link.statics = {
  // 根据不同条件查询数据库
  getLinkList: async function(type) {
    return this.find({ type })
      .skip(0)
      .limit(6)
  }
}
export default mongoose.model('link', Link, 'link')
