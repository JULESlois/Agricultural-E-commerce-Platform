
import { Product, LoanProduct, Expert, NavItem, LoanApplication, Shop, Coupon, ProcurementDemand, Invoice, LogisticsInfo, Address, OrderDetail, BuyerReview, Article } from './types';
import { LayoutDashboard, ShoppingBag, Landmark, GraduationCap, LifeBuoy, User, MapPin, Package, FileText, Settings, CreditCard, MessageSquare, ClipboardList, Store, PieChart, ShieldAlert, Heart, Clock, Users, Home, GitPullRequest, Zap } from 'lucide-react';

// --- Design Tokens ---
export const COLORS = {
  primaryGreen: '#4CAF50',
  primaryBlue: '#1976D2',
  accentOrange: '#FF9800',
  textPrimary: '#212121',
  textSecondary: '#757575',
  bgPage: '#FAFAFA',
  bgWhite: '#FFFFFF',
  border: '#E0E0E0',
  knowledgeGreen: '#2E7D32',
};

export const SPACING = {
  xs: '4px',
  s: '8px',
  m: '16px',
  l: '24px',
  xl: '40px',
  xxl: '60px',
};

// --- Navigation Config ---

export const PORTAL_NAV_ITEMS: NavItem[] = [
  { label: '首页', path: '/' },
  { label: '产链直销', path: '/mall' },
  { label: '助农金融', path: '/finance' },
  { label: '专家智库', path: '/knowledge' },
  { label: '用户社区', path: '/community' },
  { label: '帮助中心', path: '/help' },
];

export const DASHBOARD_MENU: Record<string, any[]> = {
  FARMER: [
    { label: '经营概览', path: '/mall/seller/dashboard', icon: LayoutDashboard },
    { label: '智能匹配', path: '/mall/seller/match', icon: Zap },
    { label: '货源管理', path: '/mall/seller/product', icon: Package },
    { label: '订单管理', path: '/mall/seller/orders', icon: ClipboardList },
    { label: '评价管理', path: '/mall/seller/reviews', icon: MessageSquare },
    { label: '我的借款', path: '/finance/farmer', icon: Landmark },
    { label: '店铺设置', path: '/mall/seller/settings', icon: Settings },
  ],
  BUYER: [
    { label: '个人中心', path: '/mall/buyer/dashboard', icon: LayoutDashboard },
    { label: '大宗求购', path: '/mall/buyer/procurement/post', icon: GitPullRequest },
    { label: '智能推荐', path: '/mall/buyer/match', icon: Zap },
    { label: '我的订单', path: '/mall/buyer/orders', icon: Package },
    { label: '收货地址', path: '/mall/buyer/address', icon: MapPin },
    { label: '支付管理', path: '/mall/buyer/payment', icon: CreditCard },
    { label: '我的评价', path: '/mall/buyer/reviews', icon: MessageSquare },
    { label: '发票管理', path: '/mall/buyer/invoices', icon: FileText },
    { label: '账号设置', path: '/mall/buyer/settings', icon: Settings },
  ],
  BANKER: [
    { label: '信贷工作台', path: '/finance/banker/dashboard', icon: LayoutDashboard },
    { label: '贷款审批', path: '/finance/banker/approvals', icon: FileText },
    { label: '贷后监控', path: '/finance/banker/monitoring', icon: ShieldAlert },
    { label: '客户管理', path: '/finance/customers', icon: Users },
  ],
  EXPERT: [
    { label: '专家工作台', path: '/expert/dashboard', icon: LayoutDashboard },
    { label: '咨询管理', path: '/expert/consultations', icon: MessageSquare },
    { label: '文章管理', path: '/expert/articles', icon: FileText },
    { label: '个人设置', path: '/expert/settings', icon: Settings },
  ]
};

