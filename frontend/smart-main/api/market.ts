import { BASES, get, post, put, del } from './http';

export type MarketLoginResp = {
  code: number;
  message: string;
  data: { token: string; user: any };
};

export async function marketLogin(login_identifier: string, password: string) {
  const r = await post('/auth/login', { login_identifier, password }, BASES.AUTH);
  return r as MarketLoginResp;
}

export async function marketMe() {
  return get('/users/me', BASES.AUTH);
}

export async function marketProducts() {
  const r = await get('/market/products', BASES.MARKET);
  return r;
}

export async function cartList() {
  return get('/cart', BASES.MARKET);
}

export async function cartAdd(source_id: number, quantity: number) {
  return post('/cart/add', { source_id, quantity }, BASES.MARKET);
}

export async function cartUpdate(cart_id: number, quantity: number) {
  return put(`/cart/${cart_id}`, { quantity }, BASES.MARKET);
}

export async function cartDelete(cart_id: number) {
  return del(`/cart/${cart_id}`, BASES.MARKET);
}

export async function addressesList() {
  return get('/addresses', BASES.MARKET);
}

export async function addressCreate(body: any) {
  return post('/addresses', body, BASES.MARKET);
}

export async function addressUpdate(address_id: number, body: any) {
  return put(`/addresses/${address_id}`, body, BASES.MARKET);
}

export async function addressDelete(address_id: number) {
  return del(`/addresses/${address_id}`, BASES.MARKET);
}

export async function addressSetDefault(address_id: number) {
  return patch(`/addresses/${address_id}/default`, {}, BASES.MARKET);
}

export async function ordersList(params?: { status?: number; page?: number }) {
  const q = new URLSearchParams();
  if (params?.status !== undefined) q.set('status', String(params.status));
  if (params?.page !== undefined) q.set('page', String(params.page));
  return get(`/orders?${q.toString()}`, BASES.MARKET);
}

export async function orderDetail(order_id: string | number) {
  return get(`/orders/${order_id}`, BASES.MARKET);
}

export async function createOrder(body: { source_id: number; quantity: number; receiver_address_id: number; user_coupon_id?: number; order_remark?: string; }) {
  return post('/orders', body, BASES.MARKET);
}

export async function payOrder(order_id: string | number, payment_method: 'WECHAT_PAY' | 'ALIPAY' | 'BANK_CARD') {
  return post(`/orders/${order_id}/pay`, { payment_method }, BASES.MARKET);
}

export async function confirmReceipt(order_id: string | number) {
  return post(`/buyer/orders/${order_id}/confirm-receipt`, {}, BASES.MARKET);
}

function patch(path: string, body: any, base: string) {
  return (post as any)(path, body, base);
}
