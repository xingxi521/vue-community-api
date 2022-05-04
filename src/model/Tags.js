import mongoose from 'mongoose'
import dayjs from 'dayjs'
import { pager } from '@/common/utils'
const Tags = mongoose.Schema({
  name: { type: String, default: '' },
  className: { type: String, default: '' },
  createTime: { type: String }
})
// 前置钩子处理创建时间
Tags.pre('save', function(next) {
  this.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  next()
})
Tags.statics = {
  // 根据页码查询标签数据
  getList: async function(options, sort, pageNum, pageSize) {
    const { skipIndex } = pager(pageNum, pageSize)
    return this.find(options)
      .sort({ [sort]: -1 })
      .skip(skipIndex)
      .limit(pageSize)
  }
}
export default mongoose.model('tags', Tags, 'tags')
