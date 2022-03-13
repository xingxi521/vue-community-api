/**
 * 收藏信息model
 */
import mongoose from 'mongoose'
import dayjs from 'dayjs'
import { pager } from '@/common/utils'
const CollectRecords = mongoose.Schema({
  tid: { type: String, ref: 'post' },
  uid: { type: String },
  createTime: { type: Date }
})
// 前置钩子处理创建时间
CollectRecords.pre('save', function(next) {
  this.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  next()
})
CollectRecords.statics = {
  // 获取收藏列表
  getCollectList(uid, pageNum, pageSize) {
    const { skipIndex } = pager(pageNum, pageSize)
    return this.find({ uid })
      .sort({ 'createTime': -1 })
      .skip(skipIndex)
      .limit(pageSize)
      .populate({
        path: 'tid',
        select: 'title'
      })
  }
}
export default mongoose.model('collectRecords', CollectRecords, 'collectRecords')
