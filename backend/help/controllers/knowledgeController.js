const pool = require('../config/db');
const { success, fail } = require('../utils/response');

// 1.1 获取知识类型树
const getKnowledgeTypeTree = async (req, res) => {
    try {
        const result = await pool.query(`
      WITH RECURSIVE type_tree AS (
        SELECT type_id, type_name, parent_id, 0 as level
        FROM expert_knowledge_type
        WHERE parent_id IS NULL AND enabled = true
        UNION ALL
        SELECT t.type_id, t.type_name, t.parent_id, tt.level + 1
        FROM expert_knowledge_type t
        INNER JOIN type_tree tt ON t.parent_id = tt.type_id
        WHERE t.enabled = true
      )
      SELECT 
        type_id,
        type_name,
        array_agg(
          json_build_object('type_id', child.type_id, 'type_name', child.type_name, 'children', child.children)
        ) FILTER (WHERE child.type_id IS NOT NULL) as children
      FROM type_tree parent
      LEFT JOIN LATERAL (
        SELECT c.type_id, c.type_name,
               COALESCE((
                 SELECT array_agg(json_build_object('type_id', gc.type_id, 'type_name', gc.type_name, 'children', '[]'::json))
                 FROM expert_knowledge_type gc WHERE gc.parent_id = c.type_id
               ), '{}') as children
        FROM expert_knowledge_type c WHERE c.parent_id = parent.type_id
      ) child ON true
      WHERE parent.level = 0
      GROUP BY parent.type_id, parent.type_name
    `);

        const tree = result.rows.map(r => ({
            type_id: r.type_id,
            type_name: r.type_name,
            children: r.children || []
        }));

        success(res, 200, '查询成功。', tree);
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

// 1.2 专家发布文章
const createArticle = async (req, res) => {
    const {
        type_id, article_title, article_cover, article_summary,
        article_content, content_source, tags
    } = req.body;
    const expert_id = req.user.expert_id;

    try {
        const result = await pool.query(
            `INSERT INTO expert_knowledge_article 
       (expert_id, type_id, article_title, article_cover, article_summary, 
        article_content, content_source, tags, status, create_time)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,0,NOW())
       RETURNING article_id, 
                 to_char(create_time,'YYYYMMDD')||lpad(article_id::text,10,'0') as article_no`,
            [expert_id, type_id, article_title, article_cover, article_summary,
                article_content, content_source, tags]
        );
        const row = result.rows[0];
        success(res, 201, '文章发布成功，等待审核。', {
            article_id: row.article_id,
            article_no: 'KNL' + row.article_no
        });
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

// 1.3 搜索文章列表
const getArticleList = async (req, res) => {
    const { type_id, keyword, page = 1, page_size = 20 } = req.query;
    let where = 'WHERE a.status = 1'; // 已审核通过
    const params = [];
    let idx = 1;

    if (type_id) {
        params.push(type_id);
        where += ` AND a.type_id = $${idx++}`;
    }
    if (keyword) {
        params.push(`%${keyword}%`);
        where += ` AND (a.article_title ILIKE $${idx} OR a.article_summary ILIKE $${idx} OR a.tags ILIKE $${idx})`;
        idx++;
    }

    try {
        const totalRes = await pool.query(`SELECT COUNT(*) FROM expert_knowledge_article a ${where}`, params);
        const total = parseInt(totalRes.rows[0].count);

        params.push((page - 1) * page_size, parseInt(page_size));
        const listRes = await pool.query(`
      SELECT a.article_id, a.article_title, a.article_cover, a.article_summary,
             e.expert_name, a.view_count, a.like_count
      FROM expert_knowledge_article a
      LEFT JOIN expert_info e ON a.expert_id = e.expert_id
      ${where}
      ORDER BY a.create_time DESC
      LIMIT $${idx} OFFSET $${idx + 1}
    `, params);

        success(res, 200, '查询成功。', { total, list: listRes.rows });
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

// 1.4 获取文章详情
const getArticleDetail = async (req, res) => {
    const { article_id } = req.params;
    try {
        const result = await pool.query(`
      SELECT a.*, e.expert_name, e.expert_avatar
      FROM expert_knowledge_article a
      LEFT JOIN expert_info e ON a.expert_id = e.expert_id
      WHERE a.article_id = $1 AND a.status = 1
    `, [article_id]);

        if (result.rows.length === 0) return fail(res, 404, '文章不存在或未通过审核');

        // 浏览数+1
        await pool.query(`UPDATE expert_knowledge_article SET view_count = view_count + 1 WHERE article_id = $1`, [article_id]);

        success(res, 200, '查询成功。', result.rows[0]);
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

// 1.5 收藏/取消收藏
const toggleCollect = async (req, res) => {
    const { article_id, collect_folder } = req.body;
    const user_id = req.user.user_id;

    try {
        const exist = await pool.query(
            `SELECT 1 FROM expert_knowledge_collect WHERE user_id = $1 AND article_id = $2`,
            [user_id, article_id]
        );

        if (exist.rows.length > 0) {
            // 取消收藏
            await pool.query(
                `DELETE FROM expert_knowledge_collect WHERE user_id = $1 AND article_id = $2`,
                [user_id, article_id]
            );
            success(res, 200, '已取消收藏');
        } else {
            // 收藏
            await pool.query(
                `INSERT INTO expert_knowledge_collect (user_id, article_id, collect_folder, collect_time)
         VALUES ($1, $2, $3, NOW())`,
                [user_id, article_id, collect_folder || '']
            );
            success(res, 200, '收藏成功');
        }
    } catch (err) {
        console.error(err);
        fail(res, 500, '服务器错误');
    }
};

module.exports = {
    getKnowledgeTypeTree,
    createArticle,
    getArticleList,
    getArticleDetail,
    toggleCollect
};