第一部分：用户基础与认证 API (基于 sys_user 表)
1. 用户注册
- 功能: 为新用户（农户或买家）创建一个待审核的账户。
- HTTP 方法: POST
- Endpoint: /api/auth/register
- 请求 (Input):
    {
  "user_name": "nonghu_zhang3",
  "password": "securePassword123",
  "real_name": "张三",
  "user_type": 1,
  "id_card": "410101199001011234",
  "phone": "13800138000",
  "email": "zhang3@example.com"
}
```*   **响应 (Output)**:
*   **成功 (HTTP 201 Created)**:
    ```json
    {
      "code": 201,
      "message": "注册成功，等待管理员审核。",
      "data": {
        "user_id": 1001
      }
    }
    ```
*   **失败 (HTTP 409 Conflict)**:
    ```json
    {
      "code": 409,
      "message": "注册失败。",
      "error": "用户名 'nonghu_zhang3' 已存在。"
    }
    ```

---
2. 用户登录
- 功能: 用户使用用户名/手机号和密码进行登录，获取访问令牌 (Token)。
- HTTP 方法: POST
- Endpoint: /api/auth/login
- 请求 (Input):
    {
  "login_identifier": "nonghu_zhang3",
  "password": "securePassword123"
}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "登录成功。",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user_info": {
      "user_id": 1001,
      "user_name": "nonghu_zhang3",
      "user_type": 1,
      "avatar": "https://example.com/avatar.jpg"
    }
  }
}
  - 失败 (HTTP 401 Unauthorized):
    {
  "code": 401,
  "message": "登录失败。",
  "error": "用户名或密码错误。"
}

---
3. 获取当前用户信息
- 功能: 获取已登录用户的详细个人信息。
- HTTP 方法: GET
- Endpoint: /api/users/me
- 请求 (Input):
  - Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "获取用户信息成功。",
  "data": {
    "user_id": 1001,
    "user_name": "nonghu_zhang3",
    "real_name": "张三",
    "user_type": 1,
    "phone": "138****8000",
    "email": "zhang3@example.com",
    "avatar": "https://example.com/avatar.jpg",
    "user_status": 1,
    "cert_status": 0,
    "create_time": "2025-10-26T12:00:00Z",
    "last_login_time": "2025-10-26T15:30:00Z"
  }
}
  - 失败 (HTTP 401 Unauthorized):
    {
  "code": 401,
  "message": "认证失败。",
  "error": "无效的Token或Token已过期。"
}

---
4. 更新用户信息
- 功能: 允许用户更新自己的头像、邮箱或密码。
- HTTP 方法: PUT
- Endpoint: /api/users/me
- 请求 (Input):
  - Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  - Body:
    {
  "avatar": "https://example.com/new_avatar.jpg",
  "email": "new_email@example.com"
}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "用户信息更新成功。",
  "data": {
    "user_id": 1001,
    "avatar": "https://example.com/new_avatar.jpg",
    "email": "new_email@example.com"
  }
}
  - 失败 (HTTP 400 Bad Request):
    {
  "code": 400,
  "message": "更新失败。",
  "error": "邮箱格式不正确。"
}

---
5. (管理员)获取用户列表
- 功能: 管理员根据条件筛选查询系统中的用户列表。
- HTTP 方法: GET
- Endpoint: /api/admin/users?user_type=1&user_status=2&page=1&pageSize=10
- 请求 (Input):
  - Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (管理员Token)
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询用户列表成功。",
  "data": {
    "total": 5,
    "page": 1,
    "pageSize": 10,
    "list": [
      {
        "user_id": 1002,
        "user_name": "nonghu_li4",
        "real_name": "李四",
        "user_type": 1,
        "phone": "139****9000",
        "user_status": 2,
        "cert_status": 0,
        "create_time": "2025-10-26T14:00:00Z"
      }
    ]
  }
}
  - 失败 (HTTP 403 Forbidden):
    {
  "code": 403,
  "message": "访问被拒绝。",
  "error": "您没有权限执行此操作。"
}

---
6. (管理员)更新用户状态/认证
- 功能: 管理员审核新用户、禁用或解禁现有用户。
- HTTP 方法: PATCH
- Endpoint: /api/admin/users/1002/status
- 请求 (Input):
  - Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (管理员Token)
  - Body:
    {
  "user_status": 1,
  "cert_status": 1
}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "用户状态更新成功。"
}
  - 失败 (HTTP 404 Not Found):
    {
  "code": 404,
  "message": "操作失败。",
  "error": "用户ID '1002' 不存在。"
}
第二部分：农户扩展信息 API (基于 sys_user_farmer 表)
1. 创建/更新农户扩展信息
- 功能: 农户用户填写或更新自己的农场、银行账户等信息。
- HTTP 方法: PUT
- Endpoint: /api/farmers/me
- 请求 (Input):
  - Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (农户Token)
  - Body:
    {
  "farm_name": "张三的有机农场",
  "contact_person": "张三妻",
  "contact_phone": "13800138001",
  "bank_card_no": "6228480388888888888",
  "bank_name": "中国农业银行郑州中牟支行",
  "qualification": "[\"https://example.com/cert1.jpg\", \"https://example.com/cert2.jpg\"]"
}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "农户信息更新成功。",
  "data": {
    "farmer_id": 1,
    "user_id": 1001,
    "farm_name": "张三的有机农场",
    "update_time": "2025-10-26T16:00:00Z"
  }
}
  - 失败 (HTTP 403 Forbidden):
    {
  "code": 403,
  "message": "操作失败。",
  "error": "只有农户用户才能更新此信息。"
}

---
2. 获取农户扩展信息
- 功能: 获取指定农户的扩展信息。
- HTTP 方法: GET
- Endpoint: /api/farmers/1001 (1001是user_id)
- 请求 (Input):
  - Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- 响应 (Output):
  - 成功 (HTTP 200 OK) (对买家或公众展示):
    {
  "code": 200,
  "message": "获取农户信息成功。",
  "data": {
    "user_id": 1001,
    "farm_name": "张三的有机农场",
    "qualification": "[\"https://example.com/cert1.jpg\"]"
  }
}
  - 成功 (HTTP 200 OK) (对农户本人或管理员展示):
    {
  "code": 200,
  "message": "获取农户信息成功。",
  "data": {
    "farmer_id": 1,
    "user_id": 1001,
    "farm_name": "张三的有机农场",
    "contact_person": "张三妻",
    "contact_phone": "13800138001",
    "bank_card_no": "6228...8888",
    "bank_name": "中国农业银行郑州中牟支行",
    "qualification": "[\"https://example.com/cert1.jpg\"]"
  }
}
第三部分：买家扩展信息 API (基于 sys_user_buyer 表)
1. 创建/更新买家扩展信息
- 功能: 买家用户填写或更新自己的采购偏好、企业信息。
- HTTP 方法: PUT
- Endpoint: /api/buyers/me
- 请求 (Input):
  - Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (买家Token)
  - Body:
    {
  "buyer_type": 2,
  "company_name": "美味果蔬超市",
  "company_address": "河南省郑州市金水区农业路1号",
  "taxpayer_id": "91410100MA12345678",
  "purchase_scope": "小麦,生鲜蔬菜",
  "monthly_purchase": 50000.00,
  "preferred_payment": 1,
  "preferred_logistics": "顺丰,德邦"
}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "买家信息更新成功。",
  "data": {
    "buyer_id": 1,
    "user_id": 2001,
    "company_name": "美味果蔬超市",
    "update_time": "2025-10-26T16:10:00Z"
  }
}
  - 失败 (HTTP 400 Bad Request):
    {
  "code": 400,
  "message": "更新失败。",
  "error": "企业买家必须提供企业名称和纳税人识别号。"
}
第四部分：用户收货地址 API (基于 sys_user_address 表)
1. 新增收货地址
- 功能: 为当前登录用户添加一条新的收货地址。
- HTTP 方法: POST
- Endpoint: /api/addresses
- 请求 (Input):
  - Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  - Body:
    {
  "address_name": "公司地址",
  "receiver": "王五",
  "phone": "13700137000",
  "province": "河南省",
  "city": "郑州市",
  "county": "中牟县",
  "detail_address": "官渡镇XX村XX号",
  "is_default": true,
  "postal_code": "451400"
}
- 响应 (Output):
  - 成功 (HTTP 201 Created):
    {
  "code": 201,
  "message": "地址添加成功。",
  "data": {
    "address_id": 101
  }
}

---
2. 获取用户地址列表
- 功能: 查询当前登录用户的所有收货地址。
- HTTP 方法: GET
- Endpoint: /api/addresses
- 请求 (Input):
  - Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "获取地址列表成功。",
  "data": [
    {
      "address_id": 101,
      "address_name": "公司地址",
      "receiver": "王五",
      "phone": "13700137000",
      "full_address": "河南省郑州市中牟县官渡镇XX村XX号",
      "is_default": true
    },
    {
      "address_id": 102,
      "address_name": "家里地址",
      "receiver": "王五",
      "phone": "13700137000",
      "full_address": "河南省郑州市金水区XX小区XX号楼",
      "is_default": false
    }
  ]
}

---
3. 修改收货地址
- 功能: 更新某一条指定的收货地址信息。
- HTTP 方法: PUT
- Endpoint: /api/addresses/101
- 请求 (Input):
  - Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
  - Body:
    {
  "receiver": "王小五",
  "phone": "13700137001"
}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "地址修改成功。"
}

---
4. 删除收货地址
- 功能: 删除一条指定的收货地址。
- HTTP 方法: DELETE
- Endpoint: /api/addresses/102
- 请求 (Input):
  - Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- 响应 (Output):
  - 成功 (HTTP 204 No Content):
(无响应体)
  - 失败 (HTTP 404 Not Found):
    {
  "code": 404,
  "message": "删除失败。",
  "error": "地址 '102' 不存在或您无权删除。"
}

---
5. 设置默认收货地址
- 功能: 将某条地址设置为用户的默认收货地址。
- HTTP 方法: PATCH
- Endpoint: /api/addresses/102/default
- 请求 (Input):
  - Headers: Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "默认地址设置成功。"
}
1. 认证类型管理 API (管理员): 用于平台管理员配置和管理可用的认证类型。
2. 用户认证申请 API (用户): 供农户或买家提交、查询和管理自己的认证申请。
3. 认证审核 API (管理员): 供平台管理员审核用户的认证申请。
1.1. 获取认证类型列表
- 功能: 管理员或用户获取当前启用且符合条件的认证类型列表。
- HTTP 方法: GET
- Endpoint: /api/cert-types
- 请求 (Input):
  - Headers: Authorization: Bearer {token}
  - Query Params (可选):
    - user_type: 1 (获取农户可用), 2 (获取买家可用)。(普通用户此参数自动从token中解析，无需传递)
    - cert_level: 1 (基础认证), 2 (高级认证)
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "获取认证类型列表成功。",
  "data": [
    {
      "cert_type_id": 1,
      "cert_type_code": "ID_CARD",
      "cert_type_name": "身份证实名认证",
      "cert_level": 1,
      "required_materials": [
        {"material_type": "ID_CARD_FRONT", "desc": "身份证正面照", "format": "JPG/PNG", "size_limit": "≤5MB"},
        {"material_type": "ID_CARD_BACK", "desc": "身份证反面照", "format": "JPG/PNG", "size_limit": "≤5MB"}
      ],
      "optional_materials": [],
      "audit_cycle": "24 小时内"
    },
    {
      "cert_type_id": 3,
      "cert_type_code": "ENTERPRISE_BIZ",
      "cert_type_name": "企业营业执照认证",
      "cert_level": 2,
      "required_materials": [
         {"material_type": "BIZ_LICENSE", "desc": "营业执照正本照", "format": "JPG/PNG", "size_limit": "≤10MB"}
      ],
      "optional_materials": [],
      "audit_cycle": "1-2 个工作日"
    }
  ]
}
1.2. (管理员)创建认证类型
- 功能: 管理员新增一种认证类型配置。
- HTTP 方法: POST
- Endpoint: /api/admin/cert-types
- 请求 (Input):
  - Headers: Authorization: Bearer {admin_token}
  - Body: (包含sys_cert_type表中的所有核心配置字段)
    {
  "cert_type_code": "INDIVIDUAL_BIZ",
  "cert_type_name": "个人营业执照认证",
  "apply_user_type": 1,
  "cert_level": 2,
  "required_materials": "[{\"material_type\":\"BIZ_LICENSE\",\"desc\":\"营业执照正本照\",\"format\":\"JPG/PNG\",\"size_limit\":\"≤10MB\"}]",
  "optional_materials": "[]",
  "audit_cycle": "1-2 个工作日",
  "audit_user_role": 3,
  "cert_status_effect": "{\"sys_user.cert_status\":3}",
  "cert_type_status": 1,
  "sort": 10
}
- 响应 (Output):
  - 成功 (HTTP 201 Created):
    {
  "code": 201,
  "message": "认证类型创建成功。",
  "data": {
    "cert_type_id": 4
  }
}

---
1. 用户认证申请 API (用户)
2.1. 创建认证申请 (草稿)
- 功能: 用户选择一个认证类型，系统为其创建一个状态为“待提交”的申请记录。
- HTTP 方法: POST
- Endpoint: /api/cert-apply
- 请求 (Input):
  - Headers: Authorization: Bearer {user_token}
  - Body:
    {
  "cert_type_id": 1
}
- 响应 (Output):
  - 成功 (HTTP 201 Created):
    {
  "code": 201,
  "message": "认证申请创建成功，请提交认证信息和材料。",
  "data": {
    "apply_id": 1001,
    "apply_no": "CERT2025111512345678",
    "apply_status": 0
  }
}
2.2. 上传认证材料
- 功能: 为指定的认证申请上传一个材料文件。
- HTTP 方法: POST
- Endpoint: /api/cert-apply/{apply_id}/materials
- 请求 (Input):
  - Headers: Authorization: Bearer {user_token}
  - Body: multipart/form-data
    - file: (文件本身)
    - material_type: "ID_CARD_FRONT"
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "材料上传成功。",
  "data": {
    "material_id": 501,
    "material_name": "身份证正面照（张三）.jpg",
    "material_url": "https://xxx.com/cert/20251115/ID_CARD_FRONT_123.jpg"
  }
}
  - 失败 (HTTP 400 Bad Request):
    {
  "code": 400,
  "message": "上传失败。",
  "error": "文件大小超出5MB限制。"
}
2.3. 提交认证申请
- 功能: 用户填写完核心信息并上传完所有必需材料后，正式提交申请以供审核。
- HTTP 方法: POST
- Endpoint: /api/cert-apply/{apply_id}/submit
- 请求 (Input):
  - Headers: Authorization: Bearer {user_token}
  - Body (包含 apply_info 的内容):
    {
  "apply_info": {
    "real_name": "张三",
    "id_card_no": "410101199001011234",
    "id_card_valid_start": "2010-01-01",
    "id_card_valid_end": "2030-01-01"
  }
}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "认证申请已提交，请等待审核。"
}
  - 失败 (HTTP 400 Bad Request):
  
    {
  "code": 400,
  "message": "提交失败。",
  "error": "必需材料 '身份证反面照' 尚未上传。"
}
2.4. 获取我的认证申请列表
- 功能: 查询当前用户的所有认证申请记录。
- HTTP 方法: GET
- Endpoint: /api/cert-apply/my-list
- 请求 (Input):
  - Headers: Authorization: Bearer {user_token}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询成功。",
  "data": [
    {
      "apply_id": 1001,
      "apply_no": "CERT2025111512345678",
      "cert_type_name": "身份证实名认证",
      "apply_status": 1,
      "apply_time": "2025-11-15T10:00:00Z",
      "audit_remark": null
    },
    {
      "apply_id": 985,
      "apply_no": "CERT2025102000001111",
      "cert_type_name": "企业营业执照认证",
      "apply_status": 3,
      "apply_time": "2025-10-20T11:00:00Z",
      "audit_remark": "营业执照照片模糊，请重新上传清晰的正本照片。"
    }
  ]
}

---
4. 认证审核 API (管理员)
3.1. 获取待审核的认证申请列表
- 功能: 管理员分页查询所有待审核 (apply_status=1)的申请。
- HTTP 方法: GET
- Endpoint: /api/admin/cert-apply?status=1&page=1&pageSize=10
- 请求 (Input):
  - Headers: Authorization: Bearer {admin_token}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询成功。",
  "data": {
    "total": 15,
    "list": [
      {
        "apply_id": 1001,
        "apply_no": "CERT2025111512345678",
        "user_id": 1001,
        "user_name": "nonghu_zhang3",
        "cert_type_name": "身份证实名认证",
        "apply_time": "2025-11-15T10:00:00Z"
      }
    ]
  }
}
3.2. 获取认证申请详情 (供审核)
- 功能: 管理员获取单个申请的全部详细信息，包括申请人信息、提交的核心信息和所有材料。
- HTTP 方法: GET
- Endpoint: /api/admin/cert-apply/{apply_id}
- 请求 (Input):
  - Headers: Authorization: Bearer {admin_token}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询成功。",
  "data": {
    "apply_id": 1001,
    "user_info": {"user_id": 1001, "user_name": "nonghu_zhang3"},
    "cert_type_name": "身份证实名认证",
    "apply_info": {
      "real_name": "张三",
      "id_card_no": "4101...1234",
      "id_card_valid_start": "2010-01-01",
      "id_card_valid_end": "2030-01-01"
    },
    "materials": [
      {"material_type": "ID_CARD_FRONT", "material_url": "https://.../ID_CARD_FRONT_123.jpg"},
      {"material_type": "ID_CARD_BACK", "material_url": "https://.../ID_CARD_BACK_124.jpg"}
    ],
    "apply_status": 1,
    "apply_time": "2025-11-15T10:00:00Z"
  }
}
3.3. 审核通过认证申请
- 功能: 管理员批准一个认证申请，系统将自动更新申请状态和用户相关状态。
- HTTP 方法: POST
- Endpoint: /api/admin/cert-apply/{apply_id}/approve
- 请求 (Input):
  - Headers: Authorization: Bearer {admin_token}
  - Body:
    {
  "audit_remark": "认证信息核实无误，予以通过。",
  "cert_expire_time": "2030-01-01T00:00:00Z"
}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "申请 '1001' 已审核通过。"
}
3.4. 审核驳回认证申请
- 功能: 管理员驳回一个认证申请，并提供驳回原因。
- HTTP 方法: POST
- Endpoint: /api/admin/cert-apply/{apply_id}/reject
- 请求 (Input):
  - Headers: Authorization: Bearer {admin_token}
  - Body:
    {
  "reject_reason_type": 1,
  "audit_remark": "身份证正面照片反光严重，关键信息无法识别，请重新上传。"
}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "申请 '1001' 已驳回。"
}
  
第三部分：商城基础配置 API
这部分 API 主要涵盖商品品类管理、营销活动（折扣、优惠券）的配置与用户侧的功能。

---
1. 农产品品类 API (基于 mall_product_category 表)
1.1. 获取品类树
- 功能: 供前端（用户或管理员）获取层级结构的品类列表，用于导航、筛选或商品发布。
- HTTP 方法: GET
- Endpoint: /api/categories/tree
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "获取品类树成功。",
  "data": [
    {
      "category_id": 1,
      "parent_id": 0,
      "category_name": "粮食作物",
      "category_code": "GRAIN",
      "category_icon": "https://example.com/icon/grain.png",
      "children": [
        {
          "category_id": 101,
          "parent_id": 1,
          "category_name": "小麦",
          "category_code": "GRAIN-WHEAT",
          "category_icon": "https://example.com/icon/wheat.png",
          "children": []
        }
      ]
    }
  ]
}
1.2. (管理员)创建品类
- 功能: 管理员添加新的一级或子级品类。
- HTTP 方法: POST
- Endpoint: /api/admin/categories
- 请求 (Input):
  - Headers: Authorization: Bearer {admin_token}
  - Body:
    {
  "parent_id": 1,
  "category_name": "玉米",
  "category_code": "GRAIN-CORN",
  "category_icon": "https://example.com/icon/corn.png",
  "sort": 10,
  "status": 1
}
- 响应 (Output):
  - 成功 (HTTP 201 Created):
    {
  "code": 201,
  "message": "品类创建成功。",
  "data": {
    "category_id": 102
  }
}

---
2. 折扣活动 API (基于 mall_discount_activity 表)
2.1. 获取进行中的活动列表
- 功能: 供用户查看当前可以参与的所有折扣活动。
- HTTP 方法: GET
- Endpoint: /api/activities
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "获取活动列表成功。",
  "data": [
    {
      "activity_id": 1,
      "activity_no": "DIS20250925123456",
      "activity_name": "2025 临期小麦折扣",
      "activity_type": 1,
      "end_time": "2025-09-30T23:59:59Z",
      "discount_rule": "临期≤15 天 8 折，≤7 天 6 折"
    }
  ]
}
2.2. (管理员)创建折扣活动
- 功能: 管理员配置并创建一个新的折扣活动。
- HTTP 方法: POST
- Endpoint: /api/admin/activities
- 请求 (Input):
  - Headers: Authorization: Bearer {admin_token}
  - Body:
    {
  "activity_name": "国庆节清仓大促",
  "activity_type": 2,
  "start_time": "2025-10-01T00:00:00Z",
  "end_time": "2025-10-07T23:59:59Z",
  "discount_rule": "全场指定商品 7 折",
  "apply_category_ids": "101,203"
}
- 响应 (Output):
  - 成功 (HTTP 201 Created):
    {
  "code": 201,
  "message": "折扣活动创建成功。",
  "data": {
    "activity_id": 2
  }
}
2.3. (管理员)获取活动详情与统计
- 功能: 管理员查看特定活动的详细信息及实时销售数据。
- HTTP 方法: GET
- Endpoint: /api/admin/activities/{activity_id}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "获取活动详情成功。",
  "data": {
    "activity_id": 1,
    "activity_no": "DIS20250925123456",
    "activity_name": "2025 临期小麦折扣",
    "activity_status": 1,
    "total_source_count": 50,
    "total_order_count": 120,
    "total_sales_amount": "85000.00"
  }
}

---
3. 优惠券 API (基于 mall_coupon_rule, mall_user_coupon, mall_coupon_log 表)
3.1. (管理员)创建优惠券规则
- 功能: 管理员定义一种新的优惠券。
- HTTP 方法: POST
- Endpoint: /api/admin/coupon-rules
- 请求 (Input):
  - Headers: Authorization: Bearer {admin_token}
  - Body (示例: 满减券):
    {
  "coupon_type": 1,
  "coupon_name": "新用户满200减30券",
  "face_value": 30.00,
  "min_use_amount": 200.00,
  "valid_start_time": "2025-10-01T00:00:00Z",
  "valid_end_time": "2025-12-31T23:59:59Z",
  "total_quantity": 10000,
  "obtain_limit": 1,
  "obtain_type": 2
}
- 响应 (Output):
  - 成功 (HTTP 201 Created):
    {
  "code": 201,
  "message": "优惠券规则创建成功。",
  "data": {
    "rule_id": 101
  }
}
3.2. 获取可领取的优惠券列表
- 功能: 用户在领券中心查看所有obtain_type=1（手动领取）且在有效期内的优惠券。
- HTTP 方法: GET
- Endpoint: /api/coupons/claimable
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询成功。",
  "data": [
    {
      "rule_id": 102,
      "coupon_name": "全场95折优惠券",
      "coupon_type": 2,
      "min_use_amount": "0.00",
      "max_discount_amount": "50.00",
      "valid_period": "2025-11-01 至 2025-11-30"
    }
  ]
}
3.3. 用户领取优惠券
- 功能: 用户点击领取一张优惠券。
- HTTP 方法: POST
- Endpoint: /api/my-coupons/claim
- 请求 (Input):
  - Headers: Authorization: Bearer {user_token}
  - Body:
    {
  "rule_id": 102
}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "优惠券领取成功！",
  "data": {
    "user_coupon_id": 5001,
    "coupon_no": "CPN2025102611223344"
  }
}
  - 失败 (HTTP 409 Conflict):
    {
  "code": 409,
  "message": "领取失败。",
  "error": "您已达到该优惠券的领取上限。"
}
3.4. 获取我的优惠券列表
- 功能: 用户在个人中心查看自己拥有（未使用、已使用、已过期）的优惠券。
- HTTP 方法: GET
- Endpoint: /api/my-coupons?status=0
- 请求 (Input):
  - Headers: Authorization: Bearer {user_token}
  - Query Params: status (0=未使用, 1=已使用, 2=已过期)
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询成功。",
  "data": [
    {
      "user_coupon_id": 5001,
      "coupon_name": "全场95折优惠券",
      "coupon_no": "CPN2025102611223344",
      "use_status": 0,
      "valid_start_time": "2025-11-01T00:00:00Z",
      "valid_end_time": "2025-11-30T23:59:59Z",
      "description": "全场通用，最高可抵扣50元"
    },
    {
      "user_coupon_id": 4998,
      "coupon_name": "新用户满200减30券",
      "coupon_no": "CPN2025100109001122",
      "use_status": 0,
      "valid_start_time": "2025-10-01T00:00:00Z",
      "valid_end_time": "2025-12-31T23:59:59Z",
      "description": "满200元可用"
    }
  ]
}
3.5. (管理员)查询优惠券使用日志
- 功能: 管理员根据条件追溯某张优惠券的生命周期记录。
- HTTP 方法: GET
- Endpoint: /api/admin/coupon-logs?user_coupon_id=5001
- 请求 (Input):
  - Headers: Authorization: Bearer {admin_token}
  - Query Params: user_coupon_id 或 order_id 或 user_id
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询日志成功。",
  "data": [
    {
      "log_id": 9001,
      "operate_type": 1,
      "operate_time": "2025-10-26T11:00:00Z",
      "operate_desc": "用户领取全场95折优惠券"
    }
    // ... 如果有后续操作，会继续列出
  ]
}
  

第四部分：货源与求购 API

---
1. 农户货源 API (基于 mall_farmer_source 表)
1.1. (农户)发布货源
- 功能: 农户创建一个新的货源信息，等待平台审核。
- HTTP 方法: POST
- Endpoint: /api/farmer/sources
- 请求 (Input):
  - Headers: Authorization: Bearer {farmer_token}
  - Body:
    {
  "category_id": 101,
  "product_name": "2025新产冬小麦（有机认证）",
  "product_spec": "50kg / 袋，容重≥770g/L",
  "origin": "河南省郑州市中牟县官渡镇",
  "harvest_date": "2025-06-15",
  "expire_date": "2026-06-14",
  "total_quantity": 10000.00,
  "unit_price": 2.85,
  "batch_price": 2.60,
  "batch_quantity": 5000.00,
  "product_images": "[\"https://.../img1.jpg\", \"https://.../img2.jpg\"]",
  "product_desc": "<p>采用有机肥种植，全程无农药残留，品质上乘。</p>",
  "logistics_type": 2,
  "freight_rule": "整车运输，运费买家承担",
  "min_order_quantity": 1000.00
}
- 响应 (Output):
  - 成功 (HTTP 201 Created):
    {
  "code": 201,
  "message": "货源发布成功，等待平台审核。",
  "data": {
    "source_id": 10001,
    "source_no": "SRC20251026000001",
    "audit_status": 0
  }
}
1.2. 搜索/浏览货源列表
- 功能: 任何用户（主要是买家）根据品类、关键词、价格等条件筛选货源。
- HTTP 方法: GET
- Endpoint: /api/sources?category_id=101&keyword=小麦&sort=price_asc&page=1
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询成功。",
  "data": {
    "total": 58,
    "list": [
      {
        "source_id": 10001,
        "product_name": "2025新产冬小麦（有机认证）",
        "origin": "河南省郑州市中牟县",
        "unit_price": "2.85",
        "min_order_quantity": "1000.00",
        "main_image": "https://.../img1.jpg",
        "is_discount": false
      }
    ]
  }
}
1.3. 获取货源详情
- 功能: 查看单个货源的完整信息。
- HTTP 方法: GET
- Endpoint: /api/sources/{source_id}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询成功。",
  "data": {
    "source_id": 10001,
    "product_name": "2025新产冬小麦（有机认证）",
    "source_status": 1,
    "surplus_quantity": "10000.00",
    // ... (包含 mall_farmer_source 表中所有可公开的字段)"seller_info": {
      "user_id": 1001,
      "farm_name": "张三的有机农场",
      "cert_status": 1
    }
  }
}
1.4. (管理员)审核货源
- 功能: 管理员审核农户提交的货源信息。
- HTTP 方法: PATCH
- Endpoint: /api/admin/sources/{source_id}/audit
- 请求 (Input):
  - Headers: Authorization: Bearer {admin_token}
  - Body:
    {
  "audit_status": 1, // 1=通过, 2=驳回"audit_remark": "审核通过"
}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "货源审核操作成功。"
}

---
2. 买家求购 API (基于 mall_buyer_demand 表)
2.1. (买家)发布求购
- 功能: 买家发布自己的采购需求。
- HTTP 方法: POST
- Endpoint: /api/buyer/demands
- 请求 (Input):
  - Headers: Authorization: Bearer {buyer_token}
  - Body:
    {
  "category_id": 201,
  "product_name": "新鲜番茄（商超专用）",
  "product_spec": "直径5-7cm，硬度≥6kg/cm²",
  "required_quantity": 5000.00,
  "max_unit_price": 3.50,
  "delivery_address_id": 123,
  "latest_delivery_date": "2025-10-15",
  "payment_type": 1,
  "demand_desc": "每周送货1次，按箱包装，要求有质检报告。"
}
- 响应 (Output):
  - 成功 (HTTP 201 Created):
    {
  "code": 201,
  "message": "求购信息发布成功。",
  "data": {
    "demand_id": 2001,
    "demand_no": "DEM20251026000001"
  }
}
2.2. 搜索/浏览求购列表
- 功能: 农户根据品类、地区等条件搜索匹配的求购信息。
- HTTP 方法: GET
- Endpoint: /api/demands?category_id=201
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询成功。",
  "data": {
    "total": 12,
    "list": [
      {
        "demand_id": 2001,
        "product_name": "新鲜番茄（商超专用）",
        "required_quantity": "5000.00",
        "max_unit_price": "3.50",
        "delivery_city": "郑州市",
        "latest_delivery_date": "2025-10-15"
      }
    ]
  }
}
第五部分：订单与履约 API

---
3. 订单创建与管理 API (基于 mall_order_main, mall_order_item 表)
1.1. (买家)创建订单
- 功能: 买家直接从货源页面下单，或从一个已确认的匹配创建订单。
- HTTP 方法: POST
- Endpoint: /api/orders
- 请求 (Input):
  - Headers: Authorization: Bearer {buyer_token}
  - Body:
    {
  "source_id": 10001,
  "quantity": 2000.00,
  "receiver_address_id": 123,
  "user_coupon_id": 5001, // 可选"order_remark": "请使用防水包装"
}
- 响应 (Output):
  - 成功 (HTTP 201 Created):
    {
  "code": 201,
  "message": "订单创建成功，请尽快支付。",
  "data": {
    "order_id": "ORD20251110000001",
    "pay_amount": "5600.00" // 假设运费100，优惠0
  }
}
1.2. 获取订单列表
- 功能: 买家或卖家查看自己的订单列表。
- HTTP 方法: GET
- Endpoint: /api/orders?status=1
- 请求 (Input):
  - Headers: Authorization: Bearer {user_token}
  - Query: status (0=待付款, 1=待发货, 等)
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询成功。",
  "data": [
    {
      "order_id": "ORD20251110000001",
      "order_status": 1,
      "pay_amount": "5600.00",
      "seller_name": "张三的有机农场", // 如果是买家看"buyer_name": "美味果蔬超市",   // 如果是卖家看"items": [
        {
          "product_name": "2025新产冬小麦（有机认证）",
          "item_quantity": "2000.00"
        }
      ]
    }
  ]
}
1.3. 获取订单详情
- 功能: 查看单个订单的完整信息，包括商品、支付、物流、收货人等。
- HTTP 方法: GET
- Endpoint: /api/orders/{order_id}
- 响应 (Output):
  - 成功 (HTTP 200 OK): (返回 mall_order_main 和 mall_order_item 的组合信息)
    {
  "code": 200,
  "message": "查询成功。",
  "data": {
    "order_id": "ORD20251110000001",
    "order_status": 1,
    // ...订单主表所有信息"items": [
      // ...订单明细表所有信息
    ],
    "receiver_info": {
      // ...收货地址信息
    }
  }
}

---
4. 订单履约 API (支付、发货、收货)
2.1. (买家)支付订单
- 功能: 买家对一个“待付款”的订单发起支付，后端与支付网关交互。
- HTTP 方法: POST
- Endpoint: /api/orders/{order_id}/pay
- 请求 (Input):
  - Headers: Authorization: Bearer {buyer_token}
  - Body:
    {
  "payment_method": "WECHAT_PAY"
}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "支付请求已生成。",
  "data": {
    "payment_gateway_payload": {
      // ...调用微信/支付宝支付所需的信息
    }
  }
}
2.2. (卖家)标记发货
- 功能: 卖家对一个“待发货”的订单进行发货处理，填写物流信息。
- HTTP 方法: POST
- Endpoint: /api/farmer/orders/{order_id}/ship
- 请求 (Input):
  - Headers: Authorization: Bearer {farmer_token}
  - Body:
    {
  "delivery_type": 2,
  "logistics_company": "德邦物流",
  "logistics_no": "DB123456789"
}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "发货成功，订单状态已更新为“待收货”。"
}
2.3. (买家)确认收货
- 功能: 买家确认收到货物，订单流程完成。
- HTTP 方法: POST
- Endpoint: /api/buyer/orders/{order_id}/confirm-receipt
- 请求 (Input):
  - Headers: Authorization: Bearer {buyer_token}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "确认收货成功，订单已完成。"
}

---
5. 发票管理 API (基于 mall_order_invoice 表)
3.1. (买家)申请发票
- 功能: 买家对一个已完成的订单申请开具发票。
- HTTP 方法: POST
- Endpoint: /api/orders/{order_id}/invoice/apply
- 请求 (Input):
  - Headers: Authorization: Bearer {buyer_token}
  - Body:
    {
  "invoice_type": 2,
  "invoice_title": "美味果蔬超市",
  "taxpayer_id": "91410100MA12345678",
  "delivery_way": 1
}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "发票申请已提交，等待处理。"
}
3.2. (管理员)更新发票状态
- 功能: 管理员处理发票申请，如标记“已开具”并上传电子发票URL。
- HTTP 方法: PATCH
- Endpoint: /api/admin/invoices/{invoice_id}
- 请求 (Input):
  - Headers: Authorization: Bearer {admin_token}
  - Body:
    {
  "invoice_status": 2,
  "invoice_no": "INV20251110000001",
  "invoice_url": "https://.../invoice/INV20251110000001.pdf"
}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "发票状态更新成功。"
}
  
第六部分：用户行为 API

---
1. 用户足迹 API (基于 mall_user_footprint 表)
- 关于足迹的创建: 用户足迹通常不是通过一个专门的 API 来“创建”的。它是在用户调用其他 API（如 GET /api/sources/{source_id}）时，由后端服务自动异步记录的。
1.1. 获取我的浏览足迹
- 功能: 用户查看自己最近浏览过的货源或求购信息。
- HTTP 方法: GET
- Endpoint: /api/my/footprints?type=1&page=1&pageSize=20
- 请求 (Input):
  - Headers: Authorization: Bearer {user_token}
  - Query Params:
    - type: 1=货源, 2=求购 (必需)
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询成功。",
  "data": {
    "total": 5,
    "list": [
      {
        "footprint_id": 3001,
        "view_obj_id": 10001,
        "view_obj_name": "2025 新产冬小麦（有机）",
        "view_time": "2025-10-26T14:30:00Z"
      },
      {
        "footprint_id": 3002,
        "view_obj_id": 10005,
        "view_obj_name": "山东红富士苹果",
        "view_time": "2025-10-26T11:15:00Z"
      }
    ]
  }
}
1.2. 删除浏览足迹
- 功能: 用户从自己的足迹列表中移除一条或多条记录。
- HTTP 方法: DELETE
- Endpoint: /api/my/footprints
- 请求 (Input):
  - Headers: Authorization: Bearer {user_token}
  - Body:
    {
  "footprint_ids": [3001, 3002]
}
```*   **响应 (Output)**:
  - 成功 (HTTP 204 No Content):
