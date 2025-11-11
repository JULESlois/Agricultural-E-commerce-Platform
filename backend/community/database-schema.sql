-- 社区模块数据库表结构

-- 1. 关注关系表
CREATE TABLE IF NOT EXISTS `community_follows` (
  `follow_id` INT AUTO_INCREMENT PRIMARY KEY,
  `follower_id` INT NOT NULL COMMENT '关注者用户ID',
  `followed_id` INT NOT NULL COMMENT '被关注者用户ID',
  `follow_source` TINYINT DEFAULT 1 COMMENT '关注来源：1=主动关注',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_follower_followed` (`follower_id`, `followed_id`),
  KEY `idx_follower` (`follower_id`),
  KEY `idx_followed` (`followed_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户关注关系表';

-- 2. 黑名单表
CREATE TABLE IF NOT EXISTS `community_blacklist` (
  `black_id` INT AUTO_INCREMENT PRIMARY KEY,
  `blocker_id` INT NOT NULL COMMENT '拉黑者用户ID',
  `blacked_user_id` INT NOT NULL COMMENT '被拉黑用户ID',
  `black_reason` VARCHAR(500) COMMENT '拉黑原因',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_blocker_blacked` (`blocker_id`, `blacked_user_id`),
  KEY `idx_blocker` (`blocker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户黑名单表';

-- 3. 内容分类表
CREATE TABLE IF NOT EXISTS `community_categories` (
  `category_id` INT AUTO_INCREMENT PRIMARY KEY,
  `parent_id` INT DEFAULT 0 COMMENT '父分类ID，0表示顶级分类',
  `category_name` VARCHAR(100) NOT NULL COMMENT '分类名称',
  `category_desc` VARCHAR(500) COMMENT '分类描述',
  `sort_order` INT DEFAULT 0 COMMENT '排序',
  `is_enabled` TINYINT DEFAULT 1 COMMENT '是否启用：0=禁用，1=启用',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_parent` (`parent_id`),
  KEY `idx_enabled` (`is_enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='内容分类表';

-- 4. 标签表
CREATE TABLE IF NOT EXISTS `community_tags` (
  `tag_id` INT AUTO_INCREMENT PRIMARY KEY,
  `tag_name` VARCHAR(50) NOT NULL COMMENT '标签名称',
  `use_count` INT DEFAULT 0 COMMENT '使用次数',
  `is_enabled` TINYINT DEFAULT 1 COMMENT '是否启用',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_tag_name` (`tag_name`),
  KEY `idx_enabled` (`is_enabled`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='标签表';

-- 5. 内容主表
CREATE TABLE IF NOT EXISTS `community_content` (
  `content_id` INT AUTO_INCREMENT PRIMARY KEY,
  `author_id` INT NOT NULL COMMENT '作者用户ID',
  `category_id` INT NOT NULL COMMENT '分类ID',
  `content_type` TINYINT NOT NULL COMMENT '内容类型：1=经验分享，2=求助，3=问题咨询',
  `content_title` VARCHAR(200) NOT NULL COMMENT '标题',
  `content_text` TEXT NOT NULL COMMENT '内容正文',
  `content_cover` VARCHAR(500) COMMENT '封面图',
  `view_count` INT DEFAULT 0 COMMENT '浏览量',
  `like_count` INT DEFAULT 0 COMMENT '点赞数',
  `comment_count` INT DEFAULT 0 COMMENT '评论数',
  `collect_count` INT DEFAULT 0 COMMENT '收藏数',
  `share_count` INT DEFAULT 0 COMMENT '分享数',
  `audit_status` TINYINT DEFAULT 0 COMMENT '审核状态：0=待审核，1=已通过，2=未通过',
  `is_deleted` TINYINT DEFAULT 0 COMMENT '是否删除：0=否，1=是',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_author` (`author_id`),
  KEY `idx_category` (`category_id`),
  KEY `idx_type` (`content_type`),
  KEY `idx_audit` (`audit_status`),
  KEY `idx_create_time` (`create_time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='社区内容表';

-- 6. 内容标签关联表
CREATE TABLE IF NOT EXISTS `community_content_tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `content_id` INT NOT NULL COMMENT '内容ID',
  `tag_id` INT NOT NULL COMMENT '标签ID',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_content_tag` (`content_id`, `tag_id`),
  KEY `idx_tag` (`tag_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='内容标签关联表';

-- 7. 评论表
CREATE TABLE IF NOT EXISTS `community_comments` (
  `comment_id` INT AUTO_INCREMENT PRIMARY KEY,
  `content_id` INT NOT NULL COMMENT '内容ID',
  `commenter_id` INT NOT NULL COMMENT '评论者用户ID',
  `parent_id` INT DEFAULT 0 COMMENT '父评论ID，0表示对内容的评论',
  `comment_text` TEXT NOT NULL COMMENT '评论内容',
  `like_count` INT DEFAULT 0 COMMENT '点赞数',
  `audit_status` TINYINT DEFAULT 1 COMMENT '审核状态：0=待审核，1=已通过，2=未通过',
  `is_deleted` TINYINT DEFAULT 0 COMMENT '是否删除',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_content` (`content_id`),
  KEY `idx_commenter` (`commenter_id`),
  KEY `idx_parent` (`parent_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='评论表';

-- 8. 点赞表
CREATE TABLE IF NOT EXISTS `community_likes` (
  `like_id` INT AUTO_INCREMENT PRIMARY KEY,
  `content_id` INT NOT NULL COMMENT '内容ID',
  `user_id` INT NOT NULL COMMENT '用户ID',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_content_user` (`content_id`, `user_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='点赞表';

-- 9. 收藏表
CREATE TABLE IF NOT EXISTS `community_collects` (
  `collect_id` INT AUTO_INCREMENT PRIMARY KEY,
  `content_id` INT NOT NULL COMMENT '内容ID',
  `user_id` INT NOT NULL COMMENT '用户ID',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_content_user` (`content_id`, `user_id`),
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='收藏表';

-- 10. 举报表
CREATE TABLE IF NOT EXISTS `community_reports` (
  `report_id` INT AUTO_INCREMENT PRIMARY KEY,
  `report_no` VARCHAR(50) NOT NULL COMMENT '举报编号',
  `reporter_id` INT NOT NULL COMMENT '举报者用户ID',
  `report_type` TINYINT NOT NULL COMMENT '举报类型：1=内容，2=评论，3=用户',
  `report_obj_id` INT NOT NULL COMMENT '被举报对象ID',
  `report_reason` TINYINT NOT NULL COMMENT '举报原因：1=违法违规，2=广告营销，3=不实信息',
  `report_detail` TEXT COMMENT '举报详情',
  `report_evidence` TEXT COMMENT '举报证据（JSON数组）',
  `is_anonymous` TINYINT DEFAULT 0 COMMENT '是否匿名举报',
  `audit_status` TINYINT DEFAULT 0 COMMENT '审核状态：0=待处理，1=已立案，2=不予立案',
  `auditor_id` INT COMMENT '审核人ID',
  `audit_time` TIMESTAMP NULL COMMENT '审核时间',
  `audit_remark` VARCHAR(500) COMMENT '审核备注',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_report_no` (`report_no`),
  KEY `idx_reporter` (`reporter_id`),
  KEY `idx_type_obj` (`report_type`, `report_obj_id`),
  KEY `idx_audit_status` (`audit_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='举报表';

-- 11. 违规记录表
CREATE TABLE IF NOT EXISTS `community_violations` (
  `violation_id` INT AUTO_INCREMENT PRIMARY KEY,
  `report_id` INT COMMENT '关联的举报ID',
  `violator_id` INT NOT NULL COMMENT '违规者用户ID',
  `violation_type` TINYINT NOT NULL COMMENT '违规类型：1=内容违规，2=评论违规，3=用户违规',
  `violation_obj_id` INT NOT NULL COMMENT '违规对象ID',
  `handle_measure` TINYINT NOT NULL COMMENT '处理措施：1=删除内容，2=警告，3=禁言，4=封号',
  `handle_remark` VARCHAR(500) COMMENT '处理说明',
  `handler_id` INT NOT NULL COMMENT '处理人ID',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_violator` (`violator_id`),
  KEY `idx_report` (`report_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='违规记录表';

-- 12. 问答关系表
CREATE TABLE IF NOT EXISTS `community_qa_relation` (
  `qa_id` INT AUTO_INCREMENT PRIMARY KEY,
  `content_id` INT NOT NULL COMMENT '问题内容ID',
  `best_comment_id` INT COMMENT '最佳答案评论ID',
  `qa_status` TINYINT DEFAULT 0 COMMENT '问答状态：0=待解决，1=已解决',
  `resolve_time` TIMESTAMP NULL COMMENT '解决时间',
  `reward_amount` DECIMAL(10,2) DEFAULT 0.00 COMMENT '悬赏金额',
  `reward_status` TINYINT DEFAULT 0 COMMENT '悬赏状态：0=未设置，1=待发放，2=已发放',
  `reward_time` TIMESTAMP NULL COMMENT '奖励发放时间',
  `create_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `update_time` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_content` (`content_id`),
  KEY `idx_status` (`qa_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='问答关系表';

-- 插入示例分类数据
INSERT INTO `community_categories` (`category_id`, `parent_id`, `category_name`, `category_desc`, `sort_order`) VALUES
(1, 0, '种植技术', '农作物种植相关技术交流', 1),
(101, 1, '小麦种植', '小麦种植技术与经验分享', 1),
(102, 1, '水稻种植', '水稻种植技术与经验分享', 2),
(2, 0, '养殖技术', '畜牧养殖相关技术交流', 2),
(201, 2, '家禽养殖', '鸡鸭鹅等家禽养殖技术', 1),
(3, 0, '市场行情', '农产品市场价格与行情讨论', 3),
(301, 3, '粮食价格', '粮食作物价格行情', 1);

-- 插入示例标签数据
INSERT INTO `community_tags` (`tag_name`) VALUES
('小麦种植'),
('病虫害防治'),
('施肥技术'),
('灌溉管理'),
('冬小麦');
