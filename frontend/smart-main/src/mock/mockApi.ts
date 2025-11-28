import { Product, OrderDetail, LogisticsInfo, Invoice, LoanProduct, LoanApplication, Article, Expert } from '../../types';
import { products, shop } from './products';
import { buyerOrders, sampleOrder } from './orders';
import { logisticsByTracking } from './logistics';
import { invoices } from './invoices';
import { loans, applications } from './loans';
import { articles, experts } from './articles';
import { qa } from './qa';

type PageParams = { page?: number; pageSize?: number } & Record<string, any>;

function delay(min = 200, max = 1200) {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(res => setTimeout(res, ms));
}

async function withChance<T>(fn: () => T, errorRate = 0.04): Promise<T> {
  await delay();
  if (Math.random() < errorRate) {
    throw new Error('网络繁忙，请稍后重试');
  }
  return fn();
}

function paginate<T>(list: T[], params: PageParams) {
  const page = params.page ?? 1;
  const pageSize = params.pageSize ?? 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return { data: list.slice(start, end), total: list.length, page, pageSize };
}

export const MockApi = {
  async getProducts(params: PageParams & { keyword?: string; category?: string; sort?: string }) {
    return withChance(() => {
      let list: Product[] = products;
      if (params.keyword) list = list.filter(p => p.title.includes(params.keyword!));
      if (params.category) list = list.filter(p => p.category === params.category);
      if (params.sort === 'price_desc') list = [...list].sort((a, b) => b.price - a.price);
      if (params.sort === 'price_asc') list = [...list].sort((a, b) => a.price - b.price);
      return paginate(list, params);
    });
  },

  async getProductById(id: string) {
    return withChance(() => products.find(p => p.id === id));
  },

  async getShop() {
    return withChance(() => shop);
  },

  async getBuyerOrders(params: PageParams & { status?: OrderDetail['status'] }) {
    return withChance(() => {
      let list: OrderDetail[] = buyerOrders;
      if (params.status) list = list.filter(o => o.status === params.status);
      return paginate(list, params);
    });
  },

  async getOrderDetail(id: string) {
    return withChance(() => buyerOrders.find(o => o.id === id) || sampleOrder);
  },

  async getLogistics(trackingNo: string) {
    return withChance(() => logisticsByTracking[trackingNo]);
  },

  async getInvoices(params: PageParams & { status?: Invoice['status'] }) {
    return withChance(() => {
      let list: Invoice[] = invoices;
      if (params.status) list = list.filter(i => i.status === params.status);
      return paginate(list, params);
    });
  },

  async getLoans() {
    return withChance(() => loans);
  },

  async getLoanApplications() {
    return withChance(() => applications);
  },

  async getArticles(params: PageParams & { tag?: string }) {
    return withChance(() => {
      let list: Article[] = articles;
      if (params.tag) list = list.filter(a => a.tags.includes(params.tag!));
      return paginate(list, params);
    });
  },

  async getExpertById(id: string) {
    return withChance(() => experts.find(e => e.id === id) as Expert);
  },

  async getQA(params: PageParams) {
    return withChance(() => paginate(qa, params));
  },
};

export type PageResp<T> = { data: T[]; total: number; page: number; pageSize: number };