(无响应体)

---
2. 用户关注 API (基于 mall_user_follow 表)
2.1. 关注一个卖家（店铺）
- 功能: 买家关注一个自己感兴趣的农户卖家。
- HTTP 方法: POST
- Endpoint: /api/my/follows
- 请求 (Input):
  - Headers: Authorization: Bearer {buyer_token}
  - Body:
    {
  "seller_id": 1001,
  "follow_remark": "优质小麦卖家"
}
- 响应 (Output):
  - 成功 (HTTP 201 Created):
    {
  "code": 201,
  "message": "关注成功。",
  "data": {
    "follow_id": 401
  }
}
2.2. 取消关注一个卖家
- 功能: 买家取消对一个卖家的关注。
- HTTP 方法: DELETE
- Endpoint: /api/my/follows/{seller_id}
- 请求 (Input):
  - Headers: Authorization: Bearer {buyer_token}
  - Path Param: seller_id (被取消关注的卖家用户ID)
- 响应 (Output):
  - 成功 (HTTP 204 No Content):
(无响应体)
2.3. 获取我关注的店铺列表
- 功能: 买家查看自己所有关注的卖家店铺列表。
- HTTP 方法: GET
- Endpoint: /api/my/follows
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询成功。",
  "data": [
    {
      "follow_id": 401,
      "seller_id": 1001,
      "seller_name": "张三的有机农场",
      "source_count": 15,
      "avg_score": "4.90",
      "follow_time": "2025-10-25T10:00:00Z"
    }
  ]
}
第七部分：售后与统计 API

