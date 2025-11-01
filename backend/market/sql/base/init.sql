-- 创建用户基础信息表
CREATE TABLE IF NOT EXISTS sys_user (
    user_id BIGSERIAL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    real_name VARCHAR(50) NOT NULL,
    user_type SMALLINT NOT NULL CHECK (user_type IN (1, 2, 3)),
    id_card VARCHAR(200) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    avatar VARCHAR(200),
    user_status SMALLINT DEFAULT 1 CHECK (user_status IN (0, 1, 2)),
    cert_status SMALLINT DEFAULT 0 CHECK (cert_status IN (0, 1)),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login_time TIMESTAMP
);

-- 创建用户收货地址表
CREATE TABLE IF NOT EXISTS sys_user_address (
    address_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES sys_user(user_id) ON DELETE CASCADE,
    address_name VARCHAR(50) NOT NULL,
    receiver VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    province VARCHAR(50) NOT NULL,
    city VARCHAR(50) NOT NULL,
    county VARCHAR(50) NOT NULL,
    detail_address VARCHAR(200) NOT NULL,
    is_default SMALLINT DEFAULT 0 CHECK (is_default IN (0, 1)),
    postal_code VARCHAR(20),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建农户扩展信息表
CREATE TABLE IF NOT EXISTS sys_user_farmer (
    farmer_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES sys_user(user_id) ON DELETE CASCADE,
    farm_name VARCHAR(100),
    contact_person VARCHAR(50),
    contact_phone VARCHAR(20),
    bank_card_no VARCHAR(200) UNIQUE,
    bank_name VARCHAR(100),
    qualification VARCHAR(1000),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建买家扩展信息表
CREATE TABLE IF NOT EXISTS sys_user_buyer (
    buyer_id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE REFERENCES sys_user(user_id) ON DELETE CASCADE,
    buyer_type SMALLINT DEFAULT 1 CHECK (buyer_type IN (1, 2)),
    company_name VARCHAR(100),
    company_address VARCHAR(200),
    taxpayer_id VARCHAR(50) UNIQUE,
    purchase_scope VARCHAR(200) NOT NULL,
    monthly_purchase DECIMAL(15,2),
    default_address_id BIGINT REFERENCES sys_user_address(address_id),
    preferred_payment SMALLINT DEFAULT 1 CHECK (preferred_payment IN (1, 2)),
    preferred_logistics VARCHAR(200),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_sys_user_phone ON sys_user(phone);
CREATE INDEX IF NOT EXISTS idx_sys_user_user_type ON sys_user(user_type);
CREATE INDEX IF NOT EXISTS idx_sys_user_user_status ON sys_user(user_status);
CREATE INDEX IF NOT EXISTS idx_sys_user_address_user_id ON sys_user_address(user_id);
CREATE INDEX IF NOT EXISTS idx_sys_user_address_is_default ON sys_user_address(is_default);

-- 插入测试数据（可选）
-- INSERT INTO sys_user (user_name, password, real_name, user_type, id_card, phone, email, user_status, cert_status) 
-- VALUES ('admin', '$2b$10$example_hash', '管理员', 3, 'encrypted_id_card', '13800000000', 'admin@example.com', 1, 1);