import { createClient } from 'redis'
import config from './index'
const client = createClient({
  url: config.REDIS_URL
})
client.on('ready', () => {
  console.log('Redis Client Connect Successfully=>' + config.REDIS_URL)
})
client.on('error', (err) => {
  console.log('Redis Client Error', err)
})
client.connect()
// 设置redis键值
export function setValue(key, value, time) {
  if (!key || value == null || value === undefined) {
    return
  }
  if (typeof value === 'string') {
    // 设置过期事件
    if (time) {
      client.set(key, value, {
        EX: time
      })
    } else { // 不设置过期事件
      client.set(key, value)
    }
  } else if (typeof value === 'object') {
    Object.keys(value).forEach(item => {
      client.hSet(key, item, value[item])
    })
  }
}
// 获取key键值
export function getValue(key) {
  return client.get(key)
}
// 获取hash的键值
export function getHvalue(key) {
  return client.hGet(key)
}
// 删除键值
export function delKey(key) {
  client.del(key, (error, res) => {
    if (res === 1) {
      console.log('delete key:' + key + ',Successfully!')
    } else {
      console.log('delete key:' + key + ',error:' + error)
    }
  })
}
