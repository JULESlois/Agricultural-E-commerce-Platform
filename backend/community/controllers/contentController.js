const db = require('../config/database');

// 3.1 发布社区内容
exports.createContent = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const { category_id, content_type, content_title, content_text, content_cover, tag_ids, reward_amount } = req.body;
    const author_id = req.user.user_id;

    // 插入内容
    const result = await client.query(
      `INSERT INTO community_content 
      (author_id, category_id, content_type, content_title, content_text, content_cover, audit_status) 
      VALUES ($1, $2, $3, $4, $5, $6, 0) RETURNING content_id`,
      [author_id, category_id, content_type, content_title, content_text, content_cover || null]
    );

    const content_id = result.rows[0].content_id;

    // 关联标签
    if (tag_ids && tag_ids.length > 0) {
      for (const tag_id of tag_ids) {
        await client.query(
          'INSERT INTO community_content_tags (content_id, tag_id) VALUES ($1, $2)',
          [content_id, tag_id]
        );
      }
    }

    // 如果是问题类型且有悬赏，创建问答记录
    if (content_type === 3 && reward_amount) {
      await client.query(
        'INSERT INTO community_qa_relation (content_id, reward_amount, reward_status) VALUES ($1, $2, 0)',
        [content_id, reward_amount]
      );
    }

    await client.query('COMMIT');

    res.status(201).json({
      code: 201,
      message: '内容发布成功，等待审核。',
      data: {
        content_id
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('发布内容失败:', error);
    res.status(500).json({
      code: 500,
      message: '发布失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// 3.2 获取内容列表
exports.getContentList = async (req, res) => {
  const client = await db.connect();
  try {
    const { category_id, sort = 'latest', page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    let orderBy = 'cc.create_time DESC';
    if (sort === 'hot') {
      orderBy = '(cc.view_count + cc.like_count * 2 + cc.comment_count * 3) DESC';
    }

    let whereClause = 'cc.audit_status = 1 AND cc.is_deleted = 0';
    const params = [];
    let paramIndex = 1;

    if (category_id) {
      whereClause += ` AND cc.category_id = $${paramIndex}`;
      params.push(category_id);
      paramIndex++;
    }

    params.push(parseInt(limit));
    params.push(parseInt(offset));

    // 检查 users 表是否存在
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    let contents;
    if (tableCheck.rows[0].exists) {
      // users 表存在，使用 JOIN 查询
      contents = await client.query(
        `SELECT 
          cc.content_id,
          cc.content_title,
          cc.content_cover,
          cc.view_count,
          cc.like_count,
          cc.comment_count,
          cc.author_id,
          u.user_name,
          u.avatar
        FROM community_content cc
        LEFT JOIN users u ON cc.author_id = u.user_id
        WHERE ${whereClause}
        ORDER BY ${orderBy}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        params
      );
    } else {
      // users 表不存在，只查询内容表
      contents = await client.query(
        `SELECT 
          cc.content_id,
          cc.content_title,
          cc.content_cover,
          cc.view_count,
          cc.like_count,
          cc.comment_count,
          cc.author_id
        FROM community_content cc
        WHERE ${whereClause}
        ORDER BY ${orderBy}
        LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
        params
      );
    }

    res.json({
      code: 200,
      message: '查询成功。',
      data: contents.rows.map(c => ({
        content_id: c.content_id,
        content_title: c.content_title,
        content_cover: c.content_cover,
        author: {
          user_id: c.author_id,
          user_name: c.user_name || `用户${c.author_id}`,
          avatar: c.avatar || null
        },
        view_count: c.view_count,
        like_count: c.like_count,
        comment_count: c.comment_count
      }))
    });
  } catch (error) {
    console.error('获取内容列表失败:', error);
    res.status(500).json({
      code: 500,
      message: '查询失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// 3.3 获取内容详情
exports.getContentDetail = async (req, res) => {
  const client = await db.connect();
  try {
    const { content_id } = req.params;

    // 检查 users 表是否存在
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'users'
      );
    `);

    let contents;
    if (tableCheck.rows[0].exists) {
      contents = await client.query(
        `SELECT 
          cc.*,
          u.user_name,
          u.avatar
        FROM community_content cc
        LEFT JOIN users u ON cc.author_id = u.user_id
        WHERE cc.content_id = $1 AND cc.is_deleted = 0`,
        [content_id]
      );
    } else {
      contents = await client.query(
        `SELECT cc.*
        FROM community_content cc
        WHERE cc.content_id = $1 AND cc.is_deleted = 0`,
        [content_id]
      );
    }

    if (contents.rows.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '内容不存在'
      });
    }

    const content = contents.rows[0];

    // 获取标签
    const tags = await client.query(
      `SELECT t.tag_id, t.tag_name
      FROM community_content_tags ct
      JOIN community_tags t ON ct.tag_id = t.tag_id
      WHERE ct.content_id = $1`,
      [content_id]
    );

    // 增加浏览量
    await client.query(
      'UPDATE community_content SET view_count = view_count + 1 WHERE content_id = $1',
      [content_id]
    );

    res.json({
      code: 200,
      message: '查询成功。',
      data: {
        ...content,
        author: {
          user_id: content.author_id,
          user_name: content.user_name || `用户${content.author_id}`,
          avatar: content.avatar || null
        },
        tags: tags.rows
      }
    });
  } catch (error) {
    console.error('获取内容详情失败:', error);
    res.status(500).json({
      code: 500,
      message: '查询失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// 3.4 发布评论
exports.createComment = async (req, res) => {
  const client = await db.connect();
  try {
    const { content_id } = req.params;
    const { parent_id = 0, comment_text } = req.body;
    const commenter_id = req.user.user_id;

    const result = await client.query(
      `INSERT INTO community_comments 
      (content_id, commenter_id, parent_id, comment_text, audit_status) 
      VALUES ($1, $2, $3, $4, 1) RETURNING comment_id`,
      [content_id, commenter_id, parent_id, comment_text]
    );

    // 更新内容评论数
    await client.query(
      'UPDATE community_content SET comment_count = comment_count + 1 WHERE content_id = $1',
      [content_id]
    );

    res.status(201).json({
      code: 201,
      message: '评论成功。',
      data: {
        comment_id: result.rows[0].comment_id,
        user_info: {
          user_id: req.user.user_id,
          user_name: req.user.user_name
        },
        comment_text
      }
    });
  } catch (error) {
    console.error('发布评论失败:', error);
    res.status(500).json({
      code: 500,
      message: '评论失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// 3.5 点赞内容
exports.likeContent = async (req, res) => {
  const client = await db.connect();
  try {
    const { content_id } = req.params;
    const user_id = req.user.user_id;

    // 检查是否已点赞
    const existing = await client.query(
      'SELECT * FROM community_likes WHERE content_id = $1 AND user_id = $2',
      [content_id, user_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        code: 400,
        message: '已经点赞过'
      });
    }

    await client.query(
      'INSERT INTO community_likes (content_id, user_id) VALUES ($1, $2)',
      [content_id, user_id]
    );

    await client.query(
      'UPDATE community_content SET like_count = like_count + 1 WHERE content_id = $1',
      [content_id]
    );

    const content = await client.query(
      'SELECT like_count FROM community_content WHERE content_id = $1',
      [content_id]
    );

    res.json({
      code: 200,
      message: '操作成功。',
      data: {
        current_like_count: content.rows[0].like_count
      }
    });
  } catch (error) {
    console.error('点赞失败:', error);
    res.status(500).json({
      code: 500,
      message: '操作失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// 取消点赞内容
exports.unlikeContent = async (req, res) => {
  const client = await db.connect();
  try {
    const { content_id } = req.params;
    const user_id = req.user.user_id;

    const result = await client.query(
      'DELETE FROM community_likes WHERE content_id = $1 AND user_id = $2',
      [content_id, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({
        code: 400,
        message: '未点赞过'
      });
    }

    await client.query(
      'UPDATE community_content SET like_count = like_count - 1 WHERE content_id = $1',
      [content_id]
    );

    res.status(204).send();
  } catch (error) {
    console.error('取消点赞失败:', error);
    res.status(500).json({
      code: 500,
      message: '操作失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// 3.6 收藏内容
exports.collectContent = async (req, res) => {
  const client = await db.connect();
  try {
    const { content_id } = req.params;
    const user_id = req.user.user_id;

    const existing = await client.query(
      'SELECT * FROM community_collects WHERE content_id = $1 AND user_id = $2',
      [content_id, user_id]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({
        code: 400,
        message: '已经收藏过'
      });
    }

    await client.query(
      'INSERT INTO community_collects (content_id, user_id) VALUES ($1, $2)',
      [content_id, user_id]
    );

    await client.query(
      'UPDATE community_content SET collect_count = collect_count + 1 WHERE content_id = $1',
      [content_id]
    );

    const content = await client.query(
      'SELECT collect_count FROM community_content WHERE content_id = $1',
      [content_id]
    );

    res.json({
      code: 200,
      message: '操作成功。',
      data: {
        current_collect_count: content.rows[0].collect_count
      }
    });
  } catch (error) {
    console.error('收藏失败:', error);
    res.status(500).json({
      code: 500,
      message: '操作失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// 取消收藏内容
exports.uncollectContent = async (req, res) => {
  const client = await db.connect();
  try {
    const { content_id } = req.params;
    const user_id = req.user.user_id;

    const result = await client.query(
      'DELETE FROM community_collects WHERE content_id = $1 AND user_id = $2',
      [content_id, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({
        code: 400,
        message: '未收藏过'
      });
    }

    await client.query(
      'UPDATE community_content SET collect_count = collect_count - 1 WHERE content_id = $1',
      [content_id]
    );

    res.status(204).send();
  } catch (error) {
    console.error('取消收藏失败:', error);
    res.status(500).json({
      code: 500,
      message: '操作失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};
