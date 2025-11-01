-- PostgreSQL版本的货源需求表

-- 创建农户货源表
CREATE TABLE IF NOT EXISTS mall_farmer_source (
    source_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id INTEGER NOT NULL,
    source_no VARCHAR(32) NOT NULL UNIQUE,
    product_name VARCHAR(100) NOT NULL,
    product_spec VARCHAR(100) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    plant_date DATE,
    harvest_date DATE NOT NULL,
    expire_date DATE,
    total_quantity DECIMAL(15,2) NOT NULL,
    surplus_quantity DECIMAL(15,2) DEFAULT 0,
    unit_price DECIMAL(10,2) NOT NULL,
    batch_price DECIMAL(10,2),
    batch_quantity DECIMAL(15,2),
    is_discount SMALLINT DEFAULT 0 CHECK (is_discount IN (0, 1)),
    product_images VARCHAR(1000) NOT NULL,
    product_video VARCHAR(200),
    product_desc TEXT NOT NULL,
    logistics_type SMALLINT DEFAULT 1 CHECK (logistics_type IN (1, 2, 3)),
    freight_rule VARCHAR(200) NOT NULL,
    min_order_quantity DECIMAL(15,2) DEFAULT 1.00,
    audit_status SMALLINT DEFAULT 0 CHECK (audit_status IN (0, 1, 2)),
    audit_user BIGINT,
    audit_time TIMESTAMP,
    audit_remark VARCHAR(500),
    source_status SMALLINT DEFAULT 1 CHECK (source_status IN (0, 1, 2, 3)),
    view_count INTEGER DEFAULT 0,
    collect_count INTEGER DEFAULT 0,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加外键约束
ALTER TABLE mall_farmer_source 
ADD CONSTRAINT fk_source_user FOREIGN KEY (user_id) REFERENCES sys_user(user_id),
ADD CONSTRAINT fk_source_category FOREIGN KEY (category_id) REFERENCES mall_product_category(category_id),
ADD CONSTRAINT fk_source_auditor FOREIGN KEY (audit_user) REFERENCES sys_user(user_id);

-- 创建买家求购表
CREATE TABLE IF NOT EXISTS mall_buyer_demand (
    demand_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category_id INTEGER NOT NULL,
    demand_no VARCHAR(32) NOT NULL UNIQUE,
    product_name VARCHAR(100) NOT NULL,
    product_spec VARCHAR(100) NOT NULL,
    origin_require VARCHAR(100),
    required_quantity DECIMAL(15,2) NOT NULL,
    purchased_quantity DECIMAL(15,2) DEFAULT 0,
    max_unit_price DECIMAL(10,2) NOT NULL,
    delivery_address_id BIGINT NOT NULL,
    latest_delivery_date DATE NOT NULL,
    payment_type SMALLINT DEFAULT 1 CHECK (payment_type IN (1, 2, 3)),
    demand_desc TEXT,
    match_source_ids VARCHAR(500),
    demand_status SMALLINT DEFAULT 1 CHECK (demand_status IN (0, 1, 2, 3, 4)),
    cancel_time TIMESTAMP,
    cancel_reason VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加外键约束
ALTER TABLE mall_buyer_demand 
ADD CONSTRAINT fk_demand_user FOREIGN KEY (user_id) REFERENCES sys_user(user_id),
ADD CONSTRAINT fk_demand_category FOREIGN KEY (category_id) REFERENCES mall_product_category(category_id),
ADD CONSTRAINT fk_demand_address FOREIGN KEY (delivery_address_id) REFERENCES sys_user_address(address_id);