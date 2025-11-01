-- PostgreSQL版本的商城基础配置表

-- 创建农产品品类表
CREATE TABLE IF NOT EXISTS mall_product_category (
    category_id BIGSERIAL PRIMARY KEY,
    parent_id BIGINT DEFAULT 0,
    category_name VARCHAR(50) NOT NULL,
    category_code VARCHAR(30) NOT NULL UNIQUE,
    category_icon VARCHAR(200),
    sort INTEGER DEFAULT 0,
    status SMALLINT DEFAULT 1 CHECK (status IN (0, 1)),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建折扣活动表
CREATE TABLE IF NOT EXISTS mall_discount_activity (
    activity_id BIGSERIAL PRIMARY KEY,
    activity_no VARCHAR(32) NOT NULL UNIQUE,
    activity_name VARCHAR(100) NOT NULL,
    activity_type SMALLINT DEFAULT 1 CHECK (activity_type IN (1, 2, 3)),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    discount_rule VARCHAR(500) NOT NULL,
    apply_category_ids VARCHAR(200),
    apply_source_ids VARCHAR(1000),
    activity_status SMALLINT DEFAULT 0 CHECK (activity_status IN (0, 1, 2, 3)),
    total_source_count INTEGER DEFAULT 0,
    total_order_count INTEGER DEFAULT 0,
    total_sales_amount DECIMAL(15,2) DEFAULT 0,
    create_user BIGINT NOT NULL REFERENCES sys_user(user_id),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建优惠券规则表
CREATE TABLE IF NOT EXISTS mall_coupon_rule (
    rule_id BIGSERIAL PRIMARY KEY,
    coupon_type SMALLINT NOT NULL CHECK (coupon_type IN (1, 2, 3)),
    coupon_name VARCHAR(100) NOT NULL,
    face_value DECIMAL(10,2),
    discount_rate DECIMAL(5,2),
    min_use_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    max_discount_amount DECIMAL(12,2),
    valid_start_time TIMESTAMP NOT NULL,
    valid_end_time TIMESTAMP NOT NULL,
    total_quantity INTEGER NOT NULL,
    used_quantity INTEGER NOT NULL DEFAULT 0,
    obtain_limit INTEGER NOT NULL DEFAULT 1,
    apply_category_ids VARCHAR(200),
    apply_source_ids VARCHAR(1000),
    obtain_type SMALLINT NOT NULL DEFAULT 1 CHECK (obtain_type IN (1, 2, 3)),
    status SMALLINT NOT NULL DEFAULT 1 CHECK (status IN (0, 1)),
    create_user BIGINT NOT NULL REFERENCES sys_user(user_id),
    create_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建用户优惠券表
CREATE TABLE IF NOT EXISTS mall_user_coupon (
    user_coupon_id BIGSERIAL PRIMARY KEY,
    rule_id BIGINT NOT NULL REFERENCES mall_coupon_rule(rule_id),
    user_id BIGINT NOT NULL REFERENCES sys_user(user_id),
    coupon_no VARCHAR(32) NOT NULL UNIQUE,
    obtain_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    valid_start_time TIMESTAMP NOT NULL,
    valid_end_time TIMESTAMP NOT NULL,
    use_status SMALLINT NOT NULL DEFAULT 0 CHECK (use_status IN (0, 1, 2, 3)),
    use_time TIMESTAMP,
    order_id VARCHAR(32),
    actual_discount DECIMAL(12,2),
    expire_remind_time TIMESTAMP
);

-- 创建优惠券使用日志表
CREATE TABLE IF NOT EXISTS mall_coupon_log (
    log_id BIGSERIAL PRIMARY KEY,
    user_coupon_id BIGINT NOT NULL REFERENCES mall_user_coupon(user_coupon_id),
    user_id BIGINT NOT NULL REFERENCES sys_user(user_id),
    operate_type SMALLINT NOT NULL CHECK (operate_type IN (1, 2, 3, 4, 5)),
    operate_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    operate_desc VARCHAR(500) NOT NULL,
    order_id VARCHAR(32),
    operator_id BIGINT
);