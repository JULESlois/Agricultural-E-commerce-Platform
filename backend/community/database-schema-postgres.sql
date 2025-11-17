-- 社区模块数据库表结构 (PostgreSQL)

-- 1. 关注关系表
CREATE TABLE IF NOT EXISTS community_follows (
  follow_id SERIAL PRIMARY KEY,
  follower_id INTEGER NOT NULL,
  followed_id INTEGER NOT NULL,
  follow_source SMALLINT DEFAULT 1,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_follower_followed UNIQUE (follower_id, followed_id)
);

CREATE INDEX IF NOT EXISTS idx_follows_follower ON community_follows(follower_id);
CREATE INDEX IF NOT EXISTS idx_follows_followed ON community_follows(followed_id);

COMMENT ON TABLE community_follows IS '用户关注关系表';
COMMENT ON COLUMN community_follows.follower_id IS '关注者用户ID';
COMMENT ON COLUMN community_follows.followed_id IS '被关注者用户ID';
COMMENT ON COLUMN community_follows.follow_source IS '关注来源：1=主动关注';

-- 2. 黑名单表
CREATE TABLE IF NOT EXISTS community_blacklist (
  black_id SERIAL PRIMARY KEY,
  blocker_id INTEGER NOT NULL,
  blacked_user_id INTEGER NOT NULL,
  black_reason VARCHAR(500),
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_blocker_blacked UNIQUE (blocker_id, blacked_user_id)
);

CREATE INDEX IF NOT EXISTS idx_blacklist_blocker ON community_blacklist(blocker_id);

COMMENT ON TABLE community_blacklist IS '用户黑名单表';
COMMENT ON COLUMN community_blacklist.blocker_id IS '拉黑者用户ID';
COMMENT ON COLUMN community_blacklist.blacked_user_id IS '被拉黑用户ID';
COMMENT ON COLUMN community_blacklist.black_reason IS '拉黑原因';

