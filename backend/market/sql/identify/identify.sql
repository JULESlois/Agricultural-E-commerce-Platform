-- 创建认证类型配置表
CREATE TABLE IF NOT EXISTS sys_cert_type (
    cert_type_id INT PRIMARY KEY AUTO_INCREMENT,
    cert_type_code VARCHAR(30) NOT NULL UNIQUE,
    cert_type_name VARCHAR(50) NOT NULL UNIQUE,
    apply_user_type TINYINT NOT NULL CHECK (apply_user_type IN (1, 2, 3)),
    cert_level TINYINT NOT NULL DEFAULT 1 CHECK (cert_level IN (1, 2)),
    required_materials JSON NOT NULL,
    optional_materials JSON,
    audit_cycle VARCHAR(50) NOT NULL DEFAULT '1-2 个工作日',
    audit_user_role TINYINT NOT NULL DEFAULT 3 CHECK (audit_user_role IN (3, 4)),
    cert_status_effect JSON NOT NULL,
    cert_type_status TINYINT NOT NULL DEFAULT 1 CHECK (cert_type_status IN (0, 1)),
    sort INT DEFAULT 0,
    create_user BIGINT NOT NULL,
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (create_user) REFERENCES sys_user(user_id)
);

-- 创建用户认证申请表
CREATE TABLE IF NOT EXISTS sys_user_cert_apply (
    apply_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    apply_no VARCHAR(32) NOT NULL UNIQUE,
    user_id BIGINT NOT NULL,
    cert_type_id INT NOT NULL,
    cert_type_code VARCHAR(30) NOT NULL,
    apply_info JSON NOT NULL,
    apply_status TINYINT NOT NULL DEFAULT 0 CHECK (apply_status IN (0, 1, 2, 3, 4)),
    apply_time DATETIME,
    audit_user_id BIGINT,
    audit_time DATETIME,
    audit_remark VARCHAR(500),
    reject_reason_type TINYINT CHECK (reject_reason_type IN (1, 2, 3, 4)),
    reapply_count INT NOT NULL DEFAULT 0,
    last_reapply_time DATETIME,
    cert_effect_time DATETIME,
    cert_expire_time DATETIME,
    cancel_time DATETIME,
    cancel_reason VARCHAR(500),
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES sys_user(user_id),
    FOREIGN KEY (cert_type_id) REFERENCES sys_cert_type(cert_type_id),
    FOREIGN KEY (audit_user_id) REFERENCES sys_user(user_id)
);

-- 创建用户认证材料记录表
CREATE TABLE IF NOT EXISTS sys_user_cert_material (
    material_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    apply_id BIGINT NOT NULL,
    material_type VARCHAR(50) NOT NULL,
    material_name VARCHAR(100) NOT NULL,
    material_url VARCHAR(200) NOT NULL,
    material_format VARCHAR(20) NOT NULL,
    material_size DECIMAL(10,2) NOT NULL,
    material_status TINYINT NOT NULL DEFAULT 1 CHECK (material_status IN (0, 1)),
    upload_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    replace_material_id BIGINT,
    upload_user_id BIGINT NOT NULL,
    FOREIGN KEY (apply_id) REFERENCES sys_user_cert_apply(apply_id),
    FOREIGN KEY (replace_material_id) REFERENCES sys_user_cert_material(material_id),
    FOREIGN KEY (upload_user_id) REFERENCES sys_user(user_id),
    UNIQUE KEY uk_apply_material (apply_id, material_type)
);