---
3. 订单售后 API (基于 mall_order_aftersale 表)
1.1. (买家)申请售后
- 功能: 买家对已收货的订单发起退款等售后请求。
- HTTP 方法: POST
- Endpoint: /api/orders/{order_id}/aftersale/apply
- 请求 (Input):
  - Headers: Authorization: Bearer {buyer_token}
  - Body:
    {
  "aftersale_type": 1,
  "apply_amount": 500.00,
  "reason": "部分小麦有发霉迹象，申请部分退款。",
  "proof_images": "[\"https://.../proof1.jpg\", \"https://.../proof2.jpg\"]"
}
- 响应 (Output):
  - 成功 (HTTP 201 Created):
    {
  "code": 201,
  "message": "售后申请已提交，等待平台审核。",
  "data": {
    "aftersale_id": 601
  }
}
1.2. (管理员)审核售后申请
- 功能: 平台管理员介入处理买家的售后请求。
- HTTP 方法: POST
- Endpoint: /api/admin/aftersale/{aftersale_id}/review
- 请求 (Input):
  - Headers: Authorization: Bearer {admin_token}
  - Body:
    {
  "audit_status": 1, // 1=通过, 2=驳回"audit_remark": "情况属实，同意退款申请。"
}
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "售后审核操作成功。"
}

