const db = require('../config/database');

// 5.2 采纳最佳答案
exports.adoptBestAnswer = async (req, res) => {
  const client = await db.connect();
  try {
    await client.query('BEGIN');

    const { content_id } = req.params;
    const { comment_id } = req.body;
    const user_id = req.user.user_id;

    // 验证内容是否存在且为问题类型
    const contents = await client.query(
      'SELECT * FROM community_content WHERE content_id = $1 AND content_type = 3',
      [content_id]
    );

    if (contents.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        code: 404,
        message: '操作失败。',
        error: '问题不存在'
      });
    }

    const content = contents.rows[0];

    // 验证是否为问题发布者
    if (content.author_id !== user_id) {
      await client.query('ROLLBACK');
      return res.status(403).json({
        code: 403,
        message: '操作失败。',
        error: '只有问题发布者才能采纳答案。'
      });
    }

    // 验证评论是否存在
    const comments = await client.query(
      'SELECT * FROM community_comments WHERE comment_id = $1 AND content_id = $2',
      [comment_id, content_id]
    );

    if (comments.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        code: 404,
        message: '操作失败。',
        error: '指定的评论不存在。'
      });
    }

    // 检查是否已有问答记录
    const qaRecords = await client.query(
      'SELECT * FROM community_qa_relation WHERE content_id = $1',
      [content_id]
    );

    let qa_id;
    let reward_amount = '0.00';
    let reward_status = 0;

    if (qaRecords.rows.length > 0) {
      // 更新现有记录
      qa_id = qaRecords.rows[0].qa_id;
      reward_amount = qaRecords.rows[0].reward_amount;

      await client.query(
        `UPDATE community_qa_relation 
        SET best_comment_id = $1, qa_status = 1, resolve_time = NOW()
        WHERE qa_id = $2`,
        [comment_id, qa_id]
      );

      // 如果有悬赏，发放奖励
      if (parseFloat(reward_amount) > 0) {
        await client.query(
          `UPDATE community_qa_relation 
          SET reward_status = 2, reward_time = NOW()
          WHERE qa_id = $1`,
          [qa_id]
        );
        reward_status = 2;

        // 这里可以调用财务模块API发放奖励
        // 暂时只更新状态
      }
    } else {
      // 创建新记录
      const result = await client.query(
        `INSERT INTO community_qa_relation 
        (content_id, best_comment_id, qa_status, resolve_time) 
        VALUES ($1, $2, 1, NOW()) RETURNING qa_id`,
        [content_id, comment_id]
      );
      qa_id = result.rows[0].qa_id;
    }

    await client.query('COMMIT');

    res.json({
      code: 200,
      message: '已成功采纳为最佳答案。',
      data: {
        qa_id,
        content_id: parseInt(content_id),
        best_comment_id: comment_id,
        qa_status: 1,
        reward_status,
        reward_amount,
        reward_time: reward_status === 2 ? new Date().toISOString() : null
      }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('采纳最佳答案失败:', error);
    res.status(500).json({
      code: 500,
      message: '操作失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};

// 5.3 取消最佳答案
exports.cancelBestAnswer = async (req, res) => {
  const client = await db.connect();
  try {
    const { content_id } = req.params;
    const user_id = req.user.user_id;

    // 验证内容是否存在且为问题类型
    const contents = await client.query(
      'SELECT * FROM community_content WHERE content_id = $1 AND content_type = 3',
      [content_id]
    );

    if (contents.rows.length === 0) {
      return res.status(404).json({
        code: 404,
        message: '操作失败。',
        error: '问题不存在'
      });
    }

    const content = contents.rows[0];

    // 验证是否为问题发布者
    if (content.author_id !== user_id) {
      return res.status(403).json({
        code: 403,
        message: '操作失败。',
        error: '只有问题发布者才能取消最佳答案。'
      });
    }

    // 检查问答记录
    const qaRecords = await client.query(
      'SELECT * FROM community_qa_relation WHERE content_id = $1',
      [content_id]
    );

    if (qaRecords.rows.length === 0 || !qaRecords.rows[0].best_comment_id) {
      return res.status(404).json({
        code: 404,
        message: '操作失败。',
        error: '该问题当前未设置最佳答案。'
      });
    }

    const qaRecord = qaRecords.rows[0];

    // 检查奖励是否已发放
    if (qaRecord.reward_status === 2) {
      return res.status(400).json({
        code: 400,
        message: '操作失败。',
        error: '悬赏奖励已发放，无法取消最佳答案。'
      });
    }

    // 取消最佳答案
    await client.query(
      `UPDATE community_qa_relation 
      SET best_comment_id = NULL, qa_status = 0, resolve_time = NULL
      WHERE qa_id = $1`,
      [qaRecord.qa_id]
    );

    res.json({
      code: 200,
      message: '已取消最佳答案，问题已重新开放。'
    });
  } catch (error) {
    console.error('取消最佳答案失败:', error);
    res.status(500).json({
      code: 500,
      message: '操作失败',
      error: error.message
    });
  } finally {
    client.release();
  }
};
