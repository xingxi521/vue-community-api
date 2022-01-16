import mongoose from 'mongoose'
const Users = mongoose.Schema({
  userName: String,
  passWord: String,
  nickName: String,
  createTime: {
    type: Date,
    default: Date.now()
  }
})
export default mongoose.model('users', Users)