---
4. 用户收藏 API (基于 mall_user_collection 表)
2.1. 添加收藏
- 功能: 用户收藏一个货源或求购信息。
- HTTP 方法: POST
- Endpoint: /api/my/collections
- 请求 (Input):
  - Headers: Authorization: Bearer {user_token}
  - Body:
    {
  "collection_type": 1, // 1=货源"source_id": 10001
}
- 响应 (Output):
  - 成功 (HTTP 201 Created):
    {
  "code": 201,
  "message": "收藏成功。",
  "data": {
    "collection_id": 701
  }
}
2.2. 取消收藏
- 功能: 用户取消一个收藏。
- HTTP 方法: DELETE
- Endpoint: /api/my/collections/{collection_id}
- 响应 (Output):
  - 成功 (HTTP 204 No Content):
(无响应体)
2.3. 获取我的收藏列表
- 功能: 用户查看自己收藏的所有货源或求购。
- HTTP 方法: GET
- Endpoint: /api/my/collections?type=1
- 响应 (Output):
  - 成功 (HTTP 200 OK):
    {
  "code": 200,
  "message": "查询成功。",
  "data": [
    {
      "collection_id": 701,
      "collection_type": 1,
      "source_id": 10001,
      "collection_name": "2025 新产冬小麦（有机）",
      "collection_time": "2025-10-26T15:00:00Z"
    }
  ]
}

