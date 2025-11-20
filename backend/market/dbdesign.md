第一部分：用户基础与角色扩展表（4 张）
表 1：用户基础信息表（sys_user）
字段名
数据类型
长度
约束
说明
user_id
BIGINT
20
PRIMARY KEY, AUTO_INCREMENT
用户唯一 ID（自增，全局唯一，如 1001 - 农户、2001 - 买家、3001 - 管理员）
user_name
VARCHAR
50
NOT NULL, UNIQUE
登录用户名（如 “nonghu_zhang3”，唯一）
password
VARCHAR
100
NOT NULL
密码（BCrypt 加密，不可明文）
real_name
VARCHAR
50
NOT NULL
真实姓名（用于实名认证、发票 / 物流信息）
user_type
TINYINT
2
NOT NULL
角色类型：1 = 农户（卖家）、2 = 买家（采购方）、3 = 管理员
id_card
VARCHAR
50
NOT NULL, UNIQUE
身份证号（AES-256 加密，实名认证用）
phone
VARCHAR
20
NOT NULL, UNIQUE
手机号（登录验证、订单 / 物流短信通知）
email
VARCHAR
100
UNIQUE
邮箱（可选，密码找回、邮件通知）
avatar
VARCHAR
200

头像 URL（个人中心展示）
user_status
TINYINT
2
DEFAULT 1
账号状态：0 = 禁用、1 = 正常、2 = 待审核（新用户未实名）
cert_status
TINYINT
2
DEFAULT 0
认证状态：0 = 未认证、1 = 已认证
create_time
DATETIME
DEFAULT CURRENT_TIMESTAMP
账号创建时间
update_time
DATETIME
DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
账号更新时间
last_login_time
DATETIME

最后登录时间（判断活跃度）
表 2：农户（卖家）信息扩展表（sys_user_farmer）
字段名
数据类型
长度
约束
说明
farmer_id
BIGINT
20
PRIMARY KEY, AUTO_INCREMENT
农户扩展 ID（自增）
user_id
BIGINT
20
NOT NULL, FOREIGN KEY, UNIQUE
关联sys_user.user_id（仅user_type=1，一对一）
farm_name
VARCHAR
100

农场 / 合作社名称（货源展示用）
contact_person
VARCHAR
50

紧急联系人（非农户本人）
contact_phone
VARCHAR
20

紧急联系人电话
bank_card_no
VARCHAR
50
UNIQUE
银行卡号（AES-256 加密，交易收款用）
bank_name
VARCHAR
100

开户银行（如 “中国农业银行郑州中牟支行”）
qualification
VARCHAR
1000

资质证书 URL（绿色食品 / 有机认证，提升货源竞争力）
create_time
DATETIME
DEFAULT CURRENT_TIMESTAMP
扩展信息创建时间
update_time
DATETIME

DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
扩展信息更新时间
表 3：买家（采购方）信息扩展表（sys_user_buyer）
字段名
数据类型
长度
约束
说明
buyer_id
BIGINT
20
PRIMARY KEY, AUTO_INCREMENT
买家扩展 ID（自增）
user_id
BIGINT
20
NOT NULL, FOREIGN KEY, UNIQUE
关联sys_user.user_id（仅user_type=2，一对一）
buyer_type
TINYINT
2
DEFAULT 1
买家类型：1 = 个人买家、2 = 企业买家（商超 / 加工厂）
company_name
VARCHAR
100

企业名称（仅buyer_type=2必填，发票抬头用）
company_address
VARCHAR
200

企业地址（仅buyer_type=2必填）
taxpayer_id
VARCHAR
50
UNIQUE
纳税人识别号（仅buyer_type=2必填，开增值税发票）
purchase_scope
VARCHAR
200
NOT NULL
采购品类范围（如 “小麦，生鲜蔬菜”，关联品类表）
monthly_purchase
DECIMAL
15,2

月均采购量（kg，如 “50000.00”，匹配优先级用）
default_address_id
BIGINT
20
FOREIGN KEY
默认收货地址 ID（关联sys_user_address.address_id）
preferred_payment
TINYINT
2
DEFAULT 1
偏好支付方式：1 = 在线支付、2 = 货到付款
preferred_logistics
VARCHAR
200

偏好物流公司（如 “顺丰，德邦”，下单优先推荐）
create_time
DATETIME
DEFAULT CURRENT_TIMESTAMP
扩展信息创建时间
update_time
DATETIME

DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
扩展信息更新时间
表 4：用户收货地址表（sys_user_address）
字段名
数据类型
长度
约束
说明
address_id
BIGINT
20
PRIMARY KEY, AUTO_INCREMENT
地址 ID（自增）
user_id
BIGINT
20
NOT NULL, FOREIGN KEY
关联sys_user.user_id（一个用户可多条地址）
address_name
VARCHAR
50
NOT NULL
地址名称（如 “公司地址”“家里地址”，用户区分用）
receiver
VARCHAR
50
NOT NULL
收货人姓名（物流收件人）
phone
VARCHAR
20
NOT NULL
收货人电话（物流联系用）
province
VARCHAR
50
NOT NULL
省份（标准化，如 “河南省”）
city
VARCHAR
50
NOT NULL
城市（如 “郑州市”）
county
VARCHAR
50
NOT NULL
区县（如 “中牟县”）
detail_address
VARCHAR
200
NOT NULL
详细地址（如 “官渡镇 XX 村 XX 号”，确保物流可达）
is_default
TINYINT
2
DEFAULT 0
是否默认：0 = 非默认、1 = 默认（一个用户仅 1 条默认）
postal_code
VARCHAR
20

邮政编码（可选）
create_time
DATETIME
DEFAULT CURRENT_TIMESTAMP
地址创建时间
update_time
DATETIME

DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
地址更新时间
