**数据库设计**

数据库中已包含以下表及属性

**商城服务模块数据库表设计**

**第一部分：用户基础与角色扩展表（4 张）**

**表 1：用户基础信息表（sys_user）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| user_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 用户唯一 ID（自增，全局唯一，如 1001 - 农户、2001 - 买家、3001 - 管理员） |
| user_name | VARCHAR | 50  | NOT NULL, UNIQUE | 登录用户名（如 “nonghu_zhang3”，唯一） |
| password | VARCHAR | 100 | NOT NULL | 密码（BCrypt 加密，不可明文） |
| real_name | VARCHAR | 50  | NOT NULL | 真实姓名（用于实名认证、发票 / 物流信息） |
| user_type | TINYINT | 2   | NOT NULL | 角色类型：1 = 农户（卖家）、2 = 买家（采购方）、3 = 管理员 |
| id_card | VARCHAR | 50  | NOT NULL, UNIQUE | 身份证号（AES-256 加密，实名认证用） |
| phone | VARCHAR | 20  | NOT NULL, UNIQUE | 手机号（登录验证、订单 / 物流短信通知） |
| email | VARCHAR | 100 | UNIQUE | 邮箱（可选，密码找回、邮件通知） |
| avatar | VARCHAR | 200 |     | 头像 URL（个人中心展示） |
| user_status | TINYINT | 2   | DEFAULT 1 | 账号状态：0 = 禁用、1 = 正常、2 = 待审核（新用户未实名） |
| cert_status | TINYINT | 2   | DEFAULT 0 | 认证状态：0 = 未认证、1 = 已认证 |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 账号创建时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 账号更新时间 |
| last_login_time | DATETIME | \-  |     | 最后登录时间（判断活跃度） |

**表 2：农户（卖家）信息扩展表（sys_user_farmer）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| farmer_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 农户扩展 ID（自增） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY, UNIQUE | 关联sys_user.user_id（仅user_type=1，一对一） |
| farm_name | VARCHAR | 100 |     | 农场 / 合作社名称（货源展示用） |
| contact_person | VARCHAR | 50  |     | 紧急联系人（非农户本人） |
| contact_phone | VARCHAR | 20  |     | 紧急联系人电话 |
| bank_card_no | VARCHAR | 50  | UNIQUE | 银行卡号（AES-256 加密，交易收款用） |
| bank_name | VARCHAR | 100 |     | 开户银行（如 “中国农业银行郑州中牟支行”） |
| qualification | VARCHAR | 1000 |     | 资质证书 URL（绿色食品 / 有机认证，提升货源竞争力） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 扩展信息创建时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 扩展信息更新时间 |

**表 3：买家（采购方）信息扩展表（sys_user_buyer）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| buyer_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 买家扩展 ID（自增） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY, UNIQUE | 关联sys_user.user_id（仅user_type=2，一对一） |
| buyer_type | TINYINT | 2   | DEFAULT 1 | 买家类型：1 = 个人买家、2 = 企业买家（商超 / 加工厂） |
| company_name | VARCHAR | 100 |     | 企业名称（仅buyer_type=2必填，发票抬头用） |
| company_address | VARCHAR | 200 |     | 企业地址（仅buyer_type=2必填） |
| taxpayer_id | VARCHAR | 50  | UNIQUE | 纳税人识别号（仅buyer_type=2必填，开增值税发票） |
| purchase_scope | VARCHAR | 200 | NOT NULL | 采购品类范围（如 “小麦，生鲜蔬菜”，关联品类表） |
| monthly_purchase | DECIMAL | 15,2 |     | 月均采购量（kg，如 “50000.00”，匹配优先级用） |
| default_address_id | BIGINT | 20  | FOREIGN KEY | 默认收货地址 ID（关联sys_user_address.address_id） |
| preferred_payment | TINYINT | 2   | DEFAULT 1 | 偏好支付方式：1 = 在线支付、2 = 货到付款 |
| preferred_logistics | VARCHAR | 200 |     | 偏好物流公司（如 “顺丰，德邦”，下单优先推荐） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 扩展信息创建时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 扩展信息更新时间 |

**表 4：用户收货地址表（sys_user_address）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| address_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 地址 ID（自增） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联sys_user.user_id（一个用户可多条地址） |
| address_name | VARCHAR | 50  | NOT NULL | 地址名称（如 “公司地址”“家里地址”，用户区分用） |
| receiver | VARCHAR | 50  | NOT NULL | 收货人姓名（物流收件人） |
| phone | VARCHAR | 20  | NOT NULL | 收货人电话（物流联系用） |
| province | VARCHAR | 50  | NOT NULL | 省份（标准化，如 “河南省”） |
| city | VARCHAR | 50  | NOT NULL | 城市（如 “郑州市”） |
| county | VARCHAR | 50  | NOT NULL | 区县（如 “中牟县”） |
| detail_address | VARCHAR | 200 | NOT NULL | 详细地址（如 “官渡镇 XX 村 XX 号”，确保物流可达） |
| is_default | TINYINT | 2   | DEFAULT 0 | 是否默认：0 = 非默认、1 = 默认（一个用户仅 1 条默认） |
| postal_code | VARCHAR | 20  |     | 邮政编码（可选） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 地址创建时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 地址更新时间 |

**第二部分：认证服务表（3张）**

**表 5：认证类型配置表（sys_cert_type，定义认证分类与规则）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| cert_type_id | INT | 10  | PRIMARY KEY, AUTO_INCREMENT | 认证类型 ID（自增主键，全局唯一） |
| cert_type_code | VARCHAR | 30  | NOT NULL, UNIQUE | 认证类型编码（如 “ID_CARD”= 身份证实名认证、“INDIVIDUAL_BIZ”= 个人营业执照认证、“ENTERPRISE_BIZ”= 企业营业执照认证，接口传输用） |
| cert_type_name | VARCHAR | 50  | NOT NULL, UNIQUE | 认证类型名称（如 “身份证实名认证”“个人营业执照认证”“企业营业执照认证”，前端展示用） |
| apply_user_type | TINYINT | 2   | NOT NULL | 适用用户类型：1 = 农户（sys_user.user_type=1）、2 = 买家（sys_user.user_type=2）、3 = 全部用户（1+2） |
| cert_level | TINYINT | 2   | NOT NULL DEFAULT 1 | 认证等级：1 = 基础认证（必填，如身份证认证）、2 = 高级认证（可选，如营业执照认证，提升账号权限） |
| required_materials | JSON | \-  | NOT NULL | 必选材料清单（定义材料类型、数量、规格，如：身份证认证：\[{"material_type":"ID_CARD_FRONT","desc":"身份证正面照","format":"JPG/PNG","size_limit":"≤5MB"},{"material_type":"ID_CARD_BACK","desc":"身份证反面照","format":"JPG/PNG","size_limit":"≤5MB"}\]企业营业执照认证：\[{"material_type":"BIZ_LICENSE","desc":"营业执照正本照","format":"JPG/PNG","size_limit":"≤10MB"},{"material_type":"LEGAL_PERSON_ID","desc":"法人身份证正反面照","format":"JPG/PNG","size_limit":"≤5MB"}\]） |
| optional_materials | JSON | \-  |     | 可选材料清单（如 “行业资质证书”“产品质检报告”，提升认证可信度） |
| audit_cycle | VARCHAR | 50  | NOT NULL DEFAULT "1-2 个工作日" | 审核周期（如 “1-2 个工作日”“24 小时内”，前端告知用户） |
| audit_user_role | TINYINT | 2   | NOT NULL DEFAULT 3 | 审核角色：3 = 平台管理员（sys_user.user_type=3），后续可扩展 “4 = 第三方审核机构” |
| cert_status_effect | JSON | \-  | NOT NULL | 认证通过后对用户状态的影响（如：身份证认证通过：{"sys_user.cert_status":1,"sys_user.user_status":1}（cert_status=1= 个人认证、user_status=1= 账号正常）企业营业执照认证通过：{"sys_user_buyer.cert_status":2,"sys_user.cert_status":2}（sys_user_buyer.cert_status=2= 企业认证）） |
| cert_type_status | TINYINT | 2   | NOT NULL DEFAULT 1 | 认证类型状态：1 = 启用（用户可申请）、0 = 停用（不再接受新申请，历史认证有效） |
| sort | INT | 4   | DEFAULT 0 | 排序权重（值越小越靠前，前端认证列表展示顺序） |
| create_user | BIGINT | 20  | NOT NULL, FOREIGN KEY | 创建人 ID（关联sys_user.user_id，仅管理员可配置） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 配置创建时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 配置更新时间（修改材料清单、审核周期等） |

**表 6：用户认证申请表（sys_user_cert_apply，记录用户认证申请核心数据）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| apply_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 申请 ID（自增主键，全局唯一） |
| apply_no | VARCHAR | 32  | NOT NULL, UNIQUE | 申请编号（生成规则：CERT + 年月日 + 8 位随机数，如 “CERT2025111512345678”，用于溯源） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 申请人 ID（关联sys_user.user_id，唯一标识申请归属） |
| cert_type_id | INT | 10  | NOT NULL, FOREIGN KEY | 关联认证类型 ID（关联sys_cert_type.cert_type_id，确定申请的认证类型） |
| cert_type_code | VARCHAR | 30  | NOT NULL | 认证类型编码（冗余存储，关联sys_cert_type.cert_type_code，避免多表关联查询） |
| apply_info | JSON | \-  | NOT NULL | 认证核心信息（根据认证类型差异化存储，如：身份证认证：{"real_name":"张三","id_card_no":"AES加密后的身份证号","id_card_valid_start":"2010-01-01","id_card_valid_end":"2030-01-01"}企业营业执照认证：{"company_name":"XX农业科技有限公司","taxpayer_id":"91410100XXXXXX","biz_license_no":"92410100XXXXXX","legal_person":"李四","legal_person_id":"AES加密后的法人身份证号"}） |
| apply_status | TINYINT | 2   | NOT NULL DEFAULT 0 | 申请状态：0 = 待提交（草稿）、1 = 待审核（已提交材料）、2 = 审核通过、3 = 审核驳回、4 = 已撤销（用户主动撤回） |
| apply_time | DATETIME | \-  |     | 申请提交时间（apply_status≥1时必填） |
| audit_user_id | BIGINT | 20  | FOREIGN KEY | 审核人 ID（关联sys_user.user_id，apply_status≥2时必填） |
| audit_time | DATETIME | \-  |     | 审核时间（apply_status≥2时必填） |
| audit_remark | VARCHAR | 500 |     | 审核意见（apply_status=2时填 “认证通过”；apply_status=3时填驳回原因，如 “身份证照片模糊，需重新上传”） |
| reject_reason_type | TINYINT | 2   |     | 驳回原因分类（apply_status=3时必填：1 = 材料模糊、2 = 信息不一致、3 = 材料缺失、4 = 其他） |
| reapply_count | INT | 4   | NOT NULL DEFAULT 0 | 重新申请次数（避免恶意重复申请，超过 3 次需人工干预） |
| last_reapply_time | DATETIME | \-  |     | 最后一次重新申请时间 |
| cert_effect_time | DATETIME | \-  |     | 认证生效时间（apply_status=2时必填，如 “2025-11-16 00:00:00”） |
| cert_expire_time | DATETIME | \-  |     | 认证过期时间（可选，如 “2026-11-15”，部分认证需定期更新） |
| cancel_time | DATETIME | \-  |     | 撤销时间（apply_status=4时必填） |
| cancel_reason | VARCHAR | 500 |     | 撤销原因（apply_status=4时必填，如 “信息填写错误，重新申请”） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 记录创建时间（草稿创建时间） |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 记录更新时间（状态、审核结果变更时自动更新） |

**表 7：用户认证材料记录表（sys_user_cert_material，存储认证附件）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| material_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 材料 ID（自增主键） |
| apply_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联认证申请 ID（关联sys_user_cert_apply.apply_id，一个申请可对应多个材料） |
| material_type | VARCHAR | 50  | NOT NULL | 材料类型（与sys_cert_type.required_materials.material_type一致，如 “ID_CARD_FRONT”= 身份证正面、“BIZ_LICENSE”= 营业执照） |
| material_name | VARCHAR | 100 | NOT NULL | 材料名称（如 “身份证正面照（张三）”“营业执照正本（XX 公司）”，便于区分） |
| material_url | VARCHAR | 200 | NOT NULL | 材料存储 URL（如 “https://xxx.com/cert/20251115/ID_CARD_FRONT_123.jpg”，支持云存储） |
| material_format | VARCHAR | 20  | NOT NULL | 材料格式（如 “JPG”“PNG”“PDF”，与认证类型规则一致） |
| material_size | DECIMAL | 10,2 | NOT NULL | 材料大小（单位：MB，如 “2.50”，需≤认证类型规则中的size_limit） |
| material_status | TINYINT | 2   | NOT NULL DEFAULT 1 | 材料状态：1 = 正常（审核可用）、0 = 无效（材料过期 / 替换，需重新上传） |
| upload_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 材料上传时间 |
| replace_material_id | BIGINT | 20  | FOREIGN KEY | 替换前材料 ID（材料更新时填写，关联旧material_id，保留历史记录） |
| upload_user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 上传人 ID（关联sys_user.user_id，用户自己上传填user_id，管理员代传填管理员 ID） |
| **联合唯一索引** | UNIQUE KEY uk_apply_material (apply_id, material_type) | \-  | \-  | 确保同一申请的同一类型材料仅存储一份（避免重复上传） |

