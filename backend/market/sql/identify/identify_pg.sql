-- PostgreSQL版本的认证相关表

-- 创建认证类型配置表
CREATE TABLE IF NOT EXISTS sys_cert_type (
    cert_type_id SERIAL PRIMARY KEY,
    cert_type_code VARCHAR(30) NOT NULL UNIQUE,
    cert_type_name VARCHAR(50) NOT NULL UNIQUE,
    apply_user_type SMALLINT NOT NULL CHECK (apply_user_type IN (1, 2, 3)),
    cert_level SMALLINT NOT NULL DEFAULT 1 CHECK (cert_level IN (1, 2)),
    required_materials JSONB NOT NULL,
    optional_materials JSONB,
    audit_cycle VARCHAR(50) NOT NULL DEFAULT '1-2 个工作日',
    audit_user_role SMALLINT NOT NULL DEFAULT 3 CHECK (audit_user_role IN (3, 4)),
    cert_status_effect JSONB NOT NULL,
    cert_type_status SMALLINT NOT NULL DEFAULT 1 CHECK (cert_type_status IN (0, 1)),
    sort INTEGER DEFAULT 0,
    create_user BIGINT NOT NULL,
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加外键约束
ALTER TABLE sys_cert_type 
ADD CONSTRAINT fk_cert_type_creator FOREIGN KEY (create_user) REFERENCES sys_user(user_id);

-- 创建用户认证申请表
CREATE TABLE IF NOT EXISTS sys_user_cert_apply (
    apply_id BIGSERIAL PRIMARY KEY,
    apply_no VARCHAR(32) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    cert_type_id INTEGER NOT NULL,
    cert_type_code VARCHAR(30) NOT NULL,
    apply_info JSONB NOT NULL,
    apply_status SMALLINT NOT NULL DEFAULT 0 CHECK (apply_status IN (0, 1, 2, 3, 4)),
    apply_time TIMESTAMP,
    audit_user_id BIGINT,
    audit_time TIMESTAMP,
    audit_remark VARCHAR(500),
    reject_reason_type SMALLINT CHECK (reject_reason_type IN (1, 2, 3, 4)),
    reapply_count INTEGER NOT NULL DEFAULT 0,
    last_reapply_time TIMESTAMP,
    cert_effect_time TIMESTAMP,
    cert_expire_time TIMESTAMP,
    cancel_time TIMESTAMP,
    cancel_reason VARCHAR(500),
    create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 添加外键约束
ALTER TABLE sys_user_cert_apply 
ADD CONSTRAINT fk_apply_user FOREIGN KEY (user_id) REFERENCES sys_user(user_id),
ADD CONSTRAINT fk_apply_cert_type FOREIGN KEY (cert_type_id) REFERENCES sys_cert_type(cert_type_id),
ADD CONSTRAINT fk_apply_auditor FOREIGN KEY (audit_user_id) REFERENCES sys_user(user_id);

-- 创建用户认证材料记录表
CREATE TABLE IF NOT EXISTS sys_user_cert_material (
    material_id BIGSERIAL PRIMARY KEY,
    apply_id BIGINT NOT NULL,
    material_type VARCHAR(50) NOT NULL,
    material_name VARCHAR(100) NOT NULL,
    material_url VARCHAR(200) NOT NULL,
    material_format VARCHAR(20) NOT NULL,
    material_size DECIMAL(10,2) NOT NULL,
    material_status SMALLINT NOT NULL DEFAULT 1 CHECK (material_status IN (0, 1)),
    upload_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    replace_material_id BIGINT,
    upload_user_id BIGINT NOT NULL,
    CONSTRAINT uk_apply_material UNIQUE (apply_id, material_type)
);

-- 添加外键约束
ALTER TABLE sys_user_cert_material 
ADD CONSTRAINT fk_material_apply FOREIGN KEY (apply_id) REFERENCES sys_user_cert_apply(apply_id),
ADD CONSTRAINT fk_material_replace FOREIGN KEY (replace_material_id) REFERENCES sys_user_cert_material(material_id),
ADD CONSTRAINT fk_material_uploader FOREIGN KEY (upload_user_id) REFERENCES sys_user(user_id);