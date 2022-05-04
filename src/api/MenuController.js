import Menus from '@/model/Menus'
import { responseSuccess, responseFail, getMenuTree, getTreeFiled } from '@/common/utils'
class MenuController {
  // 获取菜单
  async getMenu(ctx) {
    try {
      const menu = await Menus.find({})
      const menuToJson = menu.map(item => item.toJSON())
      const result = getMenuTree(menuToJson, null)
      responseSuccess(ctx, '获取菜单数据成功！', result)
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.message)
    }
  }
  // 新增菜单
  async addMenu(ctx) {
    try {
      const body = ctx.request.body
      const menuRecords = new Menus(body)
      menuRecords.save()
      responseSuccess(ctx, '新增成功！')
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.message)
    }
  }
  // 修改菜单
  async updateMenu(ctx) {
    try {
      const { _id } = ctx.request.body
      const menuRecord = await Menus.findById(_id)
      if (menuRecord) {
        await Menus.updateOne({ _id }, ctx.request.body)
        responseSuccess(ctx, '修改菜单成功！')
      } else {
        responseFail(ctx, '菜单不存在，修改失败！')
      }
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.message)
    }
  }
  // 删除菜单
  async deleteMenu(ctx) {
    try {
      const { _id } = ctx.request.query
      const menu = await Menus.find({})
      const menuToJson = menu.map(item => item.toJSON())
      // 先根据选中节点id查出该选中节点下所有子节点包括孙节点
      const menuTree = getMenuTree(menuToJson, _id)
      // 然后过滤出需要删除的id
      const resultArr = getTreeFiled(menuTree, '_id')
      // 最后要把选中的节点id也push到需要删除数组里，因为上面只是过滤出选中节点下所有的菜单id,不包含选中的节点id
      resultArr.push(_id)
      await Menus.deleteMany({ _id: { $in: resultArr }})
      responseSuccess(ctx, '删除菜单成功！')
    } catch (error) {
      console.log(error)
      responseFail(ctx, error.message)
    }
  }
}
export default new MenuController()