**第三部分：商城基础配置表（4 张）**

**表 8：农产品品类表（mall_product_category）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| category_id | INT | 10  | PRIMARY KEY, AUTO_INCREMENT | 品类 ID（自增，如 1 - 粮食作物、101 - 小麦） |
| parent_id | INT | 10  | DEFAULT 0 | 父品类 ID：0 = 一级品类，非 0 = 二级 / 三级品类（如小麦父 ID=1） |
| category_name | VARCHAR | 50  | NOT NULL | 品类名称（如 “粮食作物”“小麦”，无重复） |
| category_code | VARCHAR | 30  | NOT NULL, UNIQUE | 品类编码（如 “GRAIN-WHEAT”，接口传输用） |
| category_icon | VARCHAR | 200 |     | 品类图标 URL（前端分类展示） |
| sort | INT | 4   | DEFAULT 0 | 排序权重（值越小越靠前） |
| status | TINYINT | 2   | DEFAULT 1 | 状态：0 = 停用（不再新增货源）、1 = 启用 |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**表 9：折扣活动表（mall_discount_activity）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| activity_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 活动 ID（自增） |
| activity_no | VARCHAR | 32  | NOT NULL, UNIQUE | 活动编号（DIS + 年月日 + 6 位随机数） |
| activity_name | VARCHAR | 100 | NOT NULL | 活动名称（如 “2025 临期小麦折扣”） |
| activity_type | TINYINT | 2   | DEFAULT 1 | 类型：1 = 临期折扣、2 = 库存清仓、3 = 节日促销 |
| start_time | DATETIME | \-  | NOT NULL | 活动开始时间（如 “2025-09-25 00:00:00”） |
| end_time | DATETIME | \-  | NOT NULL | 活动结束时间（如 “2025-09-30 23:59:59”） |
| discount_rule | VARCHAR | 500 | NOT NULL | 折扣规则（如 “临期≤15 天 8 折，≤7 天 6 折”） |
| apply_category_ids | VARCHAR | 200 |     | 适用品类 ID（如 “101,203”，为空则全品类） |
| apply_source_ids | VARCHAR | 1000 |     | 适用货源 ID（手动指定，为空则自动匹配） |
| activity_status | TINYINT | 2   | DEFAULT 0 | 状态：0 = 未开始、1 = 进行中、2 = 已结束、3 = 已取消 |
| total_source_count | INT | 10  | DEFAULT 0 | 参与货源总数（自动统计） |
| total_order_count | INT | 10  | DEFAULT 0 | 活动订单总数（实时统计） |
| total_sales_amount | DECIMAL | 15,2 | DEFAULT 0 | 活动总销售额（实时统计，元） |
| create_user | BIGINT | 20  | NOT NULL, FOREIGN KEY | 创建人 ID（关联sys_user.user_id，管理员） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**表 10：优惠券规则表（mall_coupon_rule）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| rule_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 规则唯一 ID（自增主键） |
| coupon_type | TINYINT | 2   | NOT NULL | 优惠券类型：1 = 满减券（如满 200 减 30）、2 = 折扣券（如 9 折）、3 = 无门槛券（如 10 元无门槛） |
| coupon_name | VARCHAR | 100 | NOT NULL | 优惠券名称（如 “新用户满 200 减 30 券”“农产品 9 折券”） |
| face_value | DECIMAL | 10,2 |     | 券面金额（仅满减券 / 无门槛券必填，如 “30.00” 元） |
| discount_rate | DECIMAL | 5,2 |     | 折扣率（仅折扣券必填，如 “0.9” 表示 9 折） |
| min_use_amount | DECIMAL | 12,2 | NOT NULL DEFAULT 0 | 最低使用金额（满减券必填，如 “200.00” 元；无门槛券填 0） |
| max_discount_amount | DECIMAL | 12,2 |     | 最大优惠金额（仅折扣券必填，如 “50.00” 元，避免折扣过大） |
| valid_start_time | DATETIME | \-  | NOT NULL | 有效期开始时间（如 “2025-10-01 00:00:00”） |
| valid_end_time | DATETIME | \-  | NOT NULL | 有效期结束时间（如 “2025-10-31 23:59:59”） |
| total_quantity | INT | 10  | NOT NULL | 总发行量（如 “1000” 张） |
| used_quantity | INT | 10  | NOT NULL DEFAULT 0 | 已使用数量（实时统计） |
| obtain_limit | INT | 4   | NOT NULL DEFAULT 1 | 单用户领取上限（如 “1” 张 / 人） |
| apply_category_ids | VARCHAR | 200 |     | 适用品类 ID（多个用逗号分隔，如 “101,203”，为空则全品类） |
| apply_source_ids | VARCHAR | 1000 |     | 适用货源 ID（手动指定，为空则自动匹配符合品类的货源） |
| obtain_type | TINYINT | 2   | NOT NULL DEFAULT 1 | 领取方式：1 = 手动领取、2 = 新用户自动发放、3 = 活动赠送 |
| status | TINYINT | 2   | NOT NULL DEFAULT 1 | 规则状态：0 = 停用、1 = 启用（未到有效期 / 已过期自动变为 0） |
| create_user | BIGINT | 20  | NOT NULL, FOREIGN KEY | 创建人 ID（关联sys_user.user_id，管理员） |
| create_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| update_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**表 11：用户优惠券表（mall_user_coupon）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| user_coupon_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 用户优惠券 ID（自增主键） |
| rule_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联优惠券规则 ID（mall_coupon_rule.rule_id） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 领取用户 ID（关联sys_user.user_id） |
| coupon_no | VARCHAR | 32  | NOT NULL, UNIQUE | 优惠券编号（生成规则：CPN + 年月日 + 8 位随机数，如 “CPN2025100112345678”） |
| obtain_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 领取时间 |
| valid_start_time | DATETIME | \-  | NOT NULL | 有效期开始时间（继承规则的valid_start_time） |
| valid_end_time | DATETIME | \-  | NOT NULL | 有效期结束时间（继承规则的valid_end_time） |
| use_status | TINYINT | 2   | NOT NULL DEFAULT 0 | 使用状态：0 = 未使用、1 = 已使用、2 = 已过期、3 = 已作废（管理员操作） |
| use_time | DATETIME | \-  |     | 使用时间（use_status=1时必填） |
| order_id | VARCHAR | 32  | FOREIGN KEY | 关联订单 ID（use_status=1时必填，关联mall_order_main.order_id） |
| actual_discount | DECIMAL | 12,2 |     | 实际优惠金额（使用时计算，如 “30.00” 元） |
| expire_remind_time | DATETIME | \-  |     | 过期提醒时间（如有效期前 1 天，“2025-10-30 09:00:00”） |

**表 12：优惠券使用日志表（mall_coupon_log）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| log_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 日志 ID（自增主键） |
| user_coupon_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联用户优惠券 ID（mall_user_coupon.user_coupon_id） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 操作用户 ID（关联sys_user.user_id） |
| operate_type | TINYINT | 2   | NOT NULL | 操作类型：1 = 领取、2 = 使用、3 = 过期、4 = 作废、5 = 退款返还 |
| operate_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 操作时间 |
| operate_desc | VARCHAR | 500 | NOT NULL | 操作描述（如 “用户领取新用户满 200 减 30 券”“订单 ORD2025XXX 使用优惠券，优惠 30 元”） |
| order_id | VARCHAR | 32  | FOREIGN KEY | 关联订单 ID（操作类型为 2/5 时必填） |
| operator_id | BIGINT | 20  | FOREIGN KEY | 操作人 ID（管理员操作时填sys_user.user_id，用户操作填 0） |

**第四部分：货源与求购表（2 张）**

**表 13：农户货源表（mall_farmer_source）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| source_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 货源 ID（自增） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 发布农户 ID（关联sys_user.user_id，仅user_type=1） |
| category_id | INT | 10  | NOT NULL, FOREIGN KEY | 品类 ID（关联mall_product_category.category_id） |
| source_no | VARCHAR | 32  | NOT NULL, UNIQUE | 货源编号（SRC + 年月日 + 6 位随机数，溯源用） |
| product_name | VARCHAR | 100 | NOT NULL | 农产品名称（如 “2025 新产冬小麦（有机）”） |
| product_spec | VARCHAR | 100 | NOT NULL | 规格（如 “50kg / 袋，容重≥770g/L”） |
| origin | VARCHAR | 100 | NOT NULL | 产地（关联sys_user_farmer.plant_address，确保真实） |
| plant_date | DATE | \-  |     | 种植日期（计算新鲜度用） |
| harvest_date | DATE | \-  | NOT NULL | 采收日期（判断新鲜度） |
| expire_date | DATE | \-  |     | 保质期截止日期（生鲜类必填，临期判定用） |
| total_quantity | DECIMAL | 15,2 | NOT NULL | 总库存量（kg / 件，如 “10000.00”） |
| surplus_quantity | DECIMAL | 15,2 | DEFAULT total_quantity | 剩余库存量（下单后实时扣减） |
| unit_price | DECIMAL | 10,2 | NOT NULL | 单价（元 /kg，如 “2.85”） |
| batch_price | DECIMAL | 10,2 |     | 批量价（如 “2.60（满 5000kg）”） |
| batch_quantity | DECIMAL | 15,2 |     | 批量起订量（如 “5000.00”，与批量价配套） |
| is_discount | TINYINT | 2   | DEFAULT 0 | 临期折扣标识：0 = 否、1 = 是（expire_date-当前≤15天） |
| product_images | VARCHAR | 1000 | NOT NULL | 产品图片 URL（主图 + 细节图 + 产地图，多个用逗号分隔） |
| product_video | VARCHAR | 200 |     | 产品视频 URL（可选，产地实拍） |
| product_desc | LONGTEXT | \-  | NOT NULL | 产品描述（富文本，如 “有机肥种植，无农药残留”） |
| logistics_type | TINYINT | 2   | DEFAULT 1 | 支持物流：1 = 快递、2 = 整车运输、3 = 两者都支持 |
| freight_rule | VARCHAR | 200 | NOT NULL | 运费规则（如 “满 200kg 包邮，不足 200kg 运费 100 元”） |
| min_order_quantity | DECIMAL | 15,2 | DEFAULT 1.00 | 最小起订量（kg / 件，如 “10.00”） |
| audit_status | TINYINT | 2   | DEFAULT 0 | 审核状态：0 = 待审核、1 = 已通过、2 = 已驳回 |
| audit_user | BIGINT | 20  | FOREIGN KEY | 审核管理员 ID（关联sys_user.user_id，user_type=3） |
| audit_time | DATETIME | \-  |     | 审核时间（audit_status=1/2时填充） |
| audit_remark | VARCHAR | 500 |     | 审核意见（audit_status=2时必填，如 “认证缺失”） |
| source_status | TINYINT | 2   | DEFAULT 1 | 货源状态：0 = 下架、1 = 在售、2 = 售罄、3 = 违规下架 |
| view_count | INT | 10  | DEFAULT 0 | 浏览次数（热门排序用） |
| collect_count | INT | 10  | DEFAULT 0 | 收藏次数（用户偏好分析） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 发布时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**表 14：买家求购表（mall_buyer_demand）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| demand_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 求购 ID（自增） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 求购买家 ID（关联sys_user.user_id，仅user_type=2） |
| category_id | INT | 10  | NOT NULL, FOREIGN KEY | 品类 ID（关联mall_product_category.category_id） |
| demand_no | VARCHAR | 32  | NOT NULL, UNIQUE | 求购编号（DEM + 年月日 + 6 位随机数） |
| product_name | VARCHAR | 100 | NOT NULL | 求购产品名称（如 “新鲜番茄（商超专用）”） |
| product_spec | VARCHAR | 100 | NOT NULL | 需求规格（如 “直径 5-7cm，硬度≥6kg/cm²”） |
| origin_require | VARCHAR | 100 |     | 产地要求（如 “仅限山东省”） |
| required_quantity | DECIMAL | 15,2 | NOT NULL | 需求总量（kg / 件，如 “5000.00”） |
| purchased_quantity | DECIMAL | 15,2 | DEFAULT 0 | 已采购量（匹配后自动累加） |
| max_unit_price | DECIMAL | 10,2 | NOT NULL | 最高接受单价（元 /kg，如 “3.50”） |
| delivery_address_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 交货地址 ID（关联sys_user_address.address_id） |
| latest_delivery_date | DATE | \-  | NOT NULL | 最晚交货日期（如 “2025-10-15”） |
| payment_type | TINYINT | 2   | DEFAULT 1 | 支付偏好：1 = 在线支付、2 = 货到付款、3 = 两者都可 |
| demand_desc | TEXT | \-  |     | 求购描述（如 “每周送货 1 次，按箱包装”） |
| match_source_ids | VARCHAR | 500 |     | 匹配货源 ID（如 “100001,100003”，关联货源表） |
| demand_status | TINYINT | 2   | DEFAULT 1 | 状态：0 = 取消、1 = 待匹配、2 = 部分匹配、3 = 完全匹配、4 = 已完成 |
| cancel_time | DATETIME | \-  |     | 取消时间（demand_status=0时必填） |
| cancel_reason | VARCHAR | 500 |     | 取消原因（demand_status=0时必填） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 发布时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**第五部分：订单与履约表（3 张）**

