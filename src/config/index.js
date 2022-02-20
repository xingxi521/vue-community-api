export default {
  // 数据库连接地址
  MONGO_URL: 'mongodb://192.168.56.1/community',
  // redis连接地址
  REDIS_URL: 'redis://:123456@192.168.56.1:15001',
  // jwt秘钥
  JWT_SECRET: 'QWEFJIOJCV189CIOEWF1FSDFJIOWFV456RFGJIOQWD54VCVBJIUESFJIO',
  // 文件上传路径地址
  UPLOAD_PATH: process.env.NODE_ENV === 'production' ? 'app/public' : 'public'
}
