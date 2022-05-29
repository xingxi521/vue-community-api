/**
 * 首页controller
 */
import { responseFail, responseSuccess } from '@/common/utils'
import User from '@/model/User'
import Post from '@/model/Post'
import CommentRecords from '@/model/CommentRecords'
import NiceRecords from '@/model/NiceRecords'
import SignRecords from '@/model/SignRecords'
import dayjs from 'dayjs'
import { errorLog4js } from '@/common/log4js'
const weekday = require('dayjs/plugin/weekday')
dayjs.extend(weekday)
class HomeController {
  // 获取首页统计数据
  async getStatistics(ctx) {
    try {
      const result = {}
      // 当日的0点0时0分0秒
      const today = new Date().setHours(0, 0, 0, 0)
      // 当日为基准的本周一时间到周天的时间
      const thisWeekStart = dayjs(today).weekday(1).format('YYYY-MM-DD 00:00:00')
      const thisWeekEnd = dayjs(today).weekday(7).format('YYYY-MM-DD 23:59:59')
      // 首页6个卡片数据
      const cardData = []
      // 当日用户新增数据
      const addUserCount = await User.find({ createTime: { $gte: dayjs(today).format('YYYY-MM-DD 00:00:00') }}).countDocuments()
      cardData.push(addUserCount)
      // 累计发帖数
      const postCount = await Post.find({}).countDocuments()
      cardData.push(postCount)
      // 当日新增评论数
      const addCommentCount = await CommentRecords.find({ createTime: { $gte: dayjs(today).format('YYYY-MM-DD 00:00:00') }}).countDocuments()
      cardData.push(addCommentCount)
      // 本周点赞数
      const weekNiceCount = await NiceRecords.find({ createTime: { $gte: thisWeekStart, $lte: thisWeekEnd }}).countDocuments()
      cardData.push(weekNiceCount)
      // 本周签到数
      const weekSignCount = await SignRecords.find({ createTime: { $gte: thisWeekStart, $lte: thisWeekEnd }}).countDocuments()
      cardData.push(weekSignCount)
      // 本周发帖数
      const weekPostCount = await Post.find({ createTime: { $gte: thisWeekStart, $lte: thisWeekEnd }}).countDocuments()
      cardData.push(weekPostCount)
      result.cardData = cardData
      // 发帖统计饼图数据
      const pieData = await Post.aggregate([
        { $group: { _id: '$type', count: { $sum: 1 }}}
      ])
      result.pieData = pieData
      // 近6个月的发帖数据
      const beforeMonth = dayjs(today).subtract('5', 'M').date(1).format('YYYY-MM-DD 00:00:00')
      const afterMonth = dayjs(today).add(1, 'M').date(1).format('YYYY-MM-DD 00:00:00')
      const nearSixPostData = await Post.aggregate([
        { $match: { createTime: { $gte: new Date(beforeMonth), $lt: new Date(afterMonth) }}},
        { $project: { month: { $dateToString: { format: '%Y-%m', date: '$createTime' }}}},
        { $group: { _id: '$month', count: { $sum: 1 }}},
        { $sort: { _id: 1 }}
      ])
      result.nearSixPostData = nearSixPostData
      // 近七天数据统计
      const nearSeventDay = dayjs().subtract(6, 'day').format('YYYY-MM-DD 00:00:00')
      // 定义通用的聚合查询方法
      const query = async (model) => {
        const records = await model.aggregate([
          { $match: { createTime: { $gte: new Date(nearSeventDay) }}},
          { $project: { month: { $dateToString: { format: '%Y-%m-%d', date: '$createTime' }}}},
          { $group: { _id: '$month', count: { $sum: 1 }}},
          { $sort: { _id: 1 }}
        ])
        const result = {}
        for (let i = 0; i < 7; i++) {
          const day = dayjs().subtract(i, 'd').format('YYYY-MM-DD')
          result[day] = 0
        }
        records.forEach(item => {
          if (item._id in result) {
            result[item._id] = item.count
          } else {
            result[item._id] = 0
          }
        })
        return Object.values(result)
      }
      // 近7天新增用户
      const weekUser = await query(User)
      // 近7天签到总数
      const weekSign = await query(SignRecords)
      // 近7天发帖数
      const weekPost = await query(Post)
      // 近7天回复数
      const weekComment = await query(CommentRecords)
      result.weekData = {
        weekUser,
        weekSign,
        weekPost,
        weekComment
      }
      responseSuccess(ctx, '获取统计成功', result)
    } catch (error) {
      errorLog4js(error.stack, ctx)
      responseFail(ctx, error.stack)
    }
  }
}
export default new HomeController()
