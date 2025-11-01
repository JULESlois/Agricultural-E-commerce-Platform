-- PostgreSQL版本的订单相关表

-- 创建供需匹配记录表
CREATE TABLE IF NOT EXISTS mall_supply_demand_match (
    match_id BIGSERIAL PRIMARY KEY,
    match_no VARCHAR(32) NOT NULL UNIQUE,
    demand_id BIGINT NOT NULL,
    source_id BIGINT NOT NULL,
    buyer_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    match_score INTEGER NOT NULL CHECK (match_score BETWEEN 1 AND 100),
    match_quantity DECIMAL(15,2) NOT NULL,
    match_price DECIMAL(10,2) NOT NULL,
    match_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    match_type SMALLINT DEFAULT 1 CHECK (match_type IN (1, 2)),
    match_status SMALLINT DEFAULT 0 CHECK (match_status IN (0, 1, 2, 3)),
    confirm_time TIMESTAMP,
    cancel_time TIMESTAMP,
    cancel_reason VARCHAR(500),
    order_id VARCHAR(32),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加外键约束
ALTER TABLE mall_supply_demand_match 
ADD CONSTRAINT fk_match_demand FOREIGN KEY (demand_id) REFERENCES mall_buyer_demand(demand_id),
ADD CONSTRAINT fk_match_source FOREIGN KEY (source_id) REFERENCES mall_farmer_source(source_id),
ADD CONSTRAINT fk_match_buyer FOREIGN KEY (buyer_id) REFERENCES sys_user(user_id),
ADD CONSTRAINT fk_match_seller FOREIGN KEY (seller_id) REFERENCES sys_user(user_id);

-- 创建订单主表
CREATE TABLE IF NOT EXISTS mall_order_main (
    order_id VARCHAR(32) PRIMARY KEY,
    buyer_id BIGINT NOT NULL,
    seller_id BIGINT NOT NULL,
    source_id BIGINT NOT NULL,
    demand_id BIGINT,
    match_id BIGINT,
    order_type SMALLINT DEFAULT 1 CHECK (order_type IN (1, 2)),
    order_status SMALLINT DEFAULT 0 CHECK (order_status IN (0, 1, 2, 3, 4, 5)),
    payment_status SMALLINT DEFAULT 0 CHECK (payment_status IN (0, 1, 2, 3)),
    delivery_status SMALLINT DEFAULT 0 CHECK (delivery_status IN (0, 1, 2, 3)),
    total_quantity DECIMAL(15,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    freight_amount DECIMAL(12,2) DEFAULT 0,
    tax_amount DECIMAL(12,2) DEFAULT 0,
    pay_amount DECIMAL(12,2) NOT NULL,
    payment_type SMALLINT CHECK (payment_type IN (1, 2, 3)),
    payment_time TIMESTAMP,
    payment_no VARCHAR(50),
    delivery_type SMALLINT NOT NULL CHECK (delivery_type IN (1, 2, 3)),
    logistics_company VARCHAR(50),
    logistics_no VARCHAR(50),
    receiver_address_id BIGINT NOT NULL,
    delivery_time TIMESTAMP,
    receive_time TIMESTAMP,
    order_remark VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加外键约束
ALTER TABLE mall_order_main 
ADD CONSTRAINT fk_order_buyer FOREIGN KEY (buyer_id) REFERENCES sys_user(user_id),
ADD CONSTRAINT fk_order_seller FOREIGN KEY (seller_id) REFERENCES sys_user(user_id),
ADD CONSTRAINT fk_order_source FOREIGN KEY (source_id) REFERENCES mall_farmer_source(source_id),
ADD CONSTRAINT fk_order_demand FOREIGN KEY (demand_id) REFERENCES mall_buyer_demand(demand_id),
ADD CONSTRAINT fk_order_match FOREIGN KEY (match_id) REFERENCES mall_supply_demand_match(match_id),
ADD CONSTRAINT fk_order_address FOREIGN KEY (receiver_address_id) REFERENCES sys_user_address(address_id);

-- 创建发票表
CREATE TABLE IF NOT EXISTS mall_order_invoice (
    invoice_id BIGSERIAL PRIMARY KEY,
    invoice_no VARCHAR(50) NOT NULL UNIQUE,
    order_id VARCHAR(32) NOT NULL,
    buyer_id BIGINT NOT NULL,
    invoice_type SMALLINT NOT NULL DEFAULT 0 CHECK (invoice_type IN (0, 1, 2)),
    invoice_title VARCHAR(100) NOT NULL,
    taxpayer_id VARCHAR(50),
    invoice_amount DECIMAL(12,2) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL DEFAULT 0.13,
    tax_amount DECIMAL(12,2) NOT NULL,
    invoice_content VARCHAR(200) NOT NULL,
    invoice_status SMALLINT NOT NULL DEFAULT 0 CHECK (invoice_status IN (0, 1, 2, 3, 4, 5, 6)),
    apply_time TIMESTAMP,
    issue_time TIMESTAMP,
    invoice_url VARCHAR(200),
    delivery_way SMALLINT DEFAULT 1 CHECK (delivery_way IN (1, 2)),
    logistics_company VARCHAR(50),
    logistics_no VARCHAR(50),
    receive_time TIMESTAMP,
    fail_reason VARCHAR(500),
    red_invoice_no VARCHAR(50),
    create_user BIGINT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加外键约束
ALTER TABLE mall_order_invoice 
ADD CONSTRAINT fk_invoice_order FOREIGN KEY (order_id) REFERENCES mall_order_main(order_id),
ADD CONSTRAINT fk_invoice_buyer FOREIGN KEY (buyer_id) REFERENCES sys_user(user_id),
ADD CONSTRAINT fk_invoice_creator FOREIGN KEY (create_user) REFERENCES sys_user(user_id);

-- 创建订单明细表
CREATE TABLE IF NOT EXISTS mall_order_item (
    item_id BIGSERIAL PRIMARY KEY,
    order_id VARCHAR(32) NOT NULL,
    item_no VARCHAR(32) NOT NULL UNIQUE,
    source_id BIGINT NOT NULL,
    product_name VARCHAR(100) NOT NULL,
    product_spec VARCHAR(100) NOT NULL,
    item_quantity DECIMAL(15,2) NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    item_amount DECIMAL(12,2) NOT NULL,
    discount_amount DECIMAL(12,2) DEFAULT 0,
    freight_amount DECIMAL(12,2) DEFAULT 0,
    item_pay_amount DECIMAL(12,2) NOT NULL,
    delivery_status SMALLINT DEFAULT 0 CHECK (delivery_status IN (0, 1, 2, 3)),
    logistics_company VARCHAR(50),
    logistics_no VARCHAR(50),
    delivery_time TIMESTAMP,
    receive_time TIMESTAMP,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加外键约束
ALTER TABLE mall_order_item 
ADD CONSTRAINT fk_item_order FOREIGN KEY (order_id) REFERENCES mall_order_main(order_id),
ADD CONSTRAINT fk_item_source FOREIGN KEY (source_id) REFERENCES mall_farmer_source(source_id);