**表 15：供需匹配记录表（mall_supply_demand_match）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| match_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 匹配 ID（自增） |
| match_no | VARCHAR | 32  | NOT NULL, UNIQUE | 匹配编号（MAT + 年月日 + 6 位随机数） |
| demand_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联求购 ID（mall_buyer_demand.demand_id） |
| source_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联货源 ID（mall_farmer_source.source_id） |
| buyer_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 买家 ID（关联sys_user.user_id，冗余存储） |
| seller_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 卖家 ID（关联sys_user.user_id，冗余存储） |
| match_score | INT | 3   | NOT NULL | 匹配度（1-100 分：品类 30 + 数量 25 + 价格 25 + 产地 20） |
| match_quantity | DECIMAL | 15,2 | NOT NULL | 匹配数量（取求购剩余量与货源剩余量最小值） |
| match_price | DECIMAL | 10,2 | NOT NULL | 匹配价格（≤求购最高单价，如 “3.20” 元 /kg） |
| match_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 匹配时间 |
| match_type | TINYINT | 2   | DEFAULT 1 | 匹配类型：1 = 系统自动、2 = 人工匹配（管理员） |
| match_status | TINYINT | 2   | DEFAULT 0 | 状态：0 = 待确认、1 = 已确认、2 = 已下单、3 = 已取消 |
| confirm_time | DATETIME | \-  |     | 确认时间（match_status=1时必填） |
| cancel_time | DATETIME | \-  |     | 取消时间（match_status=3时必填） |
| cancel_reason | VARCHAR | 500 |     | 取消原因（match_status=3时必填） |
| order_id | VARCHAR | 32  | FOREIGN KEY | 关联订单 ID（match_status=2时必填，关联订单表） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**表 16：订单主表（mall_order_main）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| order_id | VARCHAR | 32  | PRIMARY KEY | 订单编号（生成规则：ORD + 年月日 + 6 位随机数，如 “ORD20251110000001”，唯一标识） |
| buyer_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 买家 ID（关联sys_user.user_id，冗余存储，避免多表关联） |
| seller_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 卖家 ID（关联sys_user.user_id，冗余存储，订单归属店铺标识） |
| source_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联货源 ID（关联mall_farmer_source.source_id，追溯货源信息） |
| demand_id | BIGINT | 20  | FOREIGN KEY | 关联求购 ID（可选，仅匹配订单填写，关联mall_buyer_demand.demand_id） |
| match_id | BIGINT | 20  | FOREIGN KEY | 关联匹配 ID（可选，仅匹配订单填写，关联mall_supply_demand_match.match_id） |
| order_type | TINYINT | 2   | DEFAULT 1 | 订单类型：1 = 普通订单（买家直接下单）、2 = 匹配订单（系统匹配后生成） |
| order_status | TINYINT | 2   | DEFAULT 0 | 订单状态：0 = 待付款、1 = 待发货、2 = 待收货、3 = 已完成、4 = 已取消、5 = 售后中 |
| payment_status | TINYINT | 2   | DEFAULT 0 | 支付状态：0 = 未支付、1 = 部分支付、2 = 已支付、3 = 已退款 |
| delivery_status | TINYINT | 2   | DEFAULT 0 | 发货状态：0 = 未发货、1 = 部分发货、2 = 已发货、3 = 已收货 |
| total_quantity | DECIMAL | 15,2 | NOT NULL | 订单总数量（kg / 件，如 “1000.00”，汇总所有明细数量） |
| unit_price | DECIMAL | 10,2 | NOT NULL | 订单单价（元 /kg，与货源表一致，如 “2.85”） |
| total_amount | DECIMAL | 12,2 | NOT NULL | 订单总金额（total_quantity×unit_price，元，未扣除折扣前） |
| discount_amount | DECIMAL | 12,2 | DEFAULT 0 | 折扣总金额（临期折扣、优惠券等叠加优惠，元） |
| freight_amount | DECIMAL | 12,2 | DEFAULT 0 | 运费金额（按货源freight_rule计算，元） |
| tax_amount | DECIMAL | 12,2 | DEFAULT 0 | 税额（按发票税率计算，元，同步至发票表，避免重复计算） |
| pay_amount | DECIMAL | 12,2 | NOT NULL | 实付金额（total_amount - discount_amount + freight_amount + tax_amount，元） |
| payment_type | TINYINT | 2   |     | 支付方式：1 = 在线支付（微信 / 支付宝）、2 = 货到付款、3 = 银行转账 |
| payment_time | DATETIME | \-  |     | 支付时间（payment_status≥1时必填，如 “2025-11-10 14:30:00”） |
| payment_no | VARCHAR | 50  |     | 支付单号（支付平台返回，如 “微信支付：420000123456789”，关联支付系统） |
| delivery_type | TINYINT | 2   | NOT NULL | 配送方式：1 = 快递（小件农产品）、2 = 整车运输（大宗农产品）、3 = 自提（买家上门提货） |
| logistics_company | VARCHAR | 50  |     | 物流公司（delivery_type≠3时必填，如 “顺丰速运、德邦物流”） |
| logistics_no | VARCHAR | 50  |     | 物流单号（delivery_type≠3时必填，用于物流轨迹查询） |
| receiver_address_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 收货地址 ID（关联sys_user_address.address_id，物流配送依据） |
| delivery_time | DATETIME | \-  |     | 发货时间（delivery_status≥1时必填，如 “2025-11-11 09:00:00”） |
| receive_time | DATETIME | \-  |     | 收货时间（delivery_status=3时必填，买家确认收货时间） |
| order_remark | VARCHAR | 500 |     | 订单备注（买家填写，如 “标注‘商超专用’，避免挤压”） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 订单创建时间（下单时间） |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 订单更新时间（状态、支付、物流变更时自动更新） |

**表 17：发票表（mall_order_invoice）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| invoice_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 发票唯一 ID（自增主键，全局唯一） |
| invoice_no | VARCHAR | 50  | NOT NULL, UNIQUE | 发票编号（税务系统生成或平台内部编号，如 “INVOICE20251110000001”，用于报销溯源） |
| order_id | VARCHAR | 32  | NOT NULL, FOREIGN KEY | 关联订单 ID（关联mall_order_main.order_id，一对一，确保一个订单对应一张发票） |
| buyer_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 发票抬头归属用户 ID（关联sys_user.user_id，冗余存储，避免关联失效） |
| invoice_type | TINYINT | 2   | NOT NULL DEFAULT 0 | 发票类型：0 = 无发票、1 = 增值税普通发票、2 = 增值税专用发票 |
| invoice_title | VARCHAR | 100 | NOT NULL | 发票抬头：- 个人买家（sys_user_buyer.buyer_type=1）填sys_user.real_name；- 企业买家（sys_user_buyer.buyer_type=2）填sys_user_buyer.company_name |
| taxpayer_id | VARCHAR | 50  |     | 纳税人识别号（仅invoice_type=2时必填，关联sys_user_buyer.taxpayer_id，开具专票必需） |
| invoice_amount | DECIMAL | 12,2 | NOT NULL | 发票金额（等于订单pay_amount，元，确保与实付金额一致） |
| tax_rate | DECIMAL | 5,2 | NOT NULL DEFAULT 0.13 | 税率（农产品默认 13%，如 “0.13”，可根据政策调整） |
| tax_amount | DECIMAL | 12,2 | NOT NULL | 税额（invoice_amount/(1+tax_rate)×tax_rate，元，与订单表tax_amount同步） |
| invoice_content | VARCHAR | 200 | NOT NULL | 发票内容（按订单商品汇总，如 “2025 新产冬小麦 1000kg”，需符合税务规范） |
| invoice_status | TINYINT | 2   | NOT NULL DEFAULT 0 | 发票状态：0 = 待申请、1 = 申请中、2 = 已开具、3 = 已邮寄、4 = 已签收、5 = 开具失败、6 = 已冲红（作废） |
| apply_time | DATETIME | \-  |     | 发票申请时间（买家提交申请时填写，如 “2025-11-11 16:00:00”） |
| issue_time | DATETIME | \-  |     | 发票开具时间（财务 / 系统开具后填写，invoice_status=2时必填） |
| invoice_url | VARCHAR | 200 |     | 电子发票 URL（invoice_type=1/2且为电子票时必填，如 “https://xxx.com/invoice/20251110.pdf”） |
| delivery_way | TINYINT | 2   | DEFAULT 1 | 发票交付方式：1 = 电子票（仅提供 URL）、2 = 纸质票（邮寄） |
| logistics_company | VARCHAR | 50  |     | 发票物流公司（delivery_way=2时必填，如 “中国邮政”） |
| logistics_no | VARCHAR | 50  |     | 发票物流单号（delivery_way=2时必填，用于追踪纸质票物流） |
| receive_time | DATETIME | \-  |     | 发票签收时间（买家确认收到纸质票时填写，invoice_status=4时必填） |
| fail_reason | VARCHAR | 500 |     | 开具失败原因（invoice_status=5时必填，如 “纳税人识别号错误，需重新提供”） |
| red_invoice_no | VARCHAR | 50  |     | 冲红发票编号（invoice_status=6时必填，关联对应的红字发票invoice_no） |
| create_user | BIGINT | 20  | NOT NULL, FOREIGN KEY | 创建人 ID（买家申请填buyer_id，管理员代开填sys_user.user_id） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 记录创建时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 记录更新时间（状态、物流变更时自动更新） |

**表 18：订单明细表（mall_order_item）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| item_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 明细 ID（自增） |
| order_id | VARCHAR | 32  | NOT NULL, FOREIGN KEY | 关联订单 ID（mall_order_main.order_id，一个订单可多条明细） |
| item_no | VARCHAR | 32  | NOT NULL, UNIQUE | 明细编号（order_id+“-”+ 序号，如 “ORD2025XXX-1”） |
| source_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联货源 ID（与订单主表一致） |
| product_name | VARCHAR | 100 | NOT NULL | 产品名称（冗余存储，与货源一致） |
| product_spec | VARCHAR | 100 | NOT NULL | 产品规格（冗余存储，与货源一致） |
| item_quantity | DECIMAL | 15,2 | NOT NULL | 明细数量（kg / 件，如 “500.00”） |
| unit_price | DECIMAL | 10,2 | NOT NULL | 明细单价（与订单主表一致） |
| item_amount | DECIMAL | 12,2 | NOT NULL | 明细金额（item_quantity×unit_price，元） |
| discount_amount | DECIMAL | 12,2 | DEFAULT 0 | 明细折扣（按比例分摊订单总折扣，元） |
| freight_amount | DECIMAL | 12,2 | DEFAULT 0 | 明细运费（按比例分摊订单总运费，元） |
| item_pay_amount | DECIMAL | 12,2 | NOT NULL | 明细实付（item_amount-折扣+运费，元） |
| delivery_status | TINYINT | 2   | DEFAULT 0 | 明细发货状态：0 = 未发、1 = 已发、2 = 已收、3 = 拒收 |
| logistics_company | VARCHAR | 50  |     | 明细物流公司（分批发货时可能不同） |
| logistics_no | VARCHAR | 50  |     | 明细物流单号（分批发货时不同） |
| delivery_time | DATETIME | \-  |     | 明细发货时间（delivery_status≥1时必填） |
| receive_time | DATETIME | \-  |     | 明细收货时间（delivery_status=2时必填） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**第六部分：用户行为表（2 张）**

**表 19：用户足迹表（mall_user_footprint）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| footprint_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 足迹 ID（自增主键） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 用户 ID（关联sys_user.user_id） |
| view_type | TINYINT | 2   | NOT NULL | 浏览类型：1 = 货源详情、2 = 求购详情、3 = 社区内容 |
| view_obj_id | BIGINT | 20  | NOT NULL | 浏览对象 ID：浏览货源填source_id、浏览求购填demand_id、浏览社区填content_id |
| view_obj_name | VARCHAR | 100 | NOT NULL | 浏览对象名称（冗余存储，如 “2025 新产冬小麦”，避免对象删除后丢失） |
| view_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 浏览时间 |
| view_duration | INT | 10  | DEFAULT 0 | 浏览时长（单位：秒，如 “30” 表示浏览 30 秒） |
| view_ip | VARCHAR | 50  |     | 浏览 IP 地址 |
| view_device | VARCHAR | 100 |     | 浏览设备（如 “Chrome/Windows 10”“微信小程序”） |
| is_deleted | TINYINT | 2   | NOT NULL DEFAULT 0 | 是否删除：0 = 正常（展示）、1 = 已删除（用户手动删除足迹） |
| delete_time | DATETIME | \-  |     | 删除时间（is_deleted=1时必填） |

