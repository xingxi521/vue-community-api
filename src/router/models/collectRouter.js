import Router from 'koa-router'
import CollectRecords from '@/api/CollectController'
const router = new Router()
router.prefix('/collect')
// 收藏帖子
router.post('/collectPost', CollectRecords.collectPost)
// 获取收藏帖子
router.post('/getCollectPost', CollectRecords.getCollectPost)
export default router
