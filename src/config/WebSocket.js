import WebSocket, { WebSocketServer } from 'ws'
import configSet from '@/config/index'
import jsonwebtoken from 'jsonwebtoken'
import CommentRecords from '@/model/CommentRecords'
class WebSocketPacking {
  constructor(config = {}) {
    // 默认配置
    const defaultConfig = {
      port: configSet.WS_PORT,
      // 是否开启鉴权
      isAuth: true,
      // 心跳检测频率
      hearTimeInterval: 30 * 1000
    }
    const resultConfit = { ...defaultConfig, ...config }
    this.port = resultConfit.port
    this.isAuth = resultConfit.isAuth
    this.hearTimeInterval = resultConfit.hearTimeInterval
    // 心跳事件
    this.timeInterval = null
    // websocket实例对象
    this.wss = {}
    // websocket的一些配置项
    this.options = config.options || {}
  }
  // 初始化websocket
  init() {
    this.wss = new WebSocketServer({ port: this.port, ...this.options })
    this.wss.on('connection', (ws, req) => {
      console.log(`客户进入=>IP:${req.connection.remoteAddress},端口：${req.connection.remotePort}`)
      ws.isOnline = true
      ws.on('message', (msg) => this.onMessage(ws, msg))
      ws.on('close', () => this.onClose(ws))
    })
    this.checkHearBeat()
  }
  // 消息到达
  onMessage(ws, msg) {
    // 将客户端传过来数据做JSON转换成对象
    const msgData = JSON.parse(msg) || {}
    // 事件定义，根据传过来的event执行对应的事件
    const evens = {
      // 鉴权处理
      async jwtAuth() {
        try {
          const token = jsonwebtoken.verify(msgData.message, configSet.JWT_SECRET)
          ws.isAuth = true
          ws.userId = token.userId
          const count = await CommentRecords.countDocuments({ cuid: token.userId, isRead: false })
          ws.send(JSON.stringify({
            event: 'getNoReadCount',
            message: count
          }))
        } catch (error) {
          ws.send(JSON.stringify({
            event: 'noAuth',
            message: '请先登录账号！'
          }))
        }
      },
      // 客户端发送回来的心跳处理
      heartBeat() {
        if (msgData.message === 'pong') {
          ws.isOnline = true
        }
      }
    }
    evens[msgData.event]()
  }
  // 断开连接
  onClose(ws) {

  }
  // 消息发送
  send(uid, msg) {
    this.wss.clients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN && ws.userId === uid) {
        ws.send(msg)
      }
    })
  }
  // 消息广播
  broadCast(msg) {
    this.wss.clients.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(msg)
      }
    })
  }
  // 心跳检测
  checkHearBeat() {
    clearInterval(this.timeInterval)
    this.timeInterval = setInterval(() => {
      this.wss.clients.forEach(ws => {
        if (!ws.isOnline) {
          // 如果是Online为false证明客户端没及时响应，及时响应了会出发onMessage里的heartBeat方法把onLine设置为true的
          return ws.terminate()
        }
        ws.isOnline = false
        ws.send(JSON.stringify({
          event: 'heartBeat',
          message: 'ping'
        }))
      })
    }, this.hearTimeInterval)
  }
}
export default WebSocketPacking
