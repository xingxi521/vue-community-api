import Router from 'koa-router'
import TagsController from '@/api/TagsController'
const router = new Router()
router.prefix('/tags')
// 获取标签分页数据
router.post('/getTagList', TagsController.getTagList)
// 新增编辑标签
router.post('/addTag', TagsController.addTag)
// 删除标签
router.post('/deleteTag', TagsController.deleteTag)
export default router
