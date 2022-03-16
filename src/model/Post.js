import mongoose from 'mongoose'
import dayjs from 'dayjs'
import { pager } from '../common/utils'
const Post = mongoose.Schema({
  userInfo: { type: String, ref: 'users' },
  title: { type: String },
  content: { type: String },
  createTime: { type: Date },
  answer: { type: Number, default: 0 },
  read: { type: Number, default: 0 },
  fav: { type: Number, default: 0 },
  status: { type: Number, default: 0 },
  isEnd: { type: Number, default: 0 },
  isTop: { type: Number, default: 0 },
  sort: { type: Number, default: 0 },
  tags: { type: Array, default: [] },
  type: { type: String }
})
// 前置钩子处理创建时间
Post.pre('save', function(next) {
  this.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  next()
})
Post.statics = {
  // 根据不同条件查询数据库
  getList(options, sort, pageNum, pageSize) {
    const { skipIndex } = pager(pageNum, pageSize)
    return this.find(options)
      .sort({ [sort]: -1 })
      .skip(skipIndex)
      .limit(pageSize)
      .populate({
        path: 'userInfo',
        select: 'nickName pic vip'
      })
  },
  // 获取文章详情
  getDetails(_id) {
    return this.findById(_id)
      .populate({
        path: 'userInfo',
        select: 'nickName pic vip role'
      })
  },
  // 根据用户ID查询文章数据
  getListByUid(uid, pageNum, pageSize) {
    const { skipIndex } = pager(pageNum, pageSize)
    return this.find({ userInfo: uid })
      .sort({ 'createTime': -1 })
      .skip(skipIndex)
      .limit(pageSize)
      .populate({
        path: 'userInfo',
        select: 'nickName pic vip'
      })
  },
  // 查询周热议
  getTopWeek() {
    return this.find({ createTime: { $gte: dayjs().subtract(7, 'days') }}, { title: 1, answer: 1 })
      .sort({ answer: -1 })
      .limit(10)
  }
}
export default mongoose.model('post', Post, 'post')
