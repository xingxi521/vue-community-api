import mongoose from 'mongoose'
import dayjs from 'dayjs'
import { pager } from '@/common/utils'
const CommentRecords = mongoose.Schema({
  tid: { type: String, ref: 'post' },
  uid: { type: String, ref: 'users' },
  content: { type: String, default: '' },
  isBest: { type: Boolean, default: false },
  isRead: { type: Boolean, default: false },
  niceCount: { type: Number, default: 0 },
  createTime: { type: Date }
})
// 前置钩子处理创建时间
CommentRecords.pre('save', function(next) {
  this.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  next()
})
CommentRecords.statics = {
  // 查询评论数据
  getCommentList(tid, pageNum, pageSize) {
    const { skipIndex } = pager(pageNum, pageSize)
    return this.find({ tid })
      .skip(skipIndex)
      .limit(pageSize)
      .populate({
        path: 'uid',
        select: 'nickName pic vip role status'
      })
  }
}
export default mongoose.model('commentRecords', CommentRecords, 'commentRecords')
