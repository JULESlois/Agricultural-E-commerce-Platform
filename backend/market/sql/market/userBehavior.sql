-- PostgreSQL版本的用户行为表

-- 创建用户足迹表
CREATE TABLE IF NOT EXISTS mall_user_footprint (
    footprint_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    view_type SMALLINT NOT NULL CHECK (view_type IN (1, 2, 3)),
    view_obj_id BIGINT NOT NULL,
    view_obj_name VARCHAR(100) NOT NULL,
    view_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    view_duration INTEGER DEFAULT 0,
    view_ip VARCHAR(50),
    view_device VARCHAR(100),
    is_deleted SMALLINT NOT NULL DEFAULT 0 CHECK (is_deleted IN (0, 1)),
    delete_time TIMESTAMP
);

-- 添加外键约束
ALTER TABLE mall_user_footprint 
ADD CONSTRAINT fk_footprint_user FOREIGN KEY (user_id) REFERENCES sys_user(user_id);

-- 创建用户关注店铺表
CREATE TABLE IF NOT EXISTS mall_user_follow (
    follow_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    follow_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    follow_status SMALLINT NOT NULL DEFAULT 1 CHECK (follow_status IN (0, 1)),
    cancel_time TIMESTAMP,
    seller_name VARCHAR(100) NOT NULL,
    source_count INTEGER DEFAULT 0,
    avg_score DECIMAL(3,2) DEFAULT 5.00,
    follow_remark VARCHAR(200)
);

-- 添加外键约束
ALTER TABLE mall_user_follow 
ADD CONSTRAINT fk_follow_user FOREIGN KEY (user_id) REFERENCES sys_user(user_id),
ADD CONSTRAINT fk_follow_seller FOREIGN KEY (seller_id) REFERENCES sys_user(user_id);