-- 3. 内容分类表
CREATE TABLE IF NOT EXISTS community_categories (
  category_id SERIAL PRIMARY KEY,
  parent_id INTEGER DEFAULT 0,
  category_name VARCHAR(100) NOT NULL,
  category_desc VARCHAR(500),
  sort_order INTEGER DEFAULT 0,
  is_enabled SMALLINT DEFAULT 1,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_categories_parent ON community_categories(parent_id);
CREATE INDEX IF NOT EXISTS idx_categories_enabled ON community_categories(is_enabled);

COMMENT ON TABLE community_categories IS '内容分类表';
COMMENT ON COLUMN community_categories.parent_id IS '父分类ID，0表示顶级分类';
COMMENT ON COLUMN community_categories.category_name IS '分类名称';
COMMENT ON COLUMN community_categories.category_desc IS '分类描述';
COMMENT ON COLUMN community_categories.sort_order IS '排序';
COMMENT ON COLUMN community_categories.is_enabled IS '是否启用：0=禁用，1=启用';

-- 创建更新时间触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_time = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为分类表添加更新时间触发器
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON community_categories
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 4. 标签表
CREATE TABLE IF NOT EXISTS community_tags (
  tag_id SERIAL PRIMARY KEY,
  tag_name VARCHAR(50) NOT NULL,
  use_count INTEGER DEFAULT 0,
  is_enabled SMALLINT DEFAULT 1,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_tag_name UNIQUE (tag_name)
);

CREATE INDEX IF NOT EXISTS idx_tags_enabled ON community_tags(is_enabled);

COMMENT ON TABLE community_tags IS '标签表';
COMMENT ON COLUMN community_tags.tag_name IS '标签名称';
COMMENT ON COLUMN community_tags.use_count IS '使用次数';
COMMENT ON COLUMN community_tags.is_enabled IS '是否启用';

-- 5. 内容主表
CREATE TABLE IF NOT EXISTS community_content (
  content_id SERIAL PRIMARY KEY,
  author_id INTEGER NOT NULL,
  category_id INTEGER NOT NULL,
  content_type SMALLINT NOT NULL,
  content_title VARCHAR(200) NOT NULL,
  content_text TEXT NOT NULL,
  content_cover VARCHAR(500),
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  collect_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  audit_status SMALLINT DEFAULT 0,
  is_deleted SMALLINT DEFAULT 0,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_content_author ON community_content(author_id);
CREATE INDEX IF NOT EXISTS idx_content_category ON community_content(category_id);
CREATE INDEX IF NOT EXISTS idx_content_type ON community_content(content_type);
CREATE INDEX IF NOT EXISTS idx_content_audit ON community_content(audit_status);
CREATE INDEX IF NOT EXISTS idx_content_create_time ON community_content(create_time);

COMMENT ON TABLE community_content IS '社区内容表';
COMMENT ON COLUMN community_content.author_id IS '作者用户ID';
COMMENT ON COLUMN community_content.category_id IS '分类ID';
COMMENT ON COLUMN community_content.content_type IS '内容类型：1=经验分享，2=求助，3=问题咨询';
COMMENT ON COLUMN community_content.content_title IS '标题';
COMMENT ON COLUMN community_content.content_text IS '内容正文';
COMMENT ON COLUMN community_content.content_cover IS '封面图';
COMMENT ON COLUMN community_content.view_count IS '浏览量';
COMMENT ON COLUMN community_content.like_count IS '点赞数';
COMMENT ON COLUMN community_content.comment_count IS '评论数';
COMMENT ON COLUMN community_content.collect_count IS '收藏数';
COMMENT ON COLUMN community_content.share_count IS '分享数';
COMMENT ON COLUMN community_content.audit_status IS '审核状态：0=待审核，1=已通过，2=未通过';
COMMENT ON COLUMN community_content.is_deleted IS '是否删除：0=否，1=是';

-- 为内容表添加更新时间触发器
CREATE TRIGGER update_content_updated_at BEFORE UPDATE ON community_content
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. 内容标签关联表
CREATE TABLE IF NOT EXISTS community_content_tags (
  id SERIAL PRIMARY KEY,
  content_id INTEGER NOT NULL,
  tag_id INTEGER NOT NULL,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_content_tag UNIQUE (content_id, tag_id)
);

CREATE INDEX IF NOT EXISTS idx_content_tags_tag ON community_content_tags(tag_id);

COMMENT ON TABLE community_content_tags IS '内容标签关联表';
COMMENT ON COLUMN community_content_tags.content_id IS '内容ID';
COMMENT ON COLUMN community_content_tags.tag_id IS '标签ID';

-- 7. 评论表
CREATE TABLE IF NOT EXISTS community_comments (
  comment_id SERIAL PRIMARY KEY,
  content_id INTEGER NOT NULL,
  commenter_id INTEGER NOT NULL,
  parent_id INTEGER DEFAULT 0,
  comment_text TEXT NOT NULL,
  like_count INTEGER DEFAULT 0,
  audit_status SMALLINT DEFAULT 1,
  is_deleted SMALLINT DEFAULT 0,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_comments_content ON community_comments(content_id);
CREATE INDEX IF NOT EXISTS idx_comments_commenter ON community_comments(commenter_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent ON community_comments(parent_id);

COMMENT ON TABLE community_comments IS '评论表';
COMMENT ON COLUMN community_comments.content_id IS '内容ID';
COMMENT ON COLUMN community_comments.commenter_id IS '评论者用户ID';
COMMENT ON COLUMN community_comments.parent_id IS '父评论ID，0表示对内容的评论';
COMMENT ON COLUMN community_comments.comment_text IS '评论内容';
COMMENT ON COLUMN community_comments.like_count IS '点赞数';
COMMENT ON COLUMN community_comments.audit_status IS '审核状态：0=待审核，1=已通过，2=未通过';
COMMENT ON COLUMN community_comments.is_deleted IS '是否删除';

-- 8. 点赞表
CREATE TABLE IF NOT EXISTS community_likes (
  like_id SERIAL PRIMARY KEY,
  content_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_likes_content_user UNIQUE (content_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_user ON community_likes(user_id);

COMMENT ON TABLE community_likes IS '点赞表';
COMMENT ON COLUMN community_likes.content_id IS '内容ID';
COMMENT ON COLUMN community_likes.user_id IS '用户ID';

-- 9. 收藏表
CREATE TABLE IF NOT EXISTS community_collects (
  collect_id SERIAL PRIMARY KEY,
  content_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_collects_content_user UNIQUE (content_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_collects_user ON community_collects(user_id);

COMMENT ON TABLE community_collects IS '收藏表';
COMMENT ON COLUMN community_collects.content_id IS '内容ID';
COMMENT ON COLUMN community_collects.user_id IS '用户ID';

-- 10. 举报表
CREATE TABLE IF NOT EXISTS community_reports (
  report_id SERIAL PRIMARY KEY,
  report_no VARCHAR(50) NOT NULL,
  reporter_id INTEGER NOT NULL,
  report_type SMALLINT NOT NULL,
  report_obj_id INTEGER NOT NULL,
  report_reason SMALLINT NOT NULL,
  report_detail TEXT,
  report_evidence TEXT,
  is_anonymous SMALLINT DEFAULT 0,
  audit_status SMALLINT DEFAULT 0,
  auditor_id INTEGER,
  audit_time TIMESTAMP,
  audit_remark VARCHAR(500),
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_report_no UNIQUE (report_no)
);

CREATE INDEX IF NOT EXISTS idx_reports_reporter ON community_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_type_obj ON community_reports(report_type, report_obj_id);
CREATE INDEX IF NOT EXISTS idx_reports_audit_status ON community_reports(audit_status);

COMMENT ON TABLE community_reports IS '举报表';
COMMENT ON COLUMN community_reports.report_no IS '举报编号';
COMMENT ON COLUMN community_reports.reporter_id IS '举报者用户ID';
COMMENT ON COLUMN community_reports.report_type IS '举报类型：1=内容，2=评论，3=用户';
COMMENT ON COLUMN community_reports.report_obj_id IS '被举报对象ID';
COMMENT ON COLUMN community_reports.report_reason IS '举报原因：1=违法违规，2=广告营销，3=不实信息';
COMMENT ON COLUMN community_reports.report_detail IS '举报详情';
COMMENT ON COLUMN community_reports.report_evidence IS '举报证据（JSON数组）';
COMMENT ON COLUMN community_reports.is_anonymous IS '是否匿名举报';
COMMENT ON COLUMN community_reports.audit_status IS '审核状态：0=待处理，1=已立案，2=不予立案';
COMMENT ON COLUMN community_reports.auditor_id IS '审核人ID';
COMMENT ON COLUMN community_reports.audit_time IS '审核时间';
COMMENT ON COLUMN community_reports.audit_remark IS '审核备注';

-- 11. 违规记录表
CREATE TABLE IF NOT EXISTS community_violations (
  violation_id SERIAL PRIMARY KEY,
  report_id INTEGER,
  violator_id INTEGER NOT NULL,
  violation_type SMALLINT NOT NULL,
  violation_obj_id INTEGER NOT NULL,
  handle_measure SMALLINT NOT NULL,
  handle_remark VARCHAR(500),
  handler_id INTEGER NOT NULL,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_violations_violator ON community_violations(violator_id);
CREATE INDEX IF NOT EXISTS idx_violations_report ON community_violations(report_id);

COMMENT ON TABLE community_violations IS '违规记录表';
COMMENT ON COLUMN community_violations.report_id IS '关联的举报ID';
COMMENT ON COLUMN community_violations.violator_id IS '违规者用户ID';
COMMENT ON COLUMN community_violations.violation_type IS '违规类型：1=内容违规，2=评论违规，3=用户违规';
COMMENT ON COLUMN community_violations.violation_obj_id IS '违规对象ID';
COMMENT ON COLUMN community_violations.handle_measure IS '处理措施：1=删除内容，2=警告，3=禁言，4=封号';
COMMENT ON COLUMN community_violations.handle_remark IS '处理说明';
COMMENT ON COLUMN community_violations.handler_id IS '处理人ID';

-- 12. 问答关系表
CREATE TABLE IF NOT EXISTS community_qa_relation (
  qa_id SERIAL PRIMARY KEY,
  content_id INTEGER NOT NULL,
  best_comment_id INTEGER,
  qa_status SMALLINT DEFAULT 0,
  resolve_time TIMESTAMP,
  reward_amount DECIMAL(10,2) DEFAULT 0.00,
  reward_status SMALLINT DEFAULT 0,
  reward_time TIMESTAMP,
  create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uk_qa_content UNIQUE (content_id)
);

CREATE INDEX IF NOT EXISTS idx_qa_status ON community_qa_relation(qa_status);

COMMENT ON TABLE community_qa_relation IS '问答关系表';
COMMENT ON COLUMN community_qa_relation.content_id IS '问题内容ID';
COMMENT ON COLUMN community_qa_relation.best_comment_id IS '最佳答案评论ID';
COMMENT ON COLUMN community_qa_relation.qa_status IS '问答状态：0=待解决，1=已解决';
COMMENT ON COLUMN community_qa_relation.resolve_time IS '解决时间';
COMMENT ON COLUMN community_qa_relation.reward_amount IS '悬赏金额';
COMMENT ON COLUMN community_qa_relation.reward_status IS '悬赏状态：0=未设置，1=待发放，2=已发放';
COMMENT ON COLUMN community_qa_relation.reward_time IS '奖励发放时间';

-- 为问答关系表添加更新时间触发器
CREATE TRIGGER update_qa_updated_at BEFORE UPDATE ON community_qa_relation
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入示例分类数据
INSERT INTO community_categories (category_id, parent_id, category_name, category_desc, sort_order) VALUES
(1, 0, '种植技术', '农作物种植相关技术交流', 1),
(101, 1, '小麦种植', '小麦种植技术与经验分享', 1),
(102, 1, '水稻种植', '水稻种植技术与经验分享', 2),
(2, 0, '养殖技术', '畜牧养殖相关技术交流', 2),
(201, 2, '家禽养殖', '鸡鸭鹅等家禽养殖技术', 1),
(3, 0, '市场行情', '农产品市场价格与行情讨论', 3),
(301, 3, '粮食价格', '粮食作物价格行情', 1)
ON CONFLICT (category_id) DO NOTHING;

-- 更新序列
SELECT setval('community_categories_category_id_seq', (SELECT MAX(category_id) FROM community_categories));

-- 插入示例标签数据
INSERT INTO community_tags (tag_name) VALUES
('小麦种植'),
('病虫害防治'),
('施肥技术'),
('灌溉管理'),
('冬小麦')
ON CONFLICT (tag_name) DO NOTHING;
