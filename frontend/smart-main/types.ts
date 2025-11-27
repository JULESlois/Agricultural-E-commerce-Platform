
export enum UserRole {
  FARMER = 'FARMER',
  BUYER = 'BUYER',
  BANKER = 'BANKER',
  EXPERT = 'EXPERT',
  ADMIN = 'ADMIN'
}

export interface Product {
  id: string;
  title: string;
  price: number;
  origin: string;
  category: string;
  imageUrl: string;
  farmerName: string;
  stock: number;
  tags?: string[];
  specs?: string; // e.g., "5kg/box"
  moq?: number; // Minimum Order Quantity
}

export interface LoanProduct {
  id: string;
  name: string;
  bank: string;
  rate: string; // e.g., "3.85%"
  limit: string; // e.g., "50万"
  tags: string[];
}

export interface ExpertService {
  id: string;
  name: string;
  desc?: string;
  price: number;
  type: 'chat' | 'phone' | 'video' | 'offline';
  duration?: string;
}

export interface Expert {
  id: string;
  name: string;
  title: string;
  institution?: string;
  specialty: string; // Field of expertise
  rating: number;
  avatarUrl: string;
  online: boolean;
  tags?: string[];
  services?: ExpertService[];
  helpCount?: number;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  content?: string;
  coverUrl: string;
  author: Expert;
  tags: string[];
  publishDate: string;
  views: number;
  likes: number;
}

export interface NavItem {
  label: string;
  path: string;
  activePattern?: RegExp;
  openInNewTab?: boolean; // 是否在新标签页打开
}

export interface Metric {
  label: string;
  value: string | number;
  trend?: number; // + or - percentage
  color?: string;
}

// --- Finance Types ---

export type LoanStatus = 'PENDING' | 'AUDITING' | 'REJECTED' | 'APPROVED' | 'REPAYING' | 'OVERDUE' | 'COMPLETED';

export interface LoanApplication {
  id: string;
  productName: string;
  bankName: string;
  amount: number;
  period: number; // months
  rate: number;
  applyDate: string;
  status: LoanStatus;
  applicant: {
    name: string;
    idCard: string;
    creditScore: number;
    farmSize: string;
    cropType: string;
  };
}

export interface RepaymentPlan {
  id: string;
  period: number;
  totalPeriods: number;
  dueDate: string;
  principal: number;
  interest: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE';
}

// --- Mall Extended Types ---

export interface Shop {
  id: string;
  name: string;
  avatarUrl: string;
  bannerUrl: string;
  description: string;
  rating: number;
  followers: number;
  location: string;
  tags: string[];
  isCertified: boolean;
}

export interface Coupon {
  id: string;
  type: 'PLATFORM' | 'SHOP' | 'SHIPPING';
  amount: number;
  minSpend: number;
  title: string;
  expiryDate: string;
  shopName?: string;
  status: 'AVAILABLE' | 'CLAIMED';
}

export interface ProcurementDemand {
  id: string;
  title: string;
  category: string;
  quantity: string; // e.g., "50 Tons"
  budget: string; // Display string like "面议" or range
  priceRange?: [number, number]; // For matching logic
  deadline: string;
  buyerName: string;
  location: string; // Delivery location
  origin?: string; // Preferred origin
  status: 'OPEN' | 'CLOSED';
  specs?: string; // e.g. "80mm+"
  tags?: string[]; // Quality standards
  matchScore?: number; // Calculated field for dashboard
  urgent?: boolean;
}

export interface Invoice {
  id: string;
  orderId: string;
  amount: number;
  title: string; // Company Name
  type: 'ELECTRONIC' | 'PAPER';
  status: 'ISSUED' | 'PENDING';
  date: string;
  pdfUrl?: string;
}

export interface LogisticsStep {
  time: string;
  location: string;
  status: string; // e.g., "Dispatched", "In Transit"
  description: string;
}

export interface LogisticsInfo {
  trackingNo: string;
  company: string;
  status: string;
  steps: LogisticsStep[];
  coldChainData?: { time: string; temp: number }[]; // For chart
}

export interface Address {
  id: string;
  name: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  detail: string;
  isDefault: boolean;
  tag?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface OrderDetail {
  id: string;
  status: 'pending_pay' | 'pending_ship' | 'shipped' | 'completed' | 'cancelled' | 'refunded';
  createTime: string;
  payTime?: string;
  shipTime?: string;
  finishTime?: string;
  shopName: string;
  items: OrderItem[];
  totalAmount: number;
  freight: number;
  discount: number;
  actualAmount: number;
  address: Address;
  logisticsId?: string;
}

export interface BuyerReview {
  id: string;
  orderId: string;
  productName: string;
  productImage: string;
  rating: number;
  content: string;
  images?: string[];
  date: string;
  reply?: string;
}
