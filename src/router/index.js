// 路由入口文件
import combineRouters from 'koa-combine-routers'
import publicRouter from './publicRouter'
import loginRouter from './loginRouter'
const router = combineRouters(
  publicRouter,
  loginRouter
)
export default router