**表 20：用户关注店铺表（mall_user_follow）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| follow_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 关注 ID（自增主键） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关注用户 ID（关联sys_user.user_id，买家角色） |
| seller_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 被关注卖家 ID（关联sys_user.user_id，农户角色，即 “店铺” 主体） |
| follow_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 关注时间 |
| follow_status | TINYINT | 2   | NOT NULL DEFAULT 1 | 关注状态：1 = 有效（当前关注）、0 = 无效（取消关注） |
| cancel_time | DATETIME | \-  |     | 取消关注时间（follow_status=0时必填） |
| seller_name | VARCHAR | 100 | NOT NULL | 卖家名称（冗余存储，关联sys_user_farmer.farm_name或sys_user.real_name） |
| source_count | INT | 10  | DEFAULT 0 | 卖家当前货源数（实时同步mall_farmer_source，如 “20” 个） |
| avg_score | DECIMAL | 3,2 | DEFAULT 5.00 | 卖家平均评分（基于订单评价，如 “4.85”） |
| follow_remark | VARCHAR | 200 |     | 关注备注（用户自定义，如 “优质小麦卖家”） |

**第七部分：售后与统计表（4 张）**

**表 21：订单售后表（mall_order_aftersale）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| aftersale_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 售后 ID（自增） |
| order_id | VARCHAR | 32  | NOT NULL, FOREIGN KEY, UNIQUE | 关联订单 ID（mall_order_main.order_id，一对一） |
| item_id | BIGINT | 20  | FOREIGN KEY | 关联明细 ID（分批发货时关联mall_order_item.item_id） |
| aftersale_type | TINYINT | 2   | NOT NULL | 售后类型：1 = 质量问题退款、2 = 少发补发（暂仅支持退款） |
| apply_amount | DECIMAL | 12,2 | NOT NULL | 申请退款金额（≤订单实付，元） |
| reason | VARCHAR | 500 | NOT NULL | 售后原因（如 “产品发霉，无法使用”） |
| proof_images | VARCHAR | 500 |     | 凭证图片 URL（问题产品照片，多个用逗号分隔） |
| apply_user | BIGINT | 20  | NOT NULL, FOREIGN KEY | 申请人 ID（关联sys_user.user_id，买家 / 卖家） |
| apply_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 申请时间 |
| audit_status | TINYINT | 2   | DEFAULT 0 | 审核状态：0 = 待审核、1 = 已通过、2 = 已驳回 |
| audit_user | BIGINT | 20  | FOREIGN KEY | 审核管理员 ID（关联sys_user.user_id） |
| audit_time | DATETIME | \-  |     | 审核时间（audit_status=1/2时必填） |
| audit_remark | VARCHAR | 500 |     | 审核意见（audit_status=2时必填） |
| refund_time | DATETIME | \-  |     | 退款时间（audit_status=1时必填） |
| refund_no | VARCHAR | 50  |     | 退款单号（支付平台返回，如 “TR2025XXX”） |
| aftersale_status | TINYINT | 2   | DEFAULT 1 | 售后状态：0 = 取消、1 = 处理中、2 = 已完成 |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**表 22：用户收藏表（mall_user_collection）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| collection_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 收藏 ID（自增） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 收藏用户 ID（关联sys_user.user_id） |
| collection_type | TINYINT | 2   | NOT NULL | 收藏类型：1 = 货源收藏、2 = 求购收藏 |
| source_id | BIGINT | 20  | FOREIGN KEY | 关联货源 ID（collection_type=1时必填） |
| demand_id | BIGINT | 20  | FOREIGN KEY | 关联求购 ID（collection_type=2时必填） |
| collection_name | VARCHAR | 100 | NOT NULL | 收藏名称（如 “2025 冬小麦”，冗余存储） |
| collection_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 收藏时间 |
| is_valid | TINYINT | 2   | DEFAULT 1 | 是否有效：0 = 已取消、1 = 有效（货源 / 求购删除时设 0） |
| cancel_time | DATETIME | \-  |     | 取消收藏时间（is_valid=0时必填） |

**表 23：商城操作日志表（mall_operation_log）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| log_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 日志 ID（自增） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 操作人 ID（关联sys_user.user_id） |
| user_name | VARCHAR | 50  | NOT NULL | 操作人姓名（冗余存储，避免用户删除后丢失） |
| operation_type | TINYINT | 2   | NOT NULL | 操作类型：1 = 货源发布、2 = 求购发布、3 = 订单创建、4 = 售后申请、5 = 审核操作 |
| operation_module | VARCHAR | 50  | NOT NULL | 操作模块：如 “货源管理”“订单管理”“售后管理” |
| operation_content | VARCHAR | 500 | NOT NULL | 操作内容（如 “发布货源 SRC2025XXX”“创建订单 ORD2025XXX”） |
| operation_obj_id | VARCHAR | 50  | NOT NULL | 操作对象 ID（货源 / 求购 / 订单编号，如 “SRC2025XXX”） |
| operation_ip | VARCHAR | 50  |     | 操作 IP 地址（如 “192.168.1.100”） |
| operation_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 操作时间 |

**表 24：农产品价格统计表（mall_product_price_stat）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| stat_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 统计 ID（自增） |
| category_id | INT | 10  | NOT NULL, FOREIGN KEY | 品类 ID（关联mall_product_category.category_id） |
| product_name | VARCHAR | 50  | NOT NULL | 产品名称（如 “小麦”“番茄”） |
| stat_date | DATE | \-  | NOT NULL | 统计日期（如 “2025-09-25”） |
| avg_price | DECIMAL | 10,2 | NOT NULL | 当日均价（元 /kg，如 “2.85”） |
| max_price | DECIMAL | 10,2 | NOT NULL | 当日最高价（元 /kg，如 “3.00”） |
| min_price | DECIMAL | 10,2 | NOT NULL | 当日最低价（元 /kg，如 “2.70”） |
| price_trend | TINYINT | 2   | NOT NULL | 价格趋势：0 = 持平、1 = 上涨、2 = 下跌 |
| trend_rate | DECIMAL | 5,2 |     | 涨跌幅度（如 “3.50%”，上涨为正，下跌为负） |
| supply_quantity | DECIMAL | 15,2 | NOT NULL | 当日总供应量（kg，如 “50000.00”） |
| demand_quantity | DECIMAL | 15,2 | NOT NULL | 当日总需求量（kg，如 “45000.00”） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 统计时间 |

**社区服务模块数据库表设计**

**第一部分：用户社交关系表（2 张）**

**表 1：用户关注表（community_user_follow）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| follow_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 关注关系 ID（自增主键） |
| follower_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关注人 ID（关联sys_user.user_id，主动关注方） |
| followed_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 被关注人 ID（关联sys_user.user_id，被动关注方） |
| follow_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 关注时间 |
| follow_status | TINYINT | 2   | NOT NULL DEFAULT 1 | 关注状态：1 = 有效（当前关注）、0 = 无效（已取消关注） |
| cancel_time | DATETIME | \-  |     | 取消关注时间（follow_status=0时必填） |
| follow_remark | VARCHAR | 200 |     | 关注备注（用户自定义，如 “优质小麦种植专家”“商超采购大户”） |
| follow_source | TINYINT | 2   | DEFAULT 1 | 关注来源：1 = 内容详情页、2 = 用户主页、3 = 推荐关注、4 = 搜索结果 |
| is_mutual | TINYINT | 2   | DEFAULT 0 | 是否互相关注：0 = 否、1 = 是（被关注人同时关注关注人时自动设为 1） |
| notify_status | TINYINT | 2   | DEFAULT 1 | 通知开关：1 = 接收被关注人动态通知（如发布新内容）、0 = 不接收 |
| **联合唯一索引** | UNIQUE KEY uk_follower_followed (follower_id, followed_id) | \-  | \-  | 确保同一用户对同一用户仅能建立一次有效关注关系 |

**表 2：用户黑名单表（community_user_blacklist）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| blacklist_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 黑名单 ID（自增主键） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 拉黑用户 ID（关联sys_user.user_id，主动拉黑方） |
| blacked_user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 被拉黑用户 ID（关联sys_user.user_id，被动拉黑方） |
| black_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 拉黑时间 |
| black_reason | VARCHAR | 500 |     | 拉黑原因（如 “发布无关广告”“恶意评论”，用户自定义） |
| black_status | TINYINT | 2   | NOT NULL DEFAULT 1 | 拉黑状态：1 = 有效（当前拉黑）、0 = 无效（已解除拉黑） |
| unblack_time | DATETIME | \-  |     | 解除拉黑时间（black_status=0时必填） |
| **联合唯一索引** | UNIQUE KEY uk_user_blacked (user_id, blacked_user_id) | \-  | \-  | 确保同一用户对同一用户仅能建立一次有效拉黑关系 |

**第二部分：内容分类与标签表（3 张）**

**表 3：帖子类别表（community_post_category）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| category_id | INT | 10  | PRIMARY KEY, AUTO_INCREMENT | 类别 ID（自增主键） |
| parent_id | INT | 10  | NOT NULL DEFAULT 0 | 父类别 ID：0 = 一级类别（如 “种植技术”）、非 0 = 二级类别（如 “小麦种植” 关联父 ID=1） |
| category_name | VARCHAR | 50  | NOT NULL, UNIQUE | 类别名称（如 “种植技术”“病虫害防治”“采购心得”“政策解读”） |
| category_code | VARCHAR | 30  | NOT NULL, UNIQUE | 类别编码（如 “PLANT-TECH”“PEST-CONTROL”，用于接口传输） |
| category_icon | VARCHAR | 200 |     | 类别图标 URL（前端分类导航展示，如 “https://xxx.com/icon/plant.png”） |
| category_desc | VARCHAR | 500 |     | 类别描述（如 “分享各类农作物种植技术、经验技巧”） |
| sort | INT | 4   | NOT NULL DEFAULT 0 | 排序权重（值越小越靠前，前端分类列表排序用） |
| status | TINYINT | 2   | NOT NULL DEFAULT 1 | 类别状态：1 = 启用（可发布内容）、0 = 停用（不再新增内容） |

**表 4：内容标签表（community_content_tag）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| tag_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 标签 ID（自增主键） |
| tag_name | VARCHAR | 50  | NOT NULL, UNIQUE | 标签名称（如 “小麦种植”“大棚管理”“2025 新产”“病虫害防治”） |
| tag_type | TINYINT | 2   | NOT NULL DEFAULT 1 | 标签类型：1 = 系统标签（管理员创建）、2 = 用户自定义标签（用户发布内容时创建） |
| tag_desc | VARCHAR | 500 |     | 标签描述（如 “用于标记小麦种植相关的内容”） |
| use_count | INT | 10  | NOT NULL DEFAULT 0 | 使用次数（关联内容数量，实时统计，用于热门标签排序） |
| status | TINYINT | 2   | NOT NULL DEFAULT 1 | 标签状态：1 = 启用（可使用）、0 = 禁用（违规标签，不可使用） |
| create_user | BIGINT | 20  | NOT NULL, FOREIGN KEY | 创建人 ID（关联sys_user.user_id，系统标签为管理员，用户标签为对应用户） |
| create_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| update_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**表 5：内容 - 标签关联表（community_content_tag_relation）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| relation_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 关联 ID（自增主键） |
| content_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联内容 ID（关联community_content.content_id） |
| tag_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联标签 ID（关联community_content_tag.tag_id） |
| create_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 关联时间（内容发布时自动创建） |
| **联合唯一索引** | UNIQUE KEY uk_content_tag (content_id, tag_id) | \-  | \-  | 确保同一内容对同一标签仅关联一次 |

**第三部分：核心内容与互动表（4 张）**

