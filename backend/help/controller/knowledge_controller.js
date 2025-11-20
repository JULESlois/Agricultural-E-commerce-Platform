const db = require('../config/database');
const { successResponse, errorResponse } = require('../utils/response');

// 4.1 获取知识类型树
exports.getKnowledgeTypesTree = async (req, res) => {
    try {
        const result = await db.query(`
      SELECT type_id, type_name, type_code, parent_id, type_icon, sort 
      FROM expert_knowledge_type 
      WHERE status = 1 
      ORDER BY sort ASC, type_id ASC
    `);

        const types = result.rows;

        const buildTree = (items, parentId = 0) => {
            return items
                .filter(item => item.parent_id === parentId)
                .map(item => ({
                    type_id: item.type_id,
                    type_name: item.type_name,
                    type_code: item.type_code,
                    type_icon: item.type_icon,
                    children: buildTree(items, item.type_id)
                }));
        };

        return successResponse(res, 200, '查询成功。', buildTree(types));
    } catch (error) {
        console.error('获取知识类型树失败:', error);
        return errorResponse(res, 500, '服务器错误');
    }
};

// 4.2 专家发布知识库文章
exports.createArticle = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const {
            type_id,
            article_title,
            article_cover,
            article_summary,
            article_content,
            content_source,
            source_consult_id,
            reference_url,
            tags
        } = req.body;

        const expert_id = req.expert.expert_id;
        const article_no = `KNL${new Date().toISOString().slice(0, 10).replace(/-/g, '')}${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;

        // PostgreSQL 使用 RETURNING 获取插入的ID
        const result = await connection.query(`
      INSERT INTO expert_knowledge_article (
        article_no, type_id, expert_id, article_title, 
        article_cover, article_summary, article_content,
        content_source, source_consult_id, reference_url, tags,
        audit_status, article_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, 0, 1)
      RETURNING article_id
    `, [
            article_no, type_id, expert_id, article_title,
            article_cover, article_summary, article_content,
            content_source, source_consult_id, reference_url, tags
        ]);

        // 更新专家知识库统计
        await connection.query(
            'UPDATE expert_info SET knowledge_count = knowledge_count + 1 WHERE expert_id = $1',
            [expert_id]
        );

        await connection.commit();

        return successResponse(res, 201, '文章发布成功，等待审核。', {
            article_id: result.rows[0].article_id,
            article_no: article_no
        });
    } catch (error) {
        await connection.rollback();
        console.error('发布文章失败:', error);
        return errorResponse(res, 500, '服务器错误');
    } finally {
        connection.release();
    }
};

// 4.3 搜索/浏览知识库文章列表
exports.getArticleList = async (req, res) => {
    try {
        const { type_id, keyword, page = 1, pageSize = 10 } = req.query;
        const offset = (page - 1) * pageSize;

        let whereConditions = ['a.audit_status = 1', 'a.article_status IN (1, 2, 3)'];
        let params = [];
        let paramIndex = 1;

        if (type_id) {
            whereConditions.push(`a.type_id = $${paramIndex++}`);
            params.push(type_id);
        }

        if (keyword) {
            const searchPattern = `%${keyword}%`;
            whereConditions.push(`(a.article_title ILIKE $${paramIndex} OR a.article_summary ILIKE $${paramIndex + 1} OR a.tags ILIKE $${paramIndex + 2})`);
            params.push(searchPattern, searchPattern, searchPattern);
            paramIndex += 3;
        }

        const whereClause = whereConditions.join(' AND ');

        // 获取总数
        const countResult = await db.query(
            `SELECT COUNT(*) as total FROM expert_knowledge_article a WHERE ${whereClause}`,
            params
        );

        // 获取列表
        params.push(parseInt(pageSize), offset);
        const articlesResult = await db.query(`
      SELECT 
        a.article_id,
        a.article_title,
        a.article_cover,
        a.article_summary,
        e.expert_name,
        a.view_count,
        a.like_count,
        a.collect_count,
        a.create_time
      FROM expert_knowledge_article a
      LEFT JOIN expert_info e ON a.expert_id = e.expert_id
      WHERE ${whereClause}
      ORDER BY 
        CASE WHEN a.article_status = 2 THEN 0 ELSE 1 END,
        a.view_count DESC,
        a.create_time DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `, params);

        return successResponse(res, 200, '查询成功。', {
            total: parseInt(countResult.rows[0].total),
            list: articlesResult.rows
        });
    } catch (error) {
        console.error('获取文章列表失败:', error);
        return errorResponse(res, 500, '服务器错误');
    }
};

// 4.4 获取文章详情
exports.getArticleDetail = async (req, res) => {
    const connection = await db.getConnection();
    try {
        const { article_id } = req.params;

        const articlesResult = await connection.query(`
      SELECT 
        a.*,
        e.expert_name,
        e.expert_avatar,
        e.expert_title,
        t.type_name
      FROM expert_knowledge_article a
      LEFT JOIN expert_info e ON a.expert_id = e.expert_id
      LEFT JOIN expert_knowledge_type t ON a.type_id = t.type_id
      WHERE a.article_id = $1 AND a.audit_status = 1 AND a.article_status != 0
    `, [article_id]);

        if (articlesResult.rows.length === 0) {
            return errorResponse(res, 404, '文章不存在或未审核通过');
        }

        // 增加浏览量
        await connection.query(
            'UPDATE expert_knowledge_article SET view_count = view_count + 1 WHERE article_id = $1',
            [article_id]
        );

        // 更新专家文章总浏览量
        const article = articlesResult.rows[0];
        await connection.query(`
      UPDATE expert_info 
      SET knowledge_view_count = (
        SELECT COALESCE(SUM(view_count), 0)
        FROM expert_knowledge_article
        WHERE expert_id = $1
      )
      WHERE expert_id = $1
    `, [article.expert_id]);

        return successResponse(res, 200, '查询成功。', article);
    } catch (error) {
        console.error('获取文章详情失败:', error);
        return errorResponse(res, 500, '服务器错误');
    } finally {
        connection.release();
    }
};

// 4.5 收藏文章
exports.collectArticle = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { article_id, collect_folder, collect_remark } = req.body;
        const user_id = req.user.user_id;

        // 检查是否已收藏
        const existingResult = await connection.query(
            'SELECT * FROM expert_knowledge_collect WHERE user_id = $1 AND article_id = $2 AND collect_status = 1',
            [user_id, article_id]
        );

        if (existingResult.rows.length > 0) {
            await connection.rollback();
            return errorResponse(res, 409, '您已收藏过该文章');
        }

        // 检查是否曾经收藏后取消
        const cancelledResult = await connection.query(
            'SELECT * FROM expert_knowledge_collect WHERE user_id = $1 AND article_id = $2 AND collect_status = 0',
            [user_id, article_id]
        );

        if (cancelledResult.rows.length > 0) {
            // 恢复收藏
            await connection.query(`
        UPDATE expert_knowledge_collect 
        SET collect_status = 1, collect_time = NOW(), collect_folder = $1, collect_remark = $2, cancel_time = NULL
        WHERE user_id = $3 AND article_id = $4
      `, [collect_folder || '默认收藏夹', collect_remark, user_id, article_id]);
        } else {
            // 新增收藏
            await connection.query(`
        INSERT INTO expert_knowledge_collect (user_id, article_id, collect_folder, collect_remark, collect_status)
        VALUES ($1, $2, $3, $4, 1)
      `, [user_id, article_id, collect_folder || '默认收藏夹', collect_remark]);
        }

        // 更新文章收藏数
        await connection.query(
            'UPDATE expert_knowledge_article SET collect_count = collect_count + 1 WHERE article_id = $1',
            [article_id]
        );

        await connection.commit();
        return successResponse(res, 200, '操作成功。');
    } catch (error) {
        await connection.rollback();
        console.error('收藏文章失败:', error);
        return errorResponse(res, 500, '服务器错误');
    } finally {
        connection.release();
    }
};

// 4.6 取消收藏文章
exports.uncollectArticle = async (req, res) => {
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();

        const { article_id } = req.body;
        const user_id = req.user.user_id;

        const result = await connection.query(
            'UPDATE expert_knowledge_collect SET collect_status = 0, cancel_time = NOW() WHERE user_id = $1 AND article_id = $2 AND collect_status = 1',
            [user_id, article_id]
        );

        if (result.rowCount === 0) {
            await connection.rollback();
            return errorResponse(res, 404, '未找到收藏记录');
        }

        // 更新文章收藏数
        await connection.query(
            'UPDATE expert_knowledge_article SET collect_count = collect_count - 1 WHERE article_id = $1',
            [article_id]
        );

        await connection.commit();
        return successResponse(res, 200, '操作成功。');
    } catch (error) {
        await connection.rollback();
        console.error('取消收藏失败:', error);
        return errorResponse(res, 500, '服务器错误');
    } finally {
        connection.release();
    }
};