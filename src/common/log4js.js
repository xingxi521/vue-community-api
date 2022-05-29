import log4js from 'koa-log4'
log4js.configure({
  appenders: {
    // 控制台输出
    out: {
      type: 'console'
    },
    // 应用级别输出
    application: {
      type: 'dateFile',
      filename: 'logs/app.log',
      pattern: '-yyyy-MM-dd.log'
    },
    // 错误日志
    error: {
      type: 'dateFile',
      filename: 'logs/error.log',
      pattern: '-yyyy-MM-dd.log'
    }
  },
  categories: {
    default: { appenders: ['out'], level: 'info' },
    application: { appenders: ['application'], level: 'warn' },
    error: { appenders: ['error', 'out'], level: 'warn' }
  }
})

export const httpLogger = () => {
  return log4js.koaLogger(log4js.getLogger('http'), {
    level: 'auto'
  })
}
export const appLogger = () => {
  return log4js.koaLogger(log4js.getLogger('application'), {
    level: 'auto'
  })
}

export const errorLog4js = (content, ctx) => {
  const logger = log4js.getLogger('error')
  logger.error(`method：${ctx.request.method}，url：${ctx.request.url}，params：${ctx.request.method === 'POST' ? JSON.stringify(ctx.request.body) : JSON.stringify(ctx.request.query)}\n${content}`)
}