---
5. 数据统计 API (基于 mall_product_price_stat 表)
- 关于统计数据的创建: 这类数据通常由后台的**定时任务（Scheduled Job/Cron Job）**每天凌晨聚合计算前一天的数据并存入表中，而没有直接的 API 入口。
3.1. 获取产品价格走势（暂定）
- 功能: 供前端展示某个品类在一段时间内的价格变化曲线。
- HTTP 方法: GET
- Endpoint: /api/stats/price-trends?category_id=101&start_date=2025-09-01&end_date=2025-09-30
- 请求 (Input):
  - Query Params:
    - category_id: 品类ID (必需)
    - start_date, end_date: 日期范围 (必需)
- 响应 (Output):
  - 成功 (HTTP 200 OK):
  -  
  - 
  - 
    {
  "code": 200,
  "message": "查询成功。",
  "data": {
    "category_name": "小麦",
    "trends": [
      {
        "stat_date": "2025-09-25",
        "avg_price": "2.85",
        "max_price": "3.00",
        "min_price": "2.70",
        "price_trend": 2 // 2=下跌
      },
      {
        "stat_date": "2025-09-26",
        "avg_price": "2.84",
        "max_price": "2.98",
        "min_price": "2.70",
        "price_trend": 2 // 2=下跌
      }
    ]
  }
}
  