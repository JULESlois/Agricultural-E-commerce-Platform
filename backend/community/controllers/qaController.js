const { Content, QARelation, Comment, sequelize } = require('../models');
const { success, error: errorResponse } = require('../utils/response');

// 5.2 采纳最佳答案
exports.adoptBestAnswer = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { content_id } = req.params;
    const { comment_id } = req.body;
    const user_id = req.user.user_id;

    // 验证内容是否存在且为问题类型
    const content = await Content.findOne({
      where: { 
        content_id,
        content_type: 3  // 问题类型
      },
      transaction
    });

    if (!content) {
      await transaction.rollback();
      return errorResponse(res, '问题不存在', 404);
    }

    // 验证是否为问题发布者
    if (content.author_id !== user_id) {
      await transaction.rollback();
      return errorResponse(res, '只有问题发布者才能采纳答案。', 403);
    }

    // 验证评论是否存在
    const comment = await Comment.findOne({
      where: { comment_id, content_id },
      transaction
    });

    if (!comment) {
      await transaction.rollback();
      return errorResponse(res, '指定的评论不存在。', 404);
    }

    // 检查是否已有问答记录
    let qaRelation = await QARelation.findOne({
      where: { content_id },
      transaction
    });

    let reward_status = 0;
    let reward_time = null;

    if (qaRelation) {
      // 更新现有记录
      qaRelation.best_comment_id = comment_id;
      qaRelation.qa_status = 1;
      qaRelation.resolve_time = new Date();

      // 如果有悬赏，发放奖励
      if (parseFloat(qaRelation.reward_amount) > 0) {
        qaRelation.reward_status = 2;
        qaRelation.reward_time = new Date();
        reward_status = 2;
        reward_time = qaRelation.reward_time;
        
        // TODO: 调用财务模块API发放奖励
      }

      await qaRelation.save({ transaction });
    } else {
      // 创建新记录
      qaRelation = await QARelation.create({
        content_id,
        best_comment_id: comment_id,
        qa_status: 1,
        resolve_time: new Date()
      }, { transaction });
    }

    await transaction.commit();

    success(res, {
      qa_id: qaRelation.qa_id,
      content_id: parseInt(content_id),
      best_comment_id: comment_id,
      qa_status: 1,
      reward_status,
      reward_amount: qaRelation.reward_amount,
      reward_time
    }, '已成功采纳为最佳答案。');
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

// 5.3 取消最佳答案
exports.cancelBestAnswer = async (req, res, next) => {
  try {
    const { content_id } = req.params;
    const user_id = req.user.user_id;

    // 验证内容是否存在且为问题类型
    const content = await Content.findOne({
      where: { 
        content_id,
        content_type: 3
      }
    });

    if (!content) {
      return errorResponse(res, '问题不存在', 404);
    }

    // 验证是否为问题发布者
    if (content.author_id !== user_id) {
      return errorResponse(res, '只有问题发布者才能取消最佳答案。', 403);
    }

    // 检查问答记录
    const qaRelation = await QARelation.findOne({
      where: { content_id }
    });

    if (!qaRelation || !qaRelation.best_comment_id) {
      return errorResponse(res, '该问题当前未设置最佳答案。', 404);
    }

    // 检查奖励是否已发放
    if (qaRelation.reward_status === 2) {
      return errorResponse(res, '悬赏奖励已发放，无法取消最佳答案。', 400);
    }

    // 取消最佳答案
    qaRelation.best_comment_id = null;
    qaRelation.qa_status = 0;
    qaRelation.resolve_time = null;
    await qaRelation.save();

    success(res, null, '已取消最佳答案，问题已重新开放。');
  } catch (err) {
    next(err);
  }
};

module.exports = exports;
