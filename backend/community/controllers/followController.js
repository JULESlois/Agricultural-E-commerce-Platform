const db = require('../config/database');

// 1.1 关注用户
exports.followUser = async (req, res) => {
  const client = await db.connect();
  try {
    const { followed_id, follow_source } = req.body;
    const follower_id = req.user.user_id;

    if (follower_id === followed_id) {
      return res.status(400).json({
        code: 400,
        message: '不能关注自己'
      });
    }

    // 检查是否已关注
    const existing = await client.query(
      'SELECT * FROM community_follows WHERE follower_id = $1 AND followed_id = $2',
      [follower_id, followed_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        code: 400,
        message: '已经关注过该用户'
      });
    }

    // 创建关注关系
    const result = await client.query(
      'INSERT INTO community_follows (follower_id, followed_id, follow_source) VALUES ($1, $2, $3) RETURNING follow_id',
      [follower_id, followed_id, follow_source || 1]
    );

    // 检查是否互相关注
    const mutual = await client.query(
      'SELECT * FROM community_follows WHERE follower_id = $1 AND followed_id = $2',
      [followed_id, follower_id]
    );

    res.status(201).json({
      code: 201,
      message: '关注成功。',
      data: {
        follow_id: result.rows[0].follow_id,
        is_mutual: mutual.rows.length > 0
      }
    });
  } catch (error) {
    console.error('关注用户失败:', error);
    res.status(500).json({
      code: 500,
      message: '关注失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// 1.2 取消关注用户
exports.unfollowUser = async (req, res) => {
  const client = await db.connect();
  try {
    const { followed_id } = req.params;
    const follower_id = req.user.user_id;

    const result = await client.query(
      'DELETE FROM community_follows WHERE follower_id = $1 AND followed_id = $2',
      [follower_id, followed_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        code: 404,
        message: '未找到关注关系'
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error('取消关注失败:', error);
    res.status(500).json({
      code: 500,
      message: '取消关注失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// 1.3 获取用户关注列表
exports.getFollowing = async (req, res) => {
  const client = await db.connect();
  try {
    const { user_id } = req.params;

    const following = await client.query(
      `SELECT 
        u.user_id,
        u.user_name,
        u.avatar,
        EXISTS(
          SELECT 1 FROM community_follows 
          WHERE follower_id = $1 AND followed_id = cf.followed_id
        ) as is_mutual
      FROM community_follows cf
      JOIN users u ON cf.followed_id = u.user_id
      WHERE cf.follower_id = $1`,
      [user_id]
    );

    res.json({
      code: 200,
      message: '查询成功。',
      data: following.rows.map(f => ({
        ...f,
        is_mutual: Boolean(f.is_mutual)
      }))
    });
  } catch (error) {
    console.error('获取关注列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '查询失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// 1.4 获取用户粉丝列表
exports.getFollowers = async (req, res) => {
  const client = await db.connect();
  try {
    const { user_id } = req.params;

    const followers = await client.query(
      `SELECT 
        u.user_id,
        u.user_name,
        u.avatar,
        EXISTS(
          SELECT 1 FROM community_follows 
          WHERE follower_id = $1 AND followed_id = cf.follower_id
        ) as is_mutual
      FROM community_follows cf
      JOIN users u ON cf.follower_id = u.user_id
      WHERE cf.followed_id = $1`,
      [user_id]
    );

    res.json({
      code: 200,
      message: '查询成功。',
      data: followers.rows.map(f => ({
        ...f,
        is_mutual: Boolean(f.is_mutual)
      }))
    });
  } catch (error) {
    console.error('获取粉丝列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '查询失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// 1.5 拉黑用户
exports.blacklistUser = async (req, res) => {
  const client = await db.connect();
  try {
    const { blacked_user_id, black_reason } = req.body;
    const blocker_id = req.user.user_id;

    if (blocker_id === blacked_user_id) {
      return res.status(400).json({
        code: 400,
        message: '不能拉黑自己'
      });
    }

    // 检查是否已拉黑
    const existing = await client.query(
      'SELECT * FROM community_blacklist WHERE blocker_id = $1 AND blacked_user_id = $2',
      [blocker_id, blacked_user_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        code: 400,
        message: '该用户已在黑名单中'
      });
    }

    await client.query(
      'INSERT INTO community_blacklist (blocker_id, blacked_user_id, black_reason) VALUES ($1, $2, $3)',
      [blocker_id, blacked_user_id, black_reason]
    );

    res.status(201).json({
      code: 201,
      message: '已将用户加入黑名单。'
    });
  } catch (error) {
    console.error('拉黑用户失败:', error);
    res.status(500).json({
      code: 500,
      message: '操作失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// 1.6 移除黑名单
exports.removeBlacklist = async (req, res) => {
  const client = await db.connect();
  try {
    const { blacked_user_id } = req.params;
    const blocker_id = req.user.user_id;

    const result = await client.query(
      'DELETE FROM community_blacklist WHERE blocker_id = $1 AND blacked_user_id = $2',
      [blocker_id, blacked_user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        code: 404,
        message: '未找到黑名单记录'
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error('移除黑名单失败:', error);
    res.status(500).json({
      code: 500,
      message: '操作失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};
