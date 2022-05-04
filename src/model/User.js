import mongoose from 'mongoose'
import dayjs from 'dayjs'
import { pager } from '@/common/utils'
const Users = mongoose.Schema({
  // 添加唯一索引
  userName: {
    type: String,
    index: {
      sparse: true,
      unique: true
    }
  },
  passWord: {
    type: String,
    default: ''
  },
  nickName: {
    type: String,
    default: ''
  },
  role: {
    type: Array,
    default: ['user']
  },
  createTime: {
    type: Date
  },
  updateTime: {
    type: Date
  },
  pic: {
    type: String,
    default: 'img/avr.png'
  },
  gender: {
    type: Number,
    default: 0
  },
  location: {
    type: String,
    default: ''
  },
  personSign: {
    type: String,
    default: ''
  },
  vip: {
    type: Number,
    default: 0
  },
  favs: {
    type: Number,
    default: 0
  },
  status: {
    type: Number,
    default: 0
  },
  count: {
    type: Number,
    default: 0
  }
})
// 前置钩子设置创建时间和更新时间
Users.pre('save', function(next) {
  this.createTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  next()
})
Users.pre('update', function(next) {
  this.updateTime = dayjs().format('YYYY-MM-DD HH:mm:ss')
  next()
})
// 校验重复键问题
Users.post('save', function(error, res, next) {
  console.log(error)
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'))
  } else {
    next() // The `update()` call will still error out.
  }
})
Users.post('update', function(error, res, next) {
  if (error.name === 'MongoServerError' && error.code === 11000) {
    next(new Error('There was a duplicate key error'))
  } else {
    next() // The `update()` call will still error out.
  }
})
Users.statics = {
  // 查询签到榜
  getTopSign() {
    return this.find({ count: { $gt: 0 }}, { nickName: 1, count: 1, pic: 1 })
      .sort({ count: -1 })
      .limit(20)
  },
  // 根据不同条件查询数据库
  getList(options, sort, pageNum, pageSize) {
    const { skipIndex } = pager(pageNum, pageSize)
    const params = {}
    // 过滤掉空字符串或者数组里空的字段
    Object.keys(options).forEach(key => {
      if (Array.isArray(options[key])) {
        if (options[key][0]) {
          params[key] = options[key]
        }
      } else if (options[key]) {
        params[key] = options[key]
      }
    })
    // 如果传了时间范围
    if (params.createTime) {
      const dateRange = [...params.createTime]
      params.createTime = { $gte: new Date(dateRange[0]), $lt: new Date(dateRange[1]) }
    }
    return this.find(params, { passWord: 0 })
      .sort({ [sort]: -1 })
      .skip(skipIndex)
      .limit(pageSize)
  }
}
export default mongoose.model('users', Users, 'users')
