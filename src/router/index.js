// 路由入口文件
import combineRouters from 'koa-combine-routers'
import publicRouter from './publicRouter'
import loginRouter from './loginRouter'
import userRouter from './userRouter'
const router = combineRouters(
  publicRouter,
  loginRouter,
  userRouter
)
export default router
