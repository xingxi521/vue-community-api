// jwt错误鉴权
import { errorLog4js } from '@/common/log4js'
export default function errorHandler(ctx, next) {
  return next().catch((err) => {
    errorLog4js(err.stack, ctx)
    if (err.status === 401) {
      ctx.status = 401
      ctx.body = 'Protected resource, use Authorization header to get access\n'
    } else {
      // throw err
      ctx.status = err.status || 500
      ctx.body = {
        code: 500,
        msg: err.message
      }
    }
  })
}
