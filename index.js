import Koa from 'koa'
const app = new Koa()
import router from './src/router/index'
import koaBody from 'koa-body'
import koaCors from '@koa/cors'
import helmet from 'koa-helmet'
import koaJson from 'koa-json'
import statics from 'koa-static'
import compose from 'koa-compose'
import jwt from 'koa-jwt'
import path from 'path'
import compress from 'koa-compress'
import './src/config/MongoDB'
import './src/config/RedisConfig'
import errorHandler from './src/common/errorHandler'
import config from './src/config/index'
const isDev = process.env.NODE_ENV !== 'production'
if (!isDev) { // 压缩中间件
  app.use(compress())
}
const koaJwt = jwt({ secret: config.JWT_SECRET }).unless({ path: [/^\/public/, /^\/login/] })
// 合并中间件
const middleWare = compose([
  koaBody(),
  koaCors(),
  helmet(),
  koaJson({ pretty: false, param: 'pretty' }),
  statics(path.join(__dirname, '../public')),
  errorHandler,
  koaJwt
])
app.use(middleWare)
  .use(router())
// 开发环境下是docker镜像的12005端口
const port = isDev ? 3000 : 12005
app.listen(port, function () {
  console.log('服务端运行在3000端口')
})
