import Roles from '@/model/Roles'
import Menus from '@/model/Menus'
import User from '@/model/User'
import { responseSuccess, responseFail, getMenuTree, getMenuRoter, getTokenInfo } from '@/common/utils'
class RolesController {
  // 获取角色权限数据
  async getRoles(ctx) {
    try {
      const result = await Roles.find({})
      responseSuccess(ctx, '获取角色权限数据成功', result)
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
  // 新增-编辑角色
  async addRoles(ctx) {
    try {
      const body = ctx.request.body
      if (body._id) {
        await Roles.updateOne({ _id: body._id }, body)
        responseSuccess(ctx, '修改角色成功！')
      } else {
        const roleRecords = new Roles(body)
        roleRecords.save()
        responseSuccess(ctx, '新增角色成功！')
      }
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
  // 获取角色数据-不包含菜单权限信息的
  async getRolesName(ctx) {
    try {
      const result = await Roles.find({}, { menus: 0, desc: 0 })
      responseSuccess(ctx, '获取角色数据成功', result)
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
  // 获取前端菜单数据
  async getMenuRouter(ctx) {
    try {
      const tokenInfo = getTokenInfo(ctx)
      // 生成整个菜单树
      const menu = await Menus.find({})
      const menuToJson = menu.map(item => item.toJSON())
      const menuTree = getMenuTree(menuToJson, null)
      // 查找用户对应的角色权限
      const userRole = (await User.findById(tokenInfo.userId, 'role')).role
      // 用户拥有的所有权限ID
      let userMenuRole = []
      for (const role of userRole) {
        const roleRecords = await Roles.findOne({ code: role })
        userMenuRole = [...userMenuRole, ...roleRecords.menus]
      }
      // 去掉重复的权限id-因为有可能一个账号多个角色
      userMenuRole = [...new Set(userMenuRole)]
      const result = getMenuRoter(menuTree, userMenuRole, ctx.isAdmin)
      responseSuccess(ctx, '获取菜单路由表成功', result)
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.stack)
    }
  }
}
export default new RolesController()