**表 6：社区内容主表（community_content）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| content_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 内容唯一 ID（自增主键） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 发布用户 ID（关联sys_user.user_id） |
| category_id | INT | 10  | NOT NULL, FOREIGN KEY | 关联帖子类别 ID（新增，关联community_post_category.category_id，必填） |
| content_type | TINYINT | 2   | NOT NULL | 内容类型：1 = 种植经验、2 = 采购心得、3 = 问题咨询、4 = 政策公示、5 = 活动通知 |
| content_title | VARCHAR | 200 | NOT NULL | 内容标题（如 “2025 年冬小麦防寒种植技巧”） |
| content_cover | VARCHAR | 200 |     | 内容封面图 URL |
| content_text | LONGTEXT | \-  | NOT NULL | 内容正文（富文本格式） |
| content_video | VARCHAR | 200 |     | 内容视频 URL（新增，支持短视频内容，如种植过程实拍） |
| source_id | BIGINT | 20  | FOREIGN KEY | 关联货源 ID（可选） |
| demand_id | BIGINT | 20  | FOREIGN KEY | 关联求购 ID（可选） |
| audit_status | TINYINT | 2   | DEFAULT 0 | 审核状态：0 = 待审核、1 = 已通过、2 = 已驳回 |
| audit_user | BIGINT | 20  | FOREIGN KEY | 审核管理员 ID |
| audit_time | DATETIME | \-  |     | 审核时间 |
| audit_remark | VARCHAR | 500 |     | 审核意见 |
| content_status | TINYINT | 2   | DEFAULT 1 | 内容状态：0 = 已删除、1 = 正常、2 = 置顶、3 = 推荐（新增，平台推荐至首页） |
| top_expire_time | DATETIME | \-  |     | 置顶过期时间（content_status=2时必填） |
| recommend_expire_time | DATETIME | \-  |     | 推荐过期时间（新增，content_status=3时必填） |
| view_count | INT | 10  | DEFAULT 0 | 浏览次数 |
| like_count | INT | 10  | DEFAULT 0 | 点赞次数 |
| comment_count | INT | 10  | DEFAULT 0 | 评论次数 |
| collect_count | INT | 10  | DEFAULT 0 | 收藏次数 |
| share_count | INT | 10  | DEFAULT 0 | 分享次数（新增，统计内容被分享次数） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 发布时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**表 7：社区评论表（community_comment）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| comment_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 评论 ID |
| content_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联内容 ID |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 评论用户 ID |
| parent_id | BIGINT | 20  | DEFAULT 0 | 父评论 ID（0 = 一级评论，非 0 = 二级评论） |
| comment_text | VARCHAR | 1000 | NOT NULL | 评论内容 |
| comment_images | VARCHAR | 500 |     | 评论图片 URL |
| comment_video | VARCHAR | 200 |     | 评论短视频 URL（新增，支持短视频评论） |
| like_count | INT | 10  | DEFAULT 0 | 评论点赞次数 |
| comment_status | TINYINT | 2   | DEFAULT 1 | 评论状态：0 = 已删除、1 = 正常、2 = 精选、3 = 折叠（新增，违规但不删除的折叠处理） |
| fold_reason | VARCHAR | 500 |     | 折叠原因（新增，comment_status=3时必填，如 “内容与主题无关”） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 评论时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**表 8：社区互动表（community_interact）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| interact_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 互动 ID |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 互动用户 ID |
| content_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联内容 ID |
| interact_type | TINYINT | 2   | NOT NULL | 互动类型：1 = 点赞、2 = 收藏 |
| interact_status | TINYINT | 2   | DEFAULT 1 | 互动状态：1 = 有效、0 = 无效 |
| interact_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 互动时间 |
| cancel_time | DATETIME | \-  |     | 取消时间 |
| collect_remark | VARCHAR | 200 |     | 收藏备注 |
| **联合唯一索引** | UNIQUE KEY uk_user_content_type (user_id, content_id, interact_type) | \-  | \-  | 避免重复互动 |

**表 9：社区问答关联表（community_qa_relation）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| qa_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 问答关联 ID |
| content_id | BIGINT | 20  | NOT NULL, FOREIGN KEY, UNIQUE | 关联问题内容 ID（仅content_type=3） |
| best_comment_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联最优答案 ID |
| confirm_user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 确认人 ID（问题发布者 / 管理员） |
| confirm_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 确认时间 |
| qa_status | TINYINT | 2   | DEFAULT 1 | 问答状态：0 = 已取消、1 = 已确认 |
| view_count | INT | 10  | DEFAULT 0 | 问答查看次数 |
| reward_amount | DECIMAL | 10,2 | DEFAULT 0 | 问答奖励金额（新增，用户可设置奖励激励优质答案，单位：元） |
| reward_status | TINYINT | 2   | DEFAULT 0 | 奖励状态（新增：0 = 未设置、1 = 已设置、2 = 已发放） |
| reward_time | DATETIME | \-  |     | 奖励发放时间（reward_status=2时必填） |

**第四部分：运营与合规表（3 张）**

**表 10：社区举报表（community_report）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| report_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 举报唯一 ID（自增主键，全局唯一） |
| report_no | VARCHAR | 32  | NOT NULL, UNIQUE | 举报编号（生成规则：REP + 年月日 + 8 位随机数，如 “REP2025110512345678”，用于溯源） |
| report_user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 举报用户 ID（关联sys_user.user_id，发起举报的用户，可匿名） |
| report_type | TINYINT | 2   | NOT NULL | 举报对象类型：1 = 社区内容（community_content）、2 = 社区评论（community_comment）、3 = 用户行为（如恶意关注 / 骚扰，关联sys_user） |
| report_obj_id | BIGINT | 20  | NOT NULL | 举报对象 ID：- 内容举报填community_content.content_id- 评论举报填community_comment.comment_id- 用户行为举报填sys_user.user_id |
| report_obj_name | VARCHAR | 200 | NOT NULL | 举报对象名称（冗余存储，如内容标题 “小麦种植问题”、用户名 “农户张三”，避免对象删除后信息丢失） |
| report_reason | TINYINT | 2   | NOT NULL | 举报原因（与community_violation.violation_reason一致，确保判定标准统一）：1 = 涉政敏感、2 = 广告营销、3 = 辱骂攻击、4 = 内容不实、5 = 恶意行为（如刷屏）、6 = 其他 |
| report_detail | VARCHAR | 500 | NOT NULL | 举报详情（用户补充说明，如 “内容含虚假农药宣传，误导农户”“用户多次发布无关广告”） |
| report_evidence | VARCHAR | 1000 |     | 举报证据（图片 / 视频 URL，多个用逗号分隔，如问题内容截图、聊天记录截图） |
| is_anonymous | TINYINT | 2   | NOT NULL DEFAULT 0 | 是否匿名举报：0 = 实名（展示举报用户昵称）、1 = 匿名（隐藏举报用户信息） |
| report_status | TINYINT | 2   | NOT NULL DEFAULT 0 | 举报处理状态：0 = 待审核（刚提交）、1 = 审核中（平台处理中）、2 = 已立案（判定违规，关联违规处理）、3 = 不立案（判定不违规）、4 = 已驳回（举报无效，如重复举报） |
| audit_user_id | BIGINT | 20  | FOREIGN KEY | 审核管理员 ID（关联sys_user.user_id，user_type=3，report_status≥1时必填） |
| audit_time | DATETIME | \-  |     | 审核时间（report_status≥1时自动填充） |
| audit_remark | VARCHAR | 500 |     | 审核意见（如 “经核查，内容含广告营销，已关联违规处理”“举报证据不足，不立案”） |
| violation_id | BIGINT | 20  | FOREIGN KEY | 关联违规处理 ID（report_status=2时必填，关联community_violation.violation_id，实现举报与违规处理联动） |
| create_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 举报提交时间 |
| update_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 举报更新时间（状态、审核结果变更时更新） |