// --- Mock Data ---

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    title: '有机红富士苹果 (特级)',
    price: 85.00,
    origin: '山东烟台',
    category: '水果',
    imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    farmerName: '绿源果蔬合作社',
    stock: 1200,
    tags: ['有机认证', '产地直发'],
    specs: '5kg/箱',
    moq: 1
  },
  {
    id: 'p2',
    title: '东北五常大米 10kg',
    price: 128.00,
    origin: '黑龙江五常',
    category: '粮油',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    farmerName: '黑土粮仓',
    stock: 500,
    tags: ['新米上市', '地理标志'],
    specs: '10kg/袋',
    moq: 2
  },
  {
    id: 'p3',
    title: '赣南脐橙 5kg',
    price: 45.90,
    origin: '江西赣州',
    category: '水果',
    imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    farmerName: '橙心橙意果园',
    stock: 3000,
    tags: ['现摘现发'],
    specs: '5kg/箱',
    moq: 1
  },
  {
    id: 'p4',
    title: '高山云雾绿茶 (明前)',
    price: 268.00,
    origin: '浙江杭州',
    category: '茶叶',
    imageUrl: 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    farmerName: '云端茶厂',
    stock: 150,
    tags: ['手工炒制'],
    specs: '250g/罐',
    moq: 1
  },
  {
    id: 'p5',
    title: '海南金煌芒 3kg',
    price: 58.00,
    origin: '海南三亚',
    category: '水果',
    imageUrl: 'https://images.unsplash.com/photo-1553279768-11e670b59d9a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    farmerName: '热带阳光果园',
    stock: 800,
    tags: ['树上熟'],
    specs: '3kg/箱',
    moq: 1
  },
  {
    id: 'p6',
    title: '散养土鸡蛋 30枚',
    price: 48.00,
    origin: '安徽六安',
    category: '畜牧',
    imageUrl: 'https://images.unsplash.com/photo-1598965628757-7054a10e6a4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    farmerName: '老张家养殖场',
    stock: 200,
    tags: ['谷物喂养'],
    specs: '30枚/盒',
    moq: 2
  }
];

export const MOCK_LOANS: LoanProduct[] = [
  { id: 'l1', name: '惠农e贷', bank: '农业银行', rate: '3.85%', limit: '50万', tags: ['纯信用', '随借随还'] },
  { id: 'l2', name: '种植贷', bank: '农村信用社', rate: '4.05%', limit: '30万', tags: ['周期灵活', '上门办理'] },
  { id: 'l3', name: '农资分期', bank: '建设银行', rate: '3.90%', limit: '100万', tags: ['定向支付', '免息期'] },
  { id: 'l4', name: '兴农快贷', bank: '工商银行', rate: '3.95%', limit: '20万', tags: ['秒批秒贷'] },
];

export const MOCK_EXPERTS: Expert[] = [
  { 
    id: 'e1', 
    name: '李田', 
    title: '高级农艺师', 
    institution: '山东农业大学',
    specialty: '果树栽培', 
    rating: 4.9, 
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80', 
    online: true,
    tags: ['苹果', '修剪技术', '病害'],
    helpCount: 1240,
    services: [
      { id: 's1', name: '图文咨询', desc: '发送图片和文字描述，24小时内回复', price: 20, type: 'chat' },
      { id: 's2', name: '视频诊断', desc: '远程视频连线，现场查看病害', price: 100, type: 'video', duration: '20分钟' }
    ]
  },
  { 
    id: 'e2', 
    name: '王兽医', 
    title: '执业兽医师', 
    institution: '市畜牧兽医站',
    specialty: '家畜防疫', 
    rating: 4.8, 
    avatarUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80', 
    online: false,
    tags: ['生猪', '疫苗', '养殖环境'],
    helpCount: 890,
    services: [
      { id: 's3', name: '图文咨询', desc: '发送图片和文字描述，24小时内回复', price: 30, type: 'chat' }
    ]
  },
  { 
    id: 'e3', 
    name: '张教授', 
    title: '教授', 
    institution: '中国农业大学',
    specialty: '土壤改良', 
    rating: 5.0, 
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80', 
    online: true,
    tags: ['有机肥', '盐碱地', '土壤检测'],
    helpCount: 2100,
    services: [
      { id: 's4', name: '电话咨询', desc: '预约时间进行电话沟通', price: 100, type: 'phone', duration: '15分钟' }
    ]
  }
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    title: '秋季果园管理关键技术要点',
    summary: '随着气温逐渐降低，果园管理进入关键时期。本文详细介绍了秋季施肥、修剪及病虫害防治的注意事项，帮助果农提高明年产量。',
    coverUrl: 'https://images.unsplash.com/photo-1623227866882-c005c207758f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: MOCK_EXPERTS[0],
    tags: ['果树', '秋季管理', '施肥'],
    publishDate: '2025-09-24',
    views: 1230,
    likes: 45
  },
  {
    id: '2',
    title: '新型有机肥在水稻种植中的应用',
    summary: '有机肥替代化肥是实现农业绿色发展的重要途径。本文通过实验数据分析了不同配比有机肥对水稻产量和品质的影响。',
    coverUrl: 'https://images.unsplash.com/photo-1599940778173-e276d4acb2bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: MOCK_EXPERTS[2],
    tags: ['水稻', '有机肥', '土壤改良'],
    publishDate: '2025-09-20',
    views: 850,
    likes: 32
  },
  {
    id: '3',
    title: '生猪养殖环境控制与疫病防控',
    summary: '良好的养殖环境是预防疫病的关键。本文讲解了现代化猪舍的温湿度控制、通风换气及生物安全体系建设。',
    coverUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    author: MOCK_EXPERTS[1],
    tags: ['生猪', '防疫', '养殖技术'],
    publishDate: '2025-09-18',
    views: 2100,
    likes: 128
  }
];

