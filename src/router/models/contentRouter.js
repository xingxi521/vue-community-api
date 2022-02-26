import Router from 'koa-router'
import ContentController from '@/api/ContentController'
const router = new Router()
router.prefix('/content')
router.post('/uploadFile', ContentController.uploadFile)
router.post('/createPost', ContentController.createPost)
export default router
