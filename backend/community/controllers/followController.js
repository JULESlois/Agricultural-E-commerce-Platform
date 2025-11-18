const { Follow, Blacklist } = require('../models');
const { success, error: errorResponse } = require('../utils/response');
const { Op } = require('sequelize');

// 1.1 关注用户
exports.followUser = async (req, res, next) => {
  try {
    const { followed_id, follow_source } = req.body;
    const follower_id = req.user.user_id;

    if (follower_id === followed_id) {
      return errorResponse(res, '不能关注自己', 400);
    }

    // 检查是否已关注
    const existing = await Follow.findOne({
      where: { follower_id, followed_id }
    });

    if (existing) {
      return errorResponse(res, '已经关注过该用户', 400);
    }

    // 创建关注关系
    const follow = await Follow.create({
      follower_id,
      followed_id,
      follow_source: follow_source || 1
    });

    // 检查是否互相关注
    const mutual = await Follow.findOne({
      where: { follower_id: followed_id, followed_id: follower_id }
    });

    success(res, {
      follow_id: follow.follow_id,
      is_mutual: !!mutual
    }, '关注成功。', 201);
  } catch (err) {
    next(err);
  }
};

// 1.2 取消关注用户
exports.unfollowUser = async (req, res, next) => {
  try {
    const { followed_id } = req.params;
    const follower_id = req.user.user_id;

    const result = await Follow.destroy({
      where: { follower_id, followed_id }
    });

    if (result === 0) {
      return errorResponse(res, '未找到关注关系', 404);
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

// 1.3 获取用户关注列表
exports.getFollowing = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const following = await Follow.findAll({
      where: { follower_id: user_id },
      attributes: ['followed_id', 'create_time']
    });

    // 检查互关关系
    const followedIds = following.map(f => f.followed_id);
    const mutualFollows = await Follow.findAll({
      where: {
        follower_id: user_id,
        followed_id: { [Op.in]: followedIds }
      },
      attributes: ['followed_id']
    });

    const mutualSet = new Set(mutualFollows.map(f => f.followed_id));

    const data = following.map(f => ({
      user_id: f.followed_id,
      is_mutual: mutualSet.has(f.followed_id),
      follow_time: f.create_time
    }));

    success(res, data, '查询成功。');
  } catch (err) {
    next(err);
  }
};

// 1.4 获取用户粉丝列表
exports.getFollowers = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const followers = await Follow.findAll({
      where: { followed_id: user_id },
      attributes: ['follower_id', 'create_time']
    });

    // 检查互关关系
    const followerIds = followers.map(f => f.follower_id);
    const mutualFollows = await Follow.findAll({
      where: {
        follower_id: user_id,
        followed_id: { [Op.in]: followerIds }
      },
      attributes: ['followed_id']
    });

    const mutualSet = new Set(mutualFollows.map(f => f.followed_id));

    const data = followers.map(f => ({
      user_id: f.follower_id,
      is_mutual: mutualSet.has(f.follower_id),
      follow_time: f.create_time
    }));

    success(res, data, '查询成功。');
  } catch (err) {
    next(err);
  }
};

// 1.5 拉黑用户
exports.blacklistUser = async (req, res, next) => {
  try {
    const { blacked_user_id, black_reason } = req.body;
    const blocker_id = req.user.user_id;

    if (blocker_id === blacked_user_id) {
      return errorResponse(res, '不能拉黑自己', 400);
    }

    // 检查是否已拉黑
    const existing = await Blacklist.findOne({
      where: { blocker_id, blacked_user_id }
    });

    if (existing) {
      return errorResponse(res, '该用户已在黑名单中', 400);
    }

    await Blacklist.create({
      blocker_id,
      blacked_user_id,
      black_reason
    });

    success(res, null, '已将用户加入黑名单。', 201);
  } catch (err) {
    next(err);
  }
};

// 1.6 移除黑名单
exports.removeBlacklist = async (req, res, next) => {
  try {
    const { blacked_user_id } = req.params;
    const blocker_id = req.user.user_id;

    const result = await Blacklist.destroy({
      where: { blocker_id, blacked_user_id }
    });

    if (result === 0) {
      return errorResponse(res, '未找到黑名单记录', 404);
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = exports;