**表 11：社区举报操作日志表（community_report_log）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| log_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 日志唯一 ID（自增主键） |
| report_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联举报 ID（关联community_report.report_id，确保日志归属） |
| operate_user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 操作人 ID（关联sys_user.user_id：用户操作填report_user_id，管理员操作填sys_user.user_id） |
| operate_user_type | TINYINT | 2   | NOT NULL | 操作人类型：1 = 普通用户（发起举报 / 取消举报）、2 = 管理员（审核举报 / 关联违规） |
| operate_type | TINYINT | 2   | NOT NULL | 操作类型：1 = 发起举报、2 = 取消举报（用户主动撤回）、3 = 审核通过（立案）、4 = 审核驳回（不立案）、5 = 关联违规处理、6 = 补充证据（用户追加证据） |
| operate_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 操作时间 |
| operate_content | VARCHAR | 500 | NOT NULL | 操作内容描述（如 “用户发起举报，对象为内容 ID=10086，原因 = 广告营销”“管理员审核通过，关联违规 ID=5001”“用户补充举报证据，URL=[xxx.com/evidence2.jpg](https://xxx.com/evidence2.jpg)”） |
| operate_evidence | VARCHAR | 1000 |     | 操作相关证据（仅 “补充证据” 操作必填，如新增的截图 URL） |
| operate_ip | VARCHAR | 50  |     | 操作 IP 地址（如 “192.168.1.100”，用于安全追溯） |
| operate_device | VARCHAR | 100 |     | 操作设备（如 “Chrome/Windows 10”“微信小程序”） |

**表 12：社区违规处理表（community_violation）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| violation_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 违规 ID（自增主键） |
| violation_type | TINYINT | 2   | NOT NULL | 违规对象类型：1 = 内容、2 = 评论、3 = 用户行为（如恶意关注） |
| violation_obj_id | BIGINT | 20  | NOT NULL | 违规对象 ID：内容填content_id、评论填comment_id、用户行为填user_id |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 违规用户 ID（关联sys_user.user_id） |
| report_user_id | BIGINT | 20  | FOREIGN KEY | 举报用户 ID（可选，用户举报时填写，系统检测违规时填 0） |
| violation_reason | TINYINT | 2   | NOT NULL | 违规原因：1 = 涉政敏感、2 = 广告营销、3 = 辱骂攻击、4 = 内容不实、5 = 其他 |
| violation_detail | VARCHAR | 500 | NOT NULL | 违规详情（如 “内容含虚假种植技术宣传”） |
| violation_evidence | VARCHAR | 1000 |     | 违规证据（图片 / 视频 URL，多个用逗号分隔） |
| handle_status | TINYINT | 2   | NOT NULL DEFAULT 0 | 处理状态：0 = 待处理、1 = 已处理、2 = 不违规 |
| handle_user | BIGINT | 20  | FOREIGN KEY | 处理人 ID（关联sys_user.user_id，仅管理员） |
| handle_time | DATETIME | \-  |     | 处理时间 |
| handle_measure | TINYINT | 2   |     | 处理措施：1 = 删除内容、2 = 折叠内容、3 = 账号禁言（1 天）、4 = 账号封禁（7 天）、5 = 永久封禁 |
| handle_remark | VARCHAR | 500 |     | 处理备注（如 “首次违规，予以警告 + 内容删除”） |
| appeal_status | TINYINT | 2   | DEFAULT 0 | 申诉状态：0 = 未申诉、1 = 申诉中、2 = 申诉通过、3 = 申诉驳回 |
| appeal_time | DATETIME | \-  |     | 申诉时间 |
| appeal_reason | VARCHAR | 500 |     | 申诉理由 |

**专家咨询服务模块数据库表设计**

**第一部分：知识库核心表（3 张）**

**表 1：农业知识类型表（expert_knowledge_type）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| type_id | INT | 10  | PRIMARY KEY, AUTO_INCREMENT | 知识类型 ID（自增主键，支持三级分类，如 1 - 种植技术、101 - 小麦种植） |
| parent_id | INT | 10  | NOT NULL DEFAULT 0 | 父类型 ID：0 = 一级类型，非 0 = 二级 / 三级类型（如小麦种植父 ID=1） |
| type_name | VARCHAR | 100 | NOT NULL, UNIQUE | 类型名称（如 “种植技术”“病虫害防治”“农产品质检”“政策解读”） |
| type_code | VARCHAR | 30  | NOT NULL, UNIQUE | 类型编码（如 “PLANT-WHEAT”“PEST-CONTROL”，用于接口传输与分类检索） |
| type_icon | VARCHAR | 200 |     | 类型图标 URL（前端分类导航展示，如 “https://xxx.com/icon/plant.png”） |
| type_desc | VARCHAR | 500 |     | 类型描述（如 “聚焦各类农作物种植技术、管理技巧，含产前准备、产中管理、产后处理”） |
| sort | INT | 4   | NOT NULL DEFAULT 0 | 排序权重（值越小越靠前，前端分类列表排序用） |
| status | TINYINT | 2   | NOT NULL DEFAULT 1 | 类型状态：1 = 启用（可发布文章）、0 = 停用（不再新增文章，历史文章保留） |
| create_user | BIGINT | 20  | NOT NULL, FOREIGN KEY | 创建人 ID（关联sys_user.user_id，仅管理员可创建） |
| create_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| update_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间（修改名称 / 状态时自动更新） |

**表 2：农业知识库文章表（expert_knowledge_article）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| article_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 文章 ID（自增主键，全局唯一） |
| article_no | VARCHAR | 32  | NOT NULL, UNIQUE | 文章编号（生成规则：KNL + 年月日 + 8 位随机数，如 “KNL2025102812345678”，用于溯源） |
| type_id | INT | 10  | NOT NULL, FOREIGN KEY | 关联知识类型 ID（关联expert_knowledge_type.type_id，确定文章分类） |
| expert_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 发布专家 ID（关联expert_info.expert_id，仅审核通过的专家可发布） |
| article_title | VARCHAR | 200 | NOT NULL | 文章标题（如 “2025 年冬小麦锈病综合防治技术”“玉米种子选购品质鉴别指南”） |
| article_cover | VARCHAR | 200 | NOT NULL | 文章封面图 URL（列表页展示，需清晰体现文章核心主题，如小麦锈病症状图） |
| article_summary | VARCHAR | 500 | NOT NULL | 文章摘要（100-200 字，概括文章核心内容，用于搜索结果预览） |
| article_content | LONGTEXT | \-  | NOT NULL | 文章正文（富文本格式，支持图片、表格、视频插入，如 “一、锈病识别特征：1. 叶片出现黄褐色斑点...”） |
| content_source | TINYINT | 2   | NOT NULL DEFAULT 1 | 内容来源：1 = 专家原创、2 = 转载（需注明出处）、3 = 咨询案例整理（从expert_consult_record提炼） |
| source_consult_id | BIGINT | 20  | FOREIGN KEY | 关联咨询记录 ID（可选，content_source=3时必填，关联expert_consult_record.record_id） |
| reference_url | VARCHAR | 500 |     | 参考资料 URL（content_source=2时必填，如 “农业农村部官网技术文档链接”） |
| tags | VARCHAR | 200 |     | 文章标签（多个用逗号分隔，如 “小麦锈病，冬季防治，农药使用”，用于精准搜索） |
| audit_status | TINYINT | 2   | NOT NULL DEFAULT 0 | 审核状态：0 = 待审核（专家发布后需审核）、1 = 已通过（可展示）、2 = 已驳回（需修改） |
| audit_user | BIGINT | 20  | FOREIGN KEY | 审核管理员 ID（关联sys_user.user_id，user_type=3，audit_status=1/2时必填） |
| audit_time | DATETIME | \-  |     | 审核时间（audit_status=1/2时自动填充） |
| audit_remark | VARCHAR | 500 |     | 审核意见（audit_status=2时必填，如 “内容缺少农药使用安全提示，需补充”） |
| article_status | TINYINT | 2   | NOT NULL DEFAULT 1 | 文章状态：1 = 正常（展示中）、0 = 已删除、2 = 置顶（首页推荐）、3 = 热门（浏览量≥1000 自动标记） |
| view_count | INT | 10  | NOT NULL DEFAULT 0 | 浏览次数（用户点击查看时自动累加，用于热门文章排序） |
| collect_count | INT | 10  | NOT NULL DEFAULT 0 | 收藏次数（关联expert_knowledge_collect表，实时统计） |
| share_count | INT | 10  | NOT NULL DEFAULT 0 | 分享次数（统计用户分享至社区 / 外部平台的次数） |
| like_count | INT | 10  | NOT NULL DEFAULT 0 | 点赞次数（用户对文章的认可统计） |
| create_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 发布时间 |
| update_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间（修改内容 / 状态、新增点赞 / 收藏时自动更新） |

**表 3：知识库文章收藏表（expert_knowledge_collect）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| collect_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 收藏 ID（自增主键） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 收藏用户 ID（关联sys_user.user_id，农户 / 买家 / 专家均可收藏） |
| article_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联文章 ID（关联expert_knowledge_article.article_id） |
| collect_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 收藏时间 |
| collect_status | TINYINT | 2   | NOT NULL DEFAULT 1 | 收藏状态：1 = 有效（当前收藏）、0 = 无效（已取消收藏） |
| cancel_time | DATETIME | \-  |     | 取消收藏时间（collect_status=0时必填） |
| collect_folder | VARCHAR | 100 | DEFAULT "默认收藏夹" | 收藏文件夹（用户自定义分类，如 “小麦种植”“病虫害防治”） |
| collect_remark | VARCHAR | 200 |     | 收藏备注（用户记录学习重点，如 “重点看锈病农药配比”） |
| **联合唯一索引** | UNIQUE KEY uk_user_article (user_id, article_id) | \-  | \-  | 确保同一用户对同一文章仅能建立一次有效收藏关系 |

**第二部分：咨询服务核心表（4 张）**

**表 4：专家信息表（expert_info）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| expert_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 专家唯一 ID（自增主键，全局唯一） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY, UNIQUE | 关联用户 ID（对应sys_user.user_id，专家需先注册平台账号，一对一关联） |
| expert_name | VARCHAR | 50  | NOT NULL | 专家姓名（如 “王建国”，用于展示） |
| expert_avatar | VARCHAR | 200 |     | 专家头像 URL（如 “https://xxx.com/expert/avatar/3001.jpg”） |
| expert_title | VARCHAR | 100 | NOT NULL | 专家头衔（如 “农业农村部小麦种植高级农艺师”“农产品质检工程师”） |
| expert_field | VARCHAR | 200 | NOT NULL | 擅长领域（多个用逗号分隔，如 “小麦种植技术，病虫害防治，农产品品质检测”，用于需求匹配） |
| education_bg | VARCHAR | 200 |     | 教育背景（如 “中国农业大学作物遗传育种专业硕士”） |
| work_experience | TEXT | \-  |     | 工作经历（如 “2010-2025 年 河南省农业科学院作物研究所研究员”） |
| achievement | TEXT | \-  |     | 专业成就（如 “主持‘小麦抗倒伏品种培育’项目，获省级科技进步奖”，提升可信度） |
| service_type | TINYINT | 2   | NOT NULL DEFAULT 1 | 服务类型：1 = 免费咨询、2 = 付费咨询（按次 / 按时长收费） |
| service_fee | DECIMAL | 10,2 |     | 咨询费用（仅service_type=2时必填，如 “50.00” 元 / 次、“100.00” 元 / 小时） |
| service_duration | INT | 10  |     | 单次服务时长（单位：分钟，如 “30”，仅service_type=2时填写） |
| response_time | VARCHAR | 50  | NOT NULL | 响应时效（如 “工作时间 2 小时内响应，非工作时间次日 9 点前响应”） |
| audit_status | TINYINT | 2   | NOT NULL DEFAULT 0 | 审核状态：0 = 待审核（提交资料后）、1 = 已通过（可接单）、2 = 已驳回（资料不符） |
| audit_user | BIGINT | 20  | FOREIGN KEY | 审核管理员 ID（关联sys_user.user_id，user_type=3） |
| audit_time | DATETIME | \-  |     | 审核时间（audit_status=1/2时填充） |
| audit_remark | VARCHAR | 500 |     | 审核意见（audit_status=2时必填，如 “缺少农艺师资格证书，需补充”） |
| cert_materials | VARCHAR | 1000 | NOT NULL | 资质材料 URL（如资格证书、职称证明，多个用逗号分隔，审核依据） |
| service_count | INT | 10  | NOT NULL DEFAULT 0 | 累计服务次数（实时统计，用于专家排序） |
| avg_score | DECIMAL | 3,2 | NOT NULL DEFAULT 5.00 | 平均评分（基于expert_consult_evaluation表计算，如 “4.85”） |
| expert_status | TINYINT | 2   | NOT NULL DEFAULT 1 | 专家状态：0 = 禁用（违规）、1 = 正常（可接单）、2 = 休息中（暂不接单） |
| bank_card_no | VARCHAR | 50  | UNIQUE | 银行卡号（AES-256 加密，付费咨询收益结算用） |
| bank_name | VARCHAR | 100 |     | 开户银行（如 “中国工商银行郑州花园路支行”） |
| knowledge_count | INT | 10  | NOT NULL DEFAULT 0 | 新增：专家发布知识库文章数量（实时统计expert_knowledge_article关联数据） |
| knowledge_view_count | BIGINT | 20  | NOT NULL DEFAULT 0 | 新增：专家文章总浏览次数（累加所有关联文章的view_count） |
| create_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 专家入驻时间 |
| update_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 信息更新时间（修改费用、状态、知识统计数据等） |

**表 5：咨询需求表（expert_consult_demand）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| demand_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 需求唯一 ID（自增主键） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 需求发布用户 ID（关联sys_user.user_id，农户 / 买家均可发布） |
| demand_no | VARCHAR | 32  | NOT NULL, UNIQUE | 需求编号（生成规则：CON + 年月日 + 6 位随机数，如 “CON20251026000001”） |
| demand_title | VARCHAR | 200 | NOT NULL | 需求标题（如 “小麦叶片发黄，求诊断病因”“如何辨别优质玉米种子”） |
| demand_field | VARCHAR | 200 | NOT NULL | 需求领域（如 “小麦病虫害防治”“玉米种子品质鉴别”，用于匹配专家） |
| demand_type | TINYINT | 2   | NOT NULL DEFAULT 1 | 需求类型：1 = 技术咨询（种植 / 养殖）、2 = 采购咨询（品质 / 价格）、3 = 政策咨询（补贴 / 法规） |
| demand_desc | LONGTEXT | \-  | NOT NULL | 需求详情（如 “我种植的冬小麦，目前处于拔节期，叶片出现黄色斑点，伴随轻微卷曲，附图片”，需详细描述问题） |
| demand_attachments | VARCHAR | 1000 |     | 需求附件 URL（如问题图片、产品样品图，多个用逗号分隔，辅助专家判断） |
| expected_expert | BIGINT | 20  | FOREIGN KEY | 期望咨询专家 ID（可选，关联expert_info.expert_id，用户指定专家） |
| consult_type | TINYINT | 2   | NOT NULL DEFAULT 1 | 咨询方式：1 = 文字咨询、2 = 语音咨询、3 = 视频咨询 |
| budget | DECIMAL | 10,2 |     | 咨询预算（仅付费咨询时填写，如 “80.00” 元，用于匹配收费专家） |
| demand_status | TINYINT | 2   | NOT NULL DEFAULT 1 | 需求状态：0 = 已取消、1 = 待匹配（未选专家）、2 = 待接单（已选专家）、3 = 咨询中、4 = 已完成 |
| match_expert_id | BIGINT | 20  | FOREIGN KEY | 匹配专家 ID（关联expert_info.expert_id，系统 / 用户匹配后填写） |
| cancel_time | DATETIME | \-  |     | 取消时间（demand_status=0时填写） |
| cancel_reason | VARCHAR | 500 |     | 取消原因（demand_status=0时必填，如 “问题已自行解决”） |
| recommend_article_ids | VARCHAR | 500 |     | 新增：推荐知识库文章 ID（系统根据需求领域自动匹配，多个用逗号分隔，如 “1001,1003”） |
| create_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 需求发布时间 |
| update_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 需求更新时间（修改状态、匹配专家、更新推荐文章等） |

**表 6：咨询服务记录表（expert_consult_record）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| record_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 记录唯一 ID（自增主键） |
| demand_id | BIGINT | 20  | NOT NULL, FOREIGN KEY, UNIQUE | 关联需求 ID（对应expert_consult_demand.demand_id，一个需求对应一条记录） |
| expert_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联专家 ID（关联expert_info.expert_id） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联用户 ID（关联sys_user.user_id，冗余存储，避免关联失效） |
| consult_no | VARCHAR | 32  | NOT NULL, UNIQUE | 咨询编号（生成规则：REC + 年月日 + 6 位随机数，如 “REC20251026000001”） |
| consult_type | TINYINT | 2   | NOT NULL | 咨询方式（与expert_consult_demand.consult_type一致：1 = 文字、2 = 语音、3 = 视频） |
| consult_start_time | DATETIME | \-  | NOT NULL | 咨询开始时间（如 “2025-10-26 14:30:00”） |
| consult_end_time | DATETIME | \-  | NOT NULL | 咨询结束时间（如 “2025-10-26 15:00:00”） |
| consult_duration | INT | 10  | NOT NULL | 实际咨询时长（单位：分钟，如 “30”，计算付费金额依据） |
| consult_content | LONGTEXT | \-  |     | 文字咨询内容（仅consult_type=1时填写，完整对话记录） |
| consult_attachments | VARCHAR | 1000 |     | 咨询过程附件（如专家提供的解决方案文档、诊断报告，多个用逗号分隔） |
| consult_result | TEXT | \-  | NOT NULL | 咨询结果（专家给出的结论 / 建议，如 “诊断为小麦锈病，建议使用三唑酮乳油喷雾防治，每周 1 次，连续 2 周”） |
| service_fee | DECIMAL | 10,2 | NOT NULL DEFAULT 0.00 | 实际服务费用（免费咨询为 0，付费咨询按专家费率计算，如 “50.00” 元） |
| payment_status | TINYINT | 2   | NOT NULL DEFAULT 0 | 支付状态：0 = 未支付、1 = 已支付、2 = 已退款（仅付费咨询） |
| payment_time | DATETIME | \-  |     | 支付时间（payment_status=1时填写） |
| payment_no | VARCHAR | 50  |     | 支付单号（支付平台返回，如 “微信支付：420000123456789”，关联mall_order_main.payment_no） |
| refund_time | DATETIME | \-  |     | 退款时间（payment_status=2时填写） |
| refund_reason | VARCHAR | 500 |     | 退款原因（payment_status=2时必填，如 “咨询未解决核心问题”） |
| related_article_id | BIGINT | 20  | FOREIGN KEY | 新增：关联知识库文章 ID（专家根据咨询结果创建 / 关联文章时填写，如将典型案例整理为文章） |
| consult_status | TINYINT | 2   | NOT NULL DEFAULT 3 | 咨询状态：3 = 咨询中、4 = 已完成、5 = 已退款（与需求状态联动） |
| create_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 记录创建时间 |
| update_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 记录更新时间（修改支付状态、咨询结果、关联文章等） |

**表 7：咨询评价表（expert_consult_evaluation）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| eval_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 评价唯一 ID（自增主键） |
| record_id | BIGINT | 20  | NOT NULL, FOREIGN KEY, UNIQUE | 关联咨询记录 ID（对应expert_consult_record.record_id，一个记录对应一条评价） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 评价用户 ID（关联sys_user.user_id，仅需求发布者可评价） |
| expert_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联专家 ID（关联expert_info.expert_id，用于更新专家平均评分） |
| eval_score | TINYINT | 2   | NOT NULL | 评分（1-5 分，如 “5” 分，核心评价指标） |
| service_attitude | TINYINT | 2   | NOT NULL | 服务态度评分（1-5 分，如 “4” 分） |
| professional_level | TINYINT | 2   | NOT NULL | 专业水平评分（1-5 分，如 “5” 分） |
| response_speed | TINYINT | 2   | NOT NULL | 响应速度评分（1-5 分，如 “4” 分） |
| eval_content | VARCHAR | 1000 |     | 评价内容（如 “专家非常专业，给出的防治方案很有效，态度也很好，会再次咨询”） |
| eval_images | VARCHAR | 500 |     | 评价图片（可选，如问题解决后的作物长势图，多个用逗号分隔） |
| eval_status | TINYINT | 2   | NOT NULL DEFAULT 1 | 评价状态：0 = 已删除（违规评价）、1 = 正常（展示中） |
| reply_content | VARCHAR | 1000 |     | 专家回复（可选，如 “感谢认可，后续有问题可随时咨询”） |
| reply_time | DATETIME | \-  |     | 专家回复时间 |
| create_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 评价时间（咨询完成后 7 天内可评价） |
| update_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 评价更新时间（修改评价、专家回复等） |

**融资服务模块数据库表设计**

**第一部分：融资申请子系统相关表（2 张）**

**表 1：融资贷款类型表（financing_loan_type）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| loan_type_id | INT | 10  | PRIMARY KEY, AUTO_INCREMENT | 贷款类型 ID（自增主键） |
| loan_type_name | VARCHAR | 100 | NOT NULL, UNIQUE | 贷款类型名称（如 “种植周转贷”“农机购置贷”“农产品预售贷”） |
| loan_purpose | VARCHAR | 200 | NOT NULL | 贷款用途说明（如 “用于小麦种植期间化肥、农药采购资金周转”） |
| min_loan_amount | DECIMAL | 15,2 | NOT NULL | 最低贷款金额（元，如 “10000.00”） |
| max_loan_amount | DECIMAL | 15,2 | NOT NULL | 最高贷款金额（元，如 “500000.00”） |
| loan_term_type | TINYINT | 2   | NOT NULL | 期限类型：1 = 按天、2 = 按月、3 = 按季 |
| min_loan_term | INT | 10  | NOT NULL | 最短贷款期限（如 “3” 个月） |
| max_loan_term | INT | 10  | NOT NULL | 最长贷款期限（如 “12” 个月） |
| interest_rate_type | TINYINT | 2   | NOT NULL | 利率类型：1 = 固定利率、2 = 浮动利率 |
| min_interest_rate | DECIMAL | 5,4 | NOT NULL | 最低年利率（如 “0.0435” 即 4.35%） |
| max_interest_rate | DECIMAL | 5,4 | NOT NULL | 最高年利率（如 “0.065” 即 6.5%） |
| required_materials | VARCHAR | 500 | NOT NULL | 所需材料清单（如 “身份证，种植证明，银行流水，货源预估销量”，用逗号分隔） |
| applicable_objects | VARCHAR | 200 | NOT NULL | 适用对象（如 “种植规模≥50 亩的农户，经营满 1 年的合作社”） |
| support_banks | VARCHAR | 500 | NOT NULL | 支持银行（多个用逗号分隔，如 “中国农业银行，中国邮政储蓄银行，河南省农村信用社”） |
| status | TINYINT | 2   | NOT NULL DEFAULT 1 | 类型状态：0 = 停用（不再接受申请）、1 = 启用（可申请） |
| sort | INT | 4   | DEFAULT 0 | 排序权重（值越小越靠前，申请时优先展示） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**表 2：农户融资申请表（financing_application）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| application_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 申请 ID（自增主键） |
| application_no | VARCHAR | 32  | NOT NULL, UNIQUE | 申请编号（FIN + 年月日 + 8 位随机数，如 “FIN2025102712345678”） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 申请人 ID（关联sys_user.user_id，仅user_type=1农户） |
| loan_type_id | INT | 10  | NOT NULL, FOREIGN KEY | 贷款类型 ID（关联financing_loan_type.loan_type_id） |
| apply_amount | DECIMAL | 15,2 | NOT NULL | 申请金额（元，如 “100000.00”，需在类型上下限之间） |
| apply_term | INT | 10  | NOT NULL | 申请期限（如 “6” 个月，需在类型上下限之间） |
| apply_term_type | TINYINT | 2   | NOT NULL | 期限类型（与所选贷款类型一致：1 = 天、2 = 月、3 = 季） |
| loan_purpose_detail | VARCHAR | 500 | NOT NULL | 贷款用途详情（如 “用于 2025 年冬小麦种植，采购化肥 5 吨、农药 200kg”） |
| repayment_plan | VARCHAR | 500 | NOT NULL | 还款计划（如 “预计 2026 年 5 月小麦收获后，通过平台销售回款还款”） |
| source_id | BIGINT | 20  | FOREIGN KEY | 关联货源 ID（可选，如用已有货源预估销量作为还款保障，关联mall_farmer_source.source_id） |
| bank_id | INT | 10  | NOT NULL, FOREIGN KEY | 意向银行 ID（关联financing_bank.bank_id，从贷款类型支持银行中选择） |
| contact_phone | VARCHAR | 20  | NOT NULL | 联系电话（与sys_user.phone一致，用于银行沟通） |
| contact_address | VARCHAR | 200 | NOT NULL | 联系地址（与sys_user_farmer.plant_address一致） |
| material_urls | VARCHAR | 1000 | NOT NULL | 材料上传 URL（按贷款类型要求上传，多个用逗号分隔，如 “身份证正面，种植证明”） |
| application_status | TINYINT | 2   | NOT NULL DEFAULT 0 | 申请状态：0 = 待提交、1 = 待信用评估、2 = 待银行审批、3 = 审批通过、4 = 审批驳回、5 = 已放款、6 = 已取消 |
| cancel_time | DATETIME | \-  |     | 取消时间（application_status=6时必填） |
| cancel_reason | VARCHAR | 500 |     | 取消原因（application_status=6时必填，如 “资金需求已自行解决”） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 申请创建时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 申请更新时间（状态变更时更新） |

**第二部分：银行审批子系统相关表（2 张）**

**表 3：合作银行信息表（financing_bank）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| bank_id | INT | 10  | PRIMARY KEY, AUTO_INCREMENT | 银行 ID（自增主键） |
| bank_name | VARCHAR | 100 | NOT NULL, UNIQUE | 银行名称（如 “中国农业银行股份有限公司河南省分行”） |
| bank_short_name | VARCHAR | 50  | NOT NULL, UNIQUE | 银行简称（如 “农行河南分行”，用于前端展示） |
| bank_logo | VARCHAR | 200 |     | 银行 LOGO URL（前端展示用） |
| contact_department | VARCHAR | 100 | NOT NULL | 对接部门（如 “三农金融部”） |
| contact_person | VARCHAR | 50  | NOT NULL | 对接人姓名（银行负责审批的人员） |
| contact_phone | VARCHAR | 20  | NOT NULL | 对接人电话（平台与银行沟通用） |
| contact_email | VARCHAR | 100 |     | 对接人邮箱 |
| bank_province | VARCHAR | 50  | NOT NULL | 银行覆盖省份（如 “河南省”，仅受理该省份农户申请） |
| bank_city | VARCHAR | 50  |     | 银行覆盖城市（可选，如 “郑州市”，为空则覆盖全省） |
| supported_loan_types | VARCHAR | 200 | NOT NULL | 支持贷款类型 ID（多个用逗号分隔，关联financing_loan_type.loan_type_id） |
| approval_cycle | VARCHAR | 50  | NOT NULL | 审批周期（如 “3-5 个工作日”） |
| bank_status | TINYINT | 2   | NOT NULL DEFAULT 1 | 合作状态：0 = 暂停合作、1 = 正常合作 |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 合作开始时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 信息更新时间 |

**表 4：银行审批记录表（financing_bank_approval）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| approval_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 审批记录 ID（自增主键） |
| application_id | BIGINT | 20  | NOT NULL, FOREIGN KEY, UNIQUE | 关联申请 ID（financing_application.application_id，一对一） |
| bank_id | INT | 10  | NOT NULL, FOREIGN KEY | 关联银行 ID（financing_bank.bank_id） |
| approver_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 审批人 ID（关联sys_user.user_id，需银行角色账号，user_type=4） |
| approver_name | VARCHAR | 50  | NOT NULL | 审批人姓名（冗余存储，避免用户信息变更） |
| approval_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 审批时间 |
| approval_result | TINYINT | 2   | NOT NULL | 审批结果：1 = 通过、2 = 驳回 |
| approval_amount | DECIMAL | 15,2 |     | 审批金额（approval_result=1时必填，可小于申请金额，如 “80000.00”） |
| approval_term | INT | 10  |     | 审批期限（approval_result=1时必填，可小于申请期限，如 “6” 个月） |
| interest_rate | DECIMAL | 5,4 |     | 最终年利率（approval_result=1时必填，如 “0.052” 即 5.2%） |
| repayment_method | VARCHAR | 100 |     | 还款方式（approval_result=1时必填，如 “按月付息，到期还本”） |
| approval_remark | VARCHAR | 500 | NOT NULL | 审批意见（如 “申请材料齐全，信用良好，同意放款 8 万元”“种植规模不足，驳回申请”） |
| loan_contract_url | VARCHAR | 200 |     | 贷款合同 URL（approval_result=1时上传，供农户签署） |
| sign_time | DATETIME | \-  |     | 合同签署时间（农户签署后填写） |
| loan_time | DATETIME | \-  |     | 放款时间（application_status=5时必填） |
| loan_account | VARCHAR | 50  |     | 放款账户（农户收款账户，与sys_user_farmer.bank_card_no一致，AES 加密） |

**第三部分：信用评估子系统相关表（1 张）**

**表 5：农户信用评估表（financing_credit_evaluation）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| evaluation_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 评估 ID（自增主键） |
| application_id | BIGINT | 20  | NOT NULL, FOREIGN KEY, UNIQUE | 关联申请 ID（financing_application.application_id，一对一） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联农户 ID（sys_user.user_id，冗余存储） |
| evaluation_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 评估时间 |
| evaluation_type | TINYINT | 2   | NOT NULL DEFAULT 1 | 评估类型：1 = 系统自动评估、2 = 人工辅助评估 |
| evaluator_id | BIGINT | 20  | FOREIGN KEY | 评估人 ID（evaluation_type=2时必填，关联sys_user.user_id，管理员角色） |
| credit_score | INT | 3   | NOT NULL | 信用评分（0-100 分，如 “85” 分，评分模型输出结果） |
| credit_level | VARCHAR | 20  | NOT NULL | 信用等级（如 “A 级（80-100 分）”“B 级（60-79 分）”“C 级（<60 分）”） |
| score_detail | JSON | \-  | NOT NULL | 评分明细（各维度得分，如 “{‘经营年限’:20,‘种植规模’:15,‘平台交易’:30,‘征信记录’:20}”） |
| data_sources | VARCHAR | 500 | NOT NULL | 数据来源（如 “平台交易记录，农户经营信息，第三方征信数据，货源预估销量”） |
| evaluation_result | TINYINT | 2   | NOT NULL | 评估结果：1 = 通过（信用达标）、2 = 不通过（信用不达标） |
| evaluation_remark | VARCHAR | 500 |     | 评估备注（如 “经营年限 3 年，平台年交易额 50 万，信用良好”“存在逾期记录，信用不达标”） |
| credit_report_url | VARCHAR | 200 |     | 信用报告 URL（生成 PDF 报告，供银行审批参考） |
| report_generate_time | DATETIME | \-  |     | 报告生成时间 |

**第四部分：联合贷款人匹配功能相关表（1 张）**

**表 6：联合贷款人匹配表（financing_joint_loan_match）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| match_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 匹配 ID（自增主键） |
| main_application_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 主申请人申请 ID（发起联合贷款的农户，关联financing_application.application_id） |
| main_user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 主申请人 ID（关联sys_user.user_id） |
| joint_loan_amount | DECIMAL | 15,2 | NOT NULL | 联合贷款总金额（主申请人申请金额 + 联合申请人申请金额，如 “200000.00”） |
| match_status | TINYINT | 2   | NOT NULL DEFAULT 0 | 匹配状态：0 = 待匹配、1 = 匹配中、2 = 匹配完成、3 = 匹配失败 |

**第五部分：灵活还款，放款相关表（4张）**

**表 7：农产品预售计划表 (financing_presale_plan)**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| plan_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 计划 ID |
| plan_no | VARCHAR | 32  | NOT NULL, UNIQUE | 计划编号 (PRE + 年月日 + 8位随机数) |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 发布农户 ID (关联 sys_user) |
| category_id | INT | 10  | NOT NULL, FOREIGN KEY | 农产品品类 ID (关联 mall_product_category) |
| product_name | VARCHAR | 100 | NOT NULL | 预售产品名称 (如 “2026年春季有机番茄”) |
| plant_date | DATE | \-  | NOT NULL | 预计种植日期 |
| expected_harvest_date | DATE | \-  | NOT NULL | 预计收获日期 |
| total_yield_quantity | DECIMAL | 15,2 | NOT NULL | 预计总产量 (kg) |
| presale_unit_price | DECIMAL | 10,2 | NOT NULL | 预售单价 (元/kg，通常低于市场价) |
| deposit_ratio | DECIMAL | 5,2 | NOT NULL | 定金比例 (如 “0.3” 表示30%) |
| subscribed_quantity | DECIMAL | 15,2 | DEFAULT 0 | 已被预订数量 (kg) |
| plan_status | TINYINT | 2   | DEFAULT 0 | 计划状态: 0=草稿, 1=待审核, 2=预售中, 3=预售满额, 4=生产中, 5=已收获, 6=已完成, 7=已取消 |
| audit_status | TINYINT | 2   | DEFAULT 0 | 平台审核状态: 0=待审核, 1=通过, 2=驳回 |
| audit_remark | VARCHAR | 500 |     | 审核意见 |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 创建时间 |

**表 8：买家预售认购表 (financing_presale_subscription)**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| subscription_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 认购 ID |
| subscription_no | VARCHAR | 32  | NOT NULL, UNIQUE | 认购编号 (SUB + 年月日 + 8位随机数) |
| plan_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联预售计划 ID |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 认购买家 ID (关联 sys_user) |
| subscribed_quantity | DECIMAL | 15,2 | NOT NULL | 认购数量 (kg) |
| deposit_amount | DECIMAL | 15,2 | NOT NULL | 应付定金 (认购数量 \* 单价 \* 比例) |
| payment_status | TINYINT | 2   | DEFAULT 0 | 支付状态: 0=待支付, 1=已支付, 2=已退款 |
| payment_no | VARCHAR | 50  |     | 支付单号 (关联支付网关) |
| subscription_status | TINYINT | 2   | DEFAULT 1 | 认购状态: 1=有效, 0=已取消 |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 认购时间 |

**表 9：融资还款计划表 (financing_repayment_schedule)**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| schedule_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 计划 ID |
| application_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联融资申请 ID ( financing_application ) |
| term_number | INT | 10  | NOT NULL | 还款期数 (如 1, 2, 3...) |
| due_date | DATE | \-  | NOT NULL | 还款截止日期 |
| principal_due | DECIMAL | 15,2 | NOT NULL | 应还本金 |
| interest_due | DECIMAL | 15,2 | NOT NULL | 应还利息 |
| principal_paid | DECIMAL | 15,2 | DEFAULT 0 | 已还本金 |
| interest_paid | DECIMAL | 15,2 | DEFAULT 0 | 已还利息 |
| payment_status | TINYINT | 2   | DEFAULT 0 | 状态: 0=待还款, 1=已还款, 2=逾期, 3=已调整 |
| adjustment_request_id | BIGINT | 20  | FOREIGN KEY | 关联调整申请ID (若此期被调整) |

**表 10：还款计划调整申请表 (financing_repayment_adjustment_request)**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| request_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 申请 ID |
| application_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 关联融资申请 ID |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 申请农户 ID |
| request_reason | VARCHAR | 500 | NOT NULL | 申请原因 (如 “因天气影响，收获期延后一个月”) |
| proposed_plan_details | TEXT | \-  | NOT NULL | 建议调整方案 (如 “申请将第3、4期本金顺延至第5、6期偿还”) |
| request_status | TINYINT | 2   | DEFAULT 0 | 状态: 0=待银行审批, 1=已批准, 2=已驳回 |
| approver_id | BIGINT | 20  | FOREIGN KEY | 审批人 ID (银行角色用户) |
| approval_remark | VARCHAR | 500 |     | 审批意见 |
| approval_time | DATETIME | \-  |     | 审批时间 |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 申请时间 |

**客服服务模块数据库表设计**

**第一部分：客服基础信息表（2 张）**

**表 1：客服信息主表（service_customer_service）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| cs_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 客服唯一 ID（自增主键，全局唯一） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY, UNIQUE | 关联用户 ID（对应sys_user.user_id，客服需先注册平台账号） |
| cs_type | TINYINT | 2   | NOT NULL | 客服类型：1 = 官方客服（平台员工）、2 = 卖家店铺客服（农户 / 卖家雇佣） |
| seller_id | BIGINT | 20  | FOREIGN KEY | 关联卖家 ID（仅cs_type=2时必填，关联sys_user.user_id，即店铺主体） |
| cs_name | VARCHAR | 50  | NOT NULL | 客服对外名称（如 “官方客服 01”“小麦店铺客服”） |
| cs_avatar | VARCHAR | 200 |     | 客服头像 URL（如 “https://xxx.com/cs/avatar/5001.jpg”） |
| service_scope | VARCHAR | 200 | NOT NULL | 服务范围：官方客服（“跨店铺纠纷、平台规则、支付问题”）；店铺客服（“自家订单咨询、售后沟通、货源答疑”） |
| work_time | VARCHAR | 200 | NOT NULL | 工作时间（如 “9:00-21:00”，前端展示给用户） |
| online_status | TINYINT | 2   | DEFAULT 1 | 在线状态：1 = 在线（可接待聊天 / 工单）、0 = 离线、2 = 忙碌（仅处理现有会话） |
| max_session_count | INT | 10  | DEFAULT 15 | 最大同时接待会话数（避免客服过载，官方客服 15 个，店铺客服 10 个） |
| current_session_count | INT | 10  | DEFAULT 0 | 当前接待会话数（实时统计，达上限自动设为 “忙碌”） |
| cs_status | TINYINT | 2   | DEFAULT 1 | 客服账号状态：1 = 正常、0 = 禁用、2 = 待培训 |
| create_user | BIGINT | 20  | NOT NULL, FOREIGN KEY | 创建人 ID（官方客服由管理员创建sys_user.user_type=3；店铺客服由卖家创建sys_user.user_type=1） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 账号创建时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**表 2：客服部门表（service_department，仅官方客服）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| dept_id | INT | 10  | PRIMARY KEY, AUTO_INCREMENT | 部门 ID（自增主键） |
| dept_name | VARCHAR | 100 | NOT NULL, UNIQUE | 部门名称（如 “订单咨询部”“售后维权部”） |
| dept_desc | VARCHAR | 500 |     | 部门职责（“处理用户订单修改、物流查询咨询”） |
| manager_id | BIGINT | 20  | FOREIGN KEY | 部门负责人 ID（关联service_customer_service.cs_id） |
| dept_status | TINYINT | 2   | DEFAULT 1 | 部门状态：1 = 启用、0 = 停用 |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**第二部分：聊天对话型客服表（2 张）**

**表 3：客服聊天会话表（service_chat_session）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| session_id | VARCHAR | 64  | PRIMARY KEY | 会话唯一 ID（生成规则：SESSION + 用户 ID + 时间戳 + 4 位随机数，如 “SESSION1001202511021234”） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 发起用户 ID（关联sys_user.user_id，农户 / 买家） |
| cs_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 接待客服 ID（关联service_customer_service.cs_id） |
| cs_type | TINYINT | 2   | NOT NULL | 客服类型（1 = 官方、2 = 店铺，与客服一致） |
| seller_id | BIGINT | 20  | FOREIGN KEY | 关联卖家 ID（仅cs_type=2时必填，关联sys_user.user_id） |
| order_id | VARCHAR | 32  | FOREIGN KEY | 关联订单 ID（可选，如 “ORD2025XXX”，订单相关会话必填） |
| session_status | TINYINT | 2   | NOT NULL DEFAULT 1 | 会话状态：1 = 进行中、2 = 已结束、3 = 已转接（转其他客服） |
| start_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 会话开始时间 |
| end_time | DATETIME | \-  |     | 会话结束时间（session_status=2时必填） |
| end_reason | VARCHAR | 200 |     | 结束原因（如 “问题解决”“用户主动结束”） |
| transfer_cs_id | BIGINT | 20  | FOREIGN KEY | 转接客服 ID（session_status=3时必填） |
| transfer_reason | VARCHAR | 200 |     | 转接原因（如 “超出服务范围，转售后专员”） |
| unread_count | INT | 10  | DEFAULT 0 | 未读消息数（客服 / 用户未读消息统计） |

**表 4：客服聊天消息表（service_chat_message）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| msg_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 消息 ID（自增主键） |
| session_id | VARCHAR | 64  | NOT NULL, FOREIGN KEY | 关联会话 ID（关联service_chat_session.session_id） |
| sender_type | TINYINT | 2   | NOT NULL | 发送方类型：1 = 用户（农户 / 买家）、2 = 客服 |
| sender_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 发送方 ID（用户填sys_user.user_id，客服填service_customer_service.cs_id） |
| msg_type | TINYINT | 2   | NOT NULL DEFAULT 1 | 消息类型：1 = 文字、2 = 图片、3 = 文件、4 = 语音、5 = 订单卡片（关联order_id） |
| msg_content | TEXT | \-  | NOT NULL | 消息内容：文字消息填内容；图片 / 文件 / 语音填 URL；订单卡片填order_id |
| msg_time | DATETIME | \-  | NOT NULL DEFAULT CURRENT_TIMESTAMP | 消息发送时间 |
| read_status | TINYINT | 2   | NOT NULL DEFAULT 0 | 已读状态：0 = 未读、1 = 已读 |
| read_time | DATETIME | \-  |     | 已读时间（read_status=1时必填） |
| is_recalled | TINYINT | 2   | DEFAULT 0 | 是否撤回：0 = 正常、1 = 已撤回 |
| recall_time | DATETIME | \-  |     | 撤回时间（is_recalled=1时必填） |

**第三部分：工单型客服表（2 张）**

**表 5：客服工单表（service_work_order）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| wo_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 工单 ID（自增主键） |
| wo_no | VARCHAR | 32  | NOT NULL, UNIQUE | 工单编号（WO + 年月日 + 8 位随机数，如 “WO2025110212345678”） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 发起用户 ID（关联sys_user.user_id） |
| session_id | VARCHAR | 64  | FOREIGN KEY | 关联会话 ID（可选，从聊天会话转化的工单必填） |
| order_id | VARCHAR | 32  | FOREIGN KEY | 关联订单 ID（可选，订单相关问题必填） |
| seller_id | BIGINT | 20  | FOREIGN KEY | 关联卖家 ID（可选，店铺相关问题必填） |
| wo_type | TINYINT | 2   | NOT NULL | 工单类型：1 = 订单咨询、2 = 售后纠纷、3 = 规则咨询、4 = 其他 |
| wo_title | VARCHAR | 200 | NOT NULL | 工单标题（如 “订单 ORD2025XXX 物流停滞”） |
| wo_content | LONGTEXT | \-  | NOT NULL | 工单详情（可自动同步聊天会话关键内容） |
| wo_attachments | VARCHAR | 1000 |     | 工单附件 URL（问题截图、聊天记录截图） |
| cs_id | BIGINT | 20  | FOREIGN KEY | 负责客服 ID（关联service_customer_service.cs_id） |
| wo_status | TINYINT | 2   | DEFAULT 0 | 工单状态：0 = 待分配、1 = 处理中、2 = 待用户反馈、3 = 已解决、4 = 已关闭 |
| handle_result | TEXT | \-  |     | 处理结果（工单完成后填写） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

**第四部分：客服服务评价表（1 张）**

**表 6：客服服务评价表（service_customer_satisfaction）**

|     |     |     |     |     |
| --- | --- | --- | --- | --- |
| 字段名 | 数据类型 | 长度  | 约束  | 说明  |
| satisfaction_id | BIGINT | 20  | PRIMARY KEY, AUTO_INCREMENT | 评价 ID（自增主键） |
| eval_type | TINYINT | 2   | NOT NULL | 评价类型：1 = 聊天会话评价、2 = 工单评价 |
| session_id | VARCHAR | 64  | FOREIGN KEY | 关联会话 ID（eval_type=1时必填） |
| wo_id | BIGINT | 20  | FOREIGN KEY, UNIQUE | 关联工单 ID（eval_type=2时必填，唯一） |
| user_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 评价用户 ID（关联sys_user.user_id） |
| cs_id | BIGINT | 20  | NOT NULL, FOREIGN KEY | 被评价客服 ID（关联service_customer_service.cs_id） |
| satisfaction_score | TINYINT | 2   | NOT NULL | 满意度评分（1-5 分） |
| response_speed | TINYINT | 2   | NOT NULL | 响应速度评分（1-5 分） |
| professional_level | TINYINT | 2   | NOT NULL | 专业水平评分（1-5 分） |
| eval_content | VARCHAR | 1000 |     | 评价内容（如 “客服实时解答很及时，问题解决满意”） |
| create_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP | 评价时间 |
| update_time | DATETIME | \-  | DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |