import Router from 'koa-router'
import ContentController from '@/api/ContentController'
const router = new Router()
router.prefix('/content')
router.post('/uploadFile', ContentController.uploadFile)
// 新建帖子
router.post('/createPost', ContentController.createPost)
// 编辑帖子
router.post('/editPost', ContentController.updatePost)
// 删除帖子
router.post('/delPost', ContentController.deletePost)
export default router
