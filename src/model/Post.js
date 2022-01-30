import mongoose from 'mongoose'
import dayjs from 'dayjs'
import { pager } from '../common/utils'
const Post = mongoose.Schema({
  userInfo: { type: String, ref: 'users' },
  title: { type: String },
  content: { type: String },
  createTime: { type: Date },
  answer: { type: Number },
  read: { type: Number },
  fav: { type: Number },
  status: { type: Number },
  isEnd: { type: Number },
  isTop: { type: Number },
  sort: { type: Number },
  tags: { type: Array },
  type: { type: String }
})
// 前置钩子处理创建时间
Post.pre('save', function(next) {
  this.createTime = dayjs.format('yyyy-MM-DD HH:mm:ss')
  next()
})
Post.statics = {
  // 根据不同条件查询数据库
  getList: async function(options, sort, pageNum, pageSize) {
    const { skipIndex } = pager(pageNum, pageSize)
    return this.find(options)
      .sort({ [sort]: -1 })
      .skip(skipIndex)
      .limit(pageSize)
      .populate({
        path: 'userInfo',
        select: 'nickName pic vip'
      })
  }
}
export default mongoose.model('post', Post, 'post')
