import Router from 'koa-router'
import MenuController from '@/api/MenuController'
const router = new Router()
router.prefix('/menu')
// 新增菜单
router.post('/addMenu', MenuController.addMenu)
// 获取菜单
router.get('/getMenu', MenuController.getMenu)
// 修改菜单
router.post('/updateMenu', MenuController.updateMenu)
// 删除菜单
router.get('/deleteMenu', MenuController.deleteMenu)
export default router
