import api from './axios'

// 认证相关
export const authAPI = {
  login: (data: { login_identifier: string; password: string }) =>
    api.post('/auth/login', data),
  register: (data: any) => api.post('/auth/register', data),
  getUserInfo: () => api.get('/users/me'),
}

// 货源相关
export const sourceAPI = {
  getList: (params?: any) => api.get('/sources', { params }),
  getDetail: (id: number) => api.get(`/sources/${id}`),
  search: (params: any) => api.get('/sources', { params }),
}

// 分类相关
export const categoryAPI = {
  getTree: () => api.get('/categories/tree'),
}

// 购物车相关
export const cartAPI = {
  getList: () => api.get('/cart'),
  add: (data: { source_id: number; quantity: number }) => api.post('/cart', data),
  update: (id: number, quantity: number) => api.put(`/cart/${id}`, { quantity }),
  remove: (id: number) => api.delete(`/cart/${id}`),
}

// 订单相关
export const orderAPI = {
  create: (data: any) => api.post('/orders', data),
  getList: (params?: any) => api.get('/orders', { params }),
  getDetail: (id: string) => api.get(`/orders/${id}`),
  pay: (id: string, data: any) => api.post(`/orders/${id}/pay`, data),
  confirmReceipt: (id: string) => api.post(`/buyer/orders/${id}/confirm-receipt`),
}

// 地址相关
export const addressAPI = {
  getList: () => api.get('/addresses'),
  add: (data: any) => api.post('/addresses', data),
  update: (id: number, data: any) => api.put(`/addresses/${id}`, data),
  remove: (id: number) => api.delete(`/addresses/${id}`),
  setDefault: (id: number) => api.patch(`/addresses/${id}/default`),
}

// 收藏相关
export const collectionAPI = {
  getList: (params?: any) => api.get('/my/collections', { params }),
  add: (data: { collection_type: number; source_id?: number; demand_id?: number }) =>
    api.post('/my/collections', data),
  remove: (id: number) => api.delete(`/my/collections/${id}`),
}

// 关注相关
export const followAPI = {
  getList: () => api.get('/my/follows'),
  add: (data: { seller_id: number; follow_remark?: string }) =>
    api.post('/my/follows', data),
  remove: (sellerId: number) => api.delete(`/my/follows/${sellerId}`),
}

// 足迹相关
export const footprintAPI = {
  getList: (params: { type: number; page?: number; pageSize?: number }) =>
    api.get('/my/footprints', { params }),
  remove: (ids: number[]) => api.delete('/my/footprints', { data: { footprint_ids: ids } }),
}

// 优惠券相关
export const couponAPI = {
  getClaimable: () => api.get('/coupons/claimable'),
  getMyCoupons: (params?: any) => api.get('/my-coupons', { params }),
  claim: (data: { rule_id: number }) => api.post('/my-coupons/claim', data),
}

// 统计相关
export const statsAPI = {
  getPriceTrends: (params: { category_id: number; start_date: string; end_date: string }) =>
    api.get('/stats/price-trends', { params }),
}

// 活动相关
export const activityAPI = {
  getList: () => api.get('/activities'),
  getDetail: (id: number) => api.get(`/activities/${id}`),
}