export const MOCK_QA = [
    { id: 1, question: '玉米叶子发黄且有斑点，是什么病？', answer: '可能是玉米大斑病。建议使用50%多菌灵可湿性粉剂500倍液喷雾防治。', time: '10分钟前', status: 'resolved' },
    { id: 2, question: '大棚草莓如何提高甜度？', answer: '控制夜间温度，适当增加温差；增施钾肥；叶面喷施磷酸二氢钾。', time: '1小时前', status: 'resolved' },
    { id: 3, question: '小麦播种深度多少合适？', answer: '一般以3-5厘米为宜。过深出苗困难，过浅易受冻害。', time: '3小时前', status: 'resolved' }
];

export const MOCK_SHOP: Shop = {
  id: 's1',
  name: '绿源果蔬合作社',
  avatarUrl: 'https://images.unsplash.com/photo-1595855739665-667cb5b5c962?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
  bannerUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
  description: '专注有机种植20年，位于山东烟台栖霞核心产区。我们坚持不打蜡、不催熟，为您提供最天然的美味。',
  rating: 4.9,
  followers: 12506,
  location: '山东 烟台',
  tags: ['有机认证', '产地直发', '坏果包赔'],
  isCertified: true
};

export const MOCK_COUPONS: Coupon[] = [
  { id: 'c1', type: 'PLATFORM', amount: 50, minSpend: 299, title: '金秋丰收节大额券', expiryDate: '2025-10-01', status: 'AVAILABLE' },
  { id: 'c2', type: 'SHOP', amount: 10, minSpend: 99, title: '绿源合作社粉丝券', expiryDate: '2025-09-30', shopName: '绿源果蔬合作社', status: 'AVAILABLE' },
  { id: 'c3', type: 'SHIPPING', amount: 8, minSpend: 0, title: '运费抵扣券', expiryDate: '2025-12-31', status: 'CLAIMED' },
];

export const MOCK_PROCUREMENTS: ProcurementDemand[] = [
  { 
    id: 'pd1', 
    title: '优质红富士苹果 (80mm+)', 
    category: '水果', 
    quantity: '20 吨', 
    budget: '3.5 - 4.2 元/斤', 
    priceRange: [3.5, 4.2],
    deadline: '2025-10-15', 
    buyerName: '北京新发地采购商', 
    location: '北京', 
    origin: '山东/陕西',
    status: 'OPEN',
    specs: '80mm以上，色泽红润，无碰伤',
    tags: ['有机', '纸箱包装'],
    urgent: true,
    matchScore: 98
  },
  { 
    id: 'pd2', 
    title: '2025年度优质大米采购招标', 
    category: '粮油', 
    quantity: '50 吨', 
    budget: '20-30万 总价', 
    deadline: '2025-10-10', 
    buyerName: '某大型连锁餐饮集团', 
    location: '上海', 
    status: 'OPEN',
    specs: '符合国标一级，水分<14%',
    tags: ['地理标志', '新米'],
    matchScore: 85
  },
  { 
    id: 'pd3', 
    title: '新鲜西兰花', 
    category: '蔬菜', 
    quantity: '5000 斤', 
    budget: '面议', 
    deadline: '2025-09-28', 
    buyerName: '鲜丰水果连锁', 
    location: '杭州', 
    status: 'OPEN',
    specs: '球形紧实，无黄叶',
    tags: ['冷链运输'],
    urgent: true,
    matchScore: 72
  },
  { 
    id: 'pd4', 
    title: '散养土鸡蛋', 
    category: '畜牧', 
    quantity: '1000 箱', 
    budget: '150-180 元/箱', 
    deadline: '2025-11-01', 
    buyerName: '社区团购平台', 
    location: '南京', 
    status: 'OPEN',
    specs: '30枚/箱，破损包赔',
    tags: ['无抗生素'],
    matchScore: 60
  },
];

