import mongoose from 'mongoose'
import dayjs from 'dayjs'
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
    default: '/img/avr.png'
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
  }
}
export default mongoose.model('users', Users, 'users')
