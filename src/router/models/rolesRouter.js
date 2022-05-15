import Router from 'koa-router'
import RolesController from '@/api/RolesController'
const router = new Router()
router.prefix('/role')
// 获取角色权限数据
router.get('/getRoleList', RolesController.getRoles)
// 新增角色
router.post('/addRole', RolesController.addRoles)
// 获取角色数据-不包含菜单权限数据
router.get('/getRoleName', RolesController.getRolesName)
// 获取菜单路由表
router.get('/getMenuRouter', RolesController.getMenuRouter)
export default router