export const MOCK_INVOICES: Invoice[] = [
  { id: 'INV-20250901', orderId: '20250925001', amount: 85.00, title: '个人', type: 'ELECTRONIC', status: 'ISSUED', date: '2025-09-25' },
  { id: 'INV-20250902', orderId: '20250925002', amount: 1280.00, title: 'XX餐饮管理有限公司', type: 'ELECTRONIC', status: 'PENDING', date: '2025-09-26' },
];

export const MOCK_LOGISTICS: LogisticsInfo = {
  trackingNo: 'SF1234567890',
  company: '顺丰速运',
  status: '运输中',
  steps: [
    { time: '2025-09-25 14:30', location: '北京集散中心', status: '运输中', description: '快件已到达北京集散中心，准备发往朝阳区' },
    { time: '2025-09-24 22:00', location: '烟台转运中心', status: '已发车', description: '快件已离开烟台转运中心' },
    { time: '2025-09-24 18:00', location: '烟台栖霞揽投部', status: '已揽收', description: '顺丰收加急件' },
  ],
  coldChainData: [
    { time: '18:00', temp: 3.5 },
    { time: '20:00', temp: 3.8 },
    { time: '22:00', temp: 4.0 },
    { time: '00:00', temp: 4.1 },
    { time: '02:00', temp: 3.9 },
    { time: '04:00', temp: 4.2 },
    { time: '06:00', temp: 4.0 },
  ]
};

export const MOCK_ADDRESSES: Address[] = [
  { id: 'a1', name: '张三', phone: '138****0000', province: '北京市', city: '北京市', district: '朝阳区', detail: '建国门外大街1号 国贸大厦A座 1001室', isDefault: true, tag: '公司' },
  { id: 'a2', name: '张三', phone: '138****0000', province: '北京市', city: '北京市', district: '通州区', detail: '梨园镇 云景东里 2号楼 3单元 502', isDefault: false, tag: '家' },
];

export const MOCK_ORDER_DETAIL: OrderDetail = {
  id: '20250925001',
  status: 'shipped',
  createTime: '2025-09-25 10:30:00',
  payTime: '2025-09-25 10:35:00',
  shipTime: '2025-09-25 14:00:00',
  shopName: '绿源果蔬合作社',
  items: [
    { id: 'oi1', productId: 'p1', name: '有机红富士苹果 (特级)', imageUrl: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', price: 85.00, quantity: 1 }
  ],
  totalAmount: 85.00,
  freight: 0,
  discount: 5.00,
  actualAmount: 80.00,
  address: MOCK_ADDRESSES[0],
  logisticsId: 'SF1234567890'
};

export const MOCK_BUYER_REVIEWS: BuyerReview[] = [
  { 
    id: 'r1', 
    orderId: '20250812001', 
    productName: '赣南脐橙 5kg', 
    productImage: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80', 
    rating: 5, 
    content: '非常甜，水分足，家里老人小孩都爱吃！', 
    date: '2025-08-15', 
    reply: '感谢您的好评，期待再次光临！'
  }
];

export const MOCK_APPLICATIONS: LoanApplication[] = [
  { 
    id: 'LA20250901', 
    productName: '惠农e贷', 
    bankName: '农业银行', 
    amount: 50000, 
    period: 12, 
    rate: 3.85, 
    applyDate: '2025-09-01', 
    status: 'APPROVED', 
    applicant: { name: '张三', idCard: '110***********001X', creditScore: 750, farmSize: '20亩', cropType: '苹果' } 
  },
  { 
    id: 'LA20250915', 
    productName: '农机分期', 
    bankName: '建设银行', 
    amount: 120000, 
    period: 24, 
    rate: 3.90, 
    applyDate: '2025-09-15', 
    status: 'AUDITING', 
    applicant: { name: '张三', idCard: '110***********001X', creditScore: 750, farmSize: '20亩', cropType: '苹果' } 
  }
];
