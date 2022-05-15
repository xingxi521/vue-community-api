/**
 * 资源权限校验 中间件
 */
import { getTokenInfo, getMenuTree } from '@/common/utils'
import { getValue } from '@/config/RedisConfig'
import config from '@/config/index'
import Menus from '@/model/Menus'
import User from '@/model/User'
import Roles from '@/model/Roles'
export default async(ctx, next) => {
  const headers = ctx.headers.authorization
  if (headers) { // 携带了token
    try {
      // 检查当前id是不是属于超级管理员
      var tokenInfo = getTokenInfo(ctx)
      if (tokenInfo.userId) {
        const adminList = JSON.parse(await getValue('adminList'))
        if (adminList.indexOf(tokenInfo.userId) !== -1) { // 如果是超管账号直接放行，下面就没必要再验证任何东西了
          ctx.isAdmin = true
          await next()
          return
        } else {
          ctx.isAdmin = false
        }
      } else {
        ctx.throw(401)
      }
    } catch (error) {
      error.status = 401
      ctx.throw(error)
    }
  }
  // 过滤掉公共不需要token的接口
  const publicPath = config.PUBLIC_PATH
  if (publicPath.some(path => path.test(ctx.url))) {
    await next()
    return
  }
  const isPermission = await getResourceById(tokenInfo.userId, ctx.url)
  if (isPermission) {
    await next()
  } else {
    ctx.throw(501)
  }
}
// 根据用户ID获取出用户ID具有的资源权限数组并且判断是否具有权限
const getResourceById = async (userId, url) => {
  // 生成整个菜单树
  const menu = await Menus.find({})
  const menuToJson = menu.map(item => item.toJSON())
  const menuTree = getMenuTree(menuToJson, null)
  // 查找用户对应的角色权限
  const userRole = (await User.findById(userId, 'role')).role
  // 用户拥有的所有权限ID
  let userMenuRole = []
  for (const role of userRole) {
    const roleRecords = await Roles.findOne({ code: role })
    userMenuRole = [...userMenuRole, ...roleRecords.menus]
  }
  // 去掉重复的权限id-因为有可能一个账号多个角色
  userMenuRole = [...new Set(userMenuRole)]
  const menuResourcePath = getOperations(menuTree, 'path', userMenuRole)
  if (menuResourcePath.indexOf(url) !== -1) {
    return true
  } else {
    return false
  }
}
// 根据用户权限数组取出资源权限的path
const getOperations = (treeData, property, userRole) => {
  let result = []
  treeData.forEach(item => {
    if (item.operations && item.operations.length > 0) {
      item.operations.forEach(ope => {
        if (userRole.indexOf(ope._id + '') !== -1) {
          result.push(ope[property])
        }
      })
    }
    if (item.children && item.children.length > 0) {
      result = result.concat(getOperations(item.children, property, userRole))
    }
  })
  return result
}
