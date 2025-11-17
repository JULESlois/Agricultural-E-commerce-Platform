/**
 * 内容控制器 - 重构版本（使用 Sequelize）
 * 这是升级后的版本，展示如何使用 ORM 和统一的架构
 */

const { Content, Comment, Category, Like, Collect, Tag, ContentTag, sequelize } = require('../models');
const { success, created, notFound, badRequest, error: errorResponse } = require('../utils/response');
const { Op } = require('sequelize');

// 3.1 发布社区内容
exports.createContent = async (req, res, next) => {
  try {
    const { category_id, content_type, content_title, content_text, content_cover, tag_ids, reward_amount } = req.body;
    const author_id = req.user.user_id;

    // 使用 Sequelize 创建内容
    const content = await Content.create({
      author_id,
      category_id,
      content_type,
      content_title,
      content_text,
      content_cover: content_cover || null,
      audit_status: 0 // 待审核
    });

    // TODO: 处理标签关联和问答悬赏（需要创建对应的模型）

    return created(res, {
      content_id: content.content_id
    }, '内容发布成功，等待审核。');
  } catch (error) {
    next(error);
  }
};

// 3.2 获取内容列表
exports.getContentList = async (req, res, next) => {
  try {
    const { category_id, content_type, sort = 'latest', page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;

    // 构建查询条件
    const where = {
      audit_status: 1, // 已审核通过
      is_deleted: 0    // 未删除
    };

    if (category_id) {
      where.category_id = category_id;
    }

    if (content_type) {
      where.content_type = content_type;
    }

    // 构建排序规则
    let order;
    if (sort === 'hot') {
      // 热度排序：综合浏览、点赞、评论数
      order = [
        [
          sequelize.literal('(view_count + like_count * 2 + comment_count * 3)'),
          'DESC'
        ]
      ];
    } else {
      // 最新排序（latest）
      order = [['create_time', 'DESC']];
    }

    // 查询内容列表
    const { count, rows } = await Content.findAndCountAll({
      where,
      attributes: [
        'content_id',
        'content_title',
        'content_cover',
        'author_id',
        'view_count',
        'like_count',
        'comment_count'
      ],
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['category_name']
        }
      ],
      order,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    // 格式化响应数据（按照 API 文档格式）
    const formattedData = rows.map(content => ({
      content_id: content.content_id,
      content_title: content.content_title,
      content_cover: content.content_cover,
      author: {
        user_id: content.author_id,
        user_name: `用户${content.author_id}`,  // TODO: 关联用户表获取真实用户名
        avatar: null  // TODO: 关联用户表获取头像
      },
      view_count: content.view_count,
      like_count: content.like_count,
      comment_count: content.comment_count
    }));

    return success(res, formattedData, '查询成功。');
  } catch (error) {
    next(error);
  }
};

// 3.3 获取内容详情
exports.getContentDetail = async (req, res, next) => {
  try {
    const { content_id } = req.params;

    // 查询内容详情
    const content = await Content.findOne({
      where: {
        content_id,
        is_deleted: 0
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['category_id', 'category_name']
        }
      ]
    });

    if (!content) {
      return notFound(res, '内容不存在');
    }

    // 增加浏览量
    await content.increment('view_count');

    // TODO: 获取标签信息

    return success(res, {
      ...content.toJSON(),
      author: {
        user_id: content.author_id,
        user_name: `用户${content.author_id}` // TODO: 关联用户表
      }
    }, '查询成功。');
  } catch (error) {
    next(error);
  }
};

// 获取评论列表
exports.getComments = async (req, res, next) => {
  try {
    const { content_id } = req.params;

    // 验证内容是否存在
    const content = await Content.findByPk(content_id);
    if (!content) {
      return notFound(res, '内容不存在');
    }

    // 获取所有评论（包括回复）
    const comments = await Comment.findAll({
      where: {
        content_id,
        is_deleted: 0
      },
      order: [['create_time', 'DESC']],
      attributes: [
        'comment_id',
        'content_id',
        'parent_id',
        'commenter_id',
        'comment_text',
        'like_count',
        'create_time'
      ]
    });

    // 格式化评论数据
    const formattedComments = comments.map(comment => ({
      comment_id: comment.comment_id,
      content_id: comment.content_id,
      parent_id: comment.parent_id,
      user_info: {
        user_id: comment.commenter_id,
        user_name: `用户${comment.commenter_id}` // TODO: 关联用户表
      },
      comment_text: comment.comment_text,
      like_count: comment.like_count,
      create_time: comment.create_time
    }));

    return success(res, formattedComments, '查询成功。');
  } catch (error) {
    next(error);
  }
};

// 3.4 发布评论
exports.createComment = async (req, res, next) => {
  try {
    const { content_id } = req.params;
    const { parent_id = 0, comment_text } = req.body;
    const commenter_id = req.user.user_id;

    // 验证内容是否存在
    const content = await Content.findByPk(content_id);
    if (!content) {
      return notFound(res, '内容不存在');
    }

    // 创建评论
    const comment = await Comment.create({
      content_id,
      commenter_id,
      parent_id,
      comment_text,
      audit_status: 1 // 自动通过审核
    });

    // 更新内容评论数
    await content.increment('comment_count');

    return created(res, {
      comment_id: comment.comment_id,
      user_info: {
        user_id: req.user.user_id,
        user_name: req.user.user_name
      },
      comment_text
    }, '评论成功。');
  } catch (error) {
    next(error);
  }
};

// 3.5 点赞内容
exports.likeContent = async (req, res, next) => {
  try {
    const { content_id } = req.params;
    const user_id = req.user.user_id;

    // 检查内容是否存在
    const content = await Content.findByPk(content_id);
    if (!content) {
      return notFound(res, '内容不存在');
    }

    // 检查是否已点赞
    const existingLike = await Like.findOne({
      where: { content_id, user_id }
    });

    if (existingLike) {
      return errorResponse(res, '已经点赞过了', 400);
    }

    // 创建点赞记录
    await Like.create({ content_id, user_id });

    // 更新点赞数
    await content.increment('like_count');
    await content.reload();

    return success(res, {
      current_like_count: content.like_count
    }, '操作成功。');
  } catch (error) {
    next(error);
  }
};

// 取消点赞内容
exports.unlikeContent = async (req, res, next) => {
  try {
    const { content_id } = req.params;
    const user_id = req.user.user_id;

    // 检查内容是否存在
    const content = await Content.findByPk(content_id);
    if (!content) {
      return notFound(res, '内容不存在');
    }

    // 删除点赞记录
    const result = await Like.destroy({
      where: { content_id, user_id }
    });

    if (result === 0) {
      return errorResponse(res, '未找到点赞记录', 404);
    }

    // 更新点赞数
    await content.decrement('like_count');
    await content.reload();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

// 3.6 收藏内容
exports.collectContent = async (req, res, next) => {
  try {
    const { content_id } = req.params;
    const user_id = req.user.user_id;

    // 检查内容是否存在
    const content = await Content.findByPk(content_id);
    if (!content) {
      return notFound(res, '内容不存在');
    }

    // 检查是否已收藏
    const existingCollect = await Collect.findOne({
      where: { content_id, user_id }
    });

    if (existingCollect) {
      return errorResponse(res, '已经收藏过了', 400);
    }

    // 创建收藏记录
    await Collect.create({ content_id, user_id });

    // 更新收藏数
    await content.increment('collect_count');
    await content.reload();

    return success(res, {
      current_collect_count: content.collect_count
    }, '操作成功。');
  } catch (error) {
    next(error);
  }
};

// 取消收藏内容
exports.uncollectContent = async (req, res, next) => {
  try {
    const { content_id } = req.params;
    const user_id = req.user.user_id;

    // 检查内容是否存在
    const content = await Content.findByPk(content_id);
    if (!content) {
      return notFound(res, '内容不存在');
    }

    // 删除收藏记录
    const result = await Collect.destroy({
      where: { content_id, user_id }
    });

    if (result === 0) {
      return errorResponse(res, '未找到收藏记录', 404);
    }

    // 更新收藏数
    await content.decrement('collect_count');
    await content.reload();

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};