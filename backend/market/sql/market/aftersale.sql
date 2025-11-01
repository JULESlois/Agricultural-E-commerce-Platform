-- PostgreSQL版本的售后相关表

-- 创建订单售后表
CREATE TABLE IF NOT EXISTS mall_order_aftersale (
    aftersale_id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(32) NOT NULL UNIQUE,
    item_id BIGINT,
    aftersale_type SMALLINT NOT NULL CHECK (aftersale_type IN (1, 2)),
    apply_amount DECIMAL(12,2) NOT NULL,
    reason VARCHAR(500) NOT NULL,
    proof_images VARCHAR(500),
    apply_user BIGINT NOT NULL,
    apply_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    audit_status SMALLINT DEFAULT 0 CHECK (audit_status IN (0, 1, 2)),
    audit_user BIGINT,
    audit_time TIMESTAMP,
    audit_remark VARCHAR(500),
    refund_time TIMESTAMP,
    refund_no VARCHAR(50),
    aftersale_status SMALLINT DEFAULT 1 CHECK (aftersale_status IN (0, 1, 2)),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加外键约束
ALTER TABLE mall_order_aftersale 
ADD CONSTRAINT fk_aftersale_order FOREIGN KEY (order_id) REFERENCES mall_order_main(order_id),
ADD CONSTRAINT fk_aftersale_item FOREIGN KEY (item_id) REFERENCES mall_order_item(item_id),
ADD CONSTRAINT fk_aftersale_applicant FOREIGN KEY (apply_user) REFERENCES sys_user(user_id),
ADD CONSTRAINT fk_aftersale_auditor FOREIGN KEY (audit_user) REFERENCES sys_user(user_id);

-- 创建用户收藏表
CREATE TABLE IF NOT EXISTS mall_user_collection (
    collection_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    collection_type SMALLINT NOT NULL CHECK (collection_type IN (1, 2)),
    source_id BIGINT,
    demand_id BIGINT,
    collection_name VARCHAR(100) NOT NULL,
    collection_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_valid SMALLINT DEFAULT 1 CHECK (is_valid IN (0, 1)),
    cancel_time TIMESTAMP
);

-- 添加外键约束
ALTER TABLE mall_user_collection 
ADD CONSTRAINT fk_collection_user FOREIGN KEY (user_id) REFERENCES sys_user(user_id),
ADD CONSTRAINT fk_collection_source FOREIGN KEY (source_id) REFERENCES mall_farmer_source(source_id),
ADD CONSTRAINT fk_collection_demand FOREIGN KEY (demand_id) REFERENCES mall_buyer_demand(demand_id);

-- 创建商城操作日志表
CREATE TABLE IF NOT EXISTS mall_operation_log (
    log_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    operation_type SMALLINT NOT NULL CHECK (operation_type IN (1, 2, 3, 4, 5)),
    operation_module VARCHAR(50) NOT NULL,
    operation_content VARCHAR(500) NOT NULL,
    operation_obj_id VARCHAR(50) NOT NULL,
    operation_ip VARCHAR(50),
    operation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加外键约束
ALTER TABLE mall_operation_log 
ADD CONSTRAINT fk_log_user FOREIGN KEY (user_id) REFERENCES sys_user(user_id);

-- 创建农产品价格统计表
CREATE TABLE IF NOT EXISTS mall_product_price_stat (
    stat_id BIGSERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL,
    product_name VARCHAR(50) NOT NULL,
    stat_date DATE NOT NULL,
    avg_price DECIMAL(10,2) NOT NULL,
    max_price DECIMAL(10,2) NOT NULL,
    min_price DECIMAL(10,2) NOT NULL,
    price_trend SMALLINT NOT NULL CHECK (price_trend IN (0, 1, 2)),
    trend_rate DECIMAL(5,2),
    supply_quantity DECIMAL(15,2) NOT NULL,
    demand_quantity DECIMAL(15,2) NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加外键约束
ALTER TABLE mall_product_price_stat 
ADD CONSTRAINT fk_stat_category FOREIGN KEY (category_id) REFERENCES mall_product_category(category_id);