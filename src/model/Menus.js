import mongoose from 'mongoose'
const Menus = mongoose.Schema({
  title: { type: String, default: '' },
  pid: { type: String, default: '' },
  path: { type: String, default: '' },
  type: { type: Number, default: 0 },
  name: { type: String, default: '' },
  component: { type: String, default: '' },
  hideInBread: { type: Boolean, default: false },
  hideInMenu: { type: Boolean, default: false },
  notCache: { type: Boolean, default: false },
  icon: { type: String, default: '' },
  href: { type: String, default: '' },
  redirect: { type: String, default: '' },
  expand: { type: Boolean, default: true }
})
const operations = mongoose.Schema({
  method: { type: String },
  path: { type: String },
  type: { type: String },
  name: { type: String },
  remark: { type: String, default: '' }
})
Menus.add({
  operations: [operations]
})
export default mongoose.model('menus', Menus, 'menus')
