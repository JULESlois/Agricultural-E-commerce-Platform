export type AppError = {
  code: string;
  httpStatus?: number;
  message?: string;
  detail?: any;
};

export const ERROR_MESSAGES: Record<string, string> = {
  'network.offline': '网络不可用，请检查网络连接。',
  'network.timeout': '请求超时，请稍后重试。',
  'network.error': '服务繁忙，请稍后重试。',

  'auth.required': '请先登录后再访问该页面。',
  'auth.invalid_credentials': '手机号或密码错误。',
  'auth.token_expired': '登录已过期，请重新登录。',
  'auth.forbidden': '您没有权限执行该操作。',

  'resource.not_found': '未找到相关资源或页面。',
  'resource.deleted': '该数据已被删除或不可用。',

  'form.required': '请填写必填项。',
  'form.invalid_format': '输入格式不正确。',
  'form.range_error': '输入超出允许范围。',

  'cart.add_failed': '加入购物车失败。',
  'order.create_failed': '创建订单失败。',
  'order.pay_failed': '支付发起失败。',
  'order.not_owned': '无权查看此订单。',
  'address.load_failed': '加载地址失败。',
  'address.save_failed': '保存地址失败。',
  'community.comment_failed': '评论发布失败。',
  'finance.apply_failed': '融资申请提交失败。',

  'rate_limit': '操作过于频繁，请稍后重试。',
  'unknown': '出现未知错误，请刷新后重试。'
};

export function formatMessage(code: string, fallback?: string) {
  return ERROR_MESSAGES[code] || fallback || ERROR_MESSAGES['unknown'];
}

export function mapHttpStatusToCode(status: number): string {
  if (status === 401) return 'auth.required';
  if (status === 403) return 'auth.forbidden';
  if (status === 404) return 'resource.not_found';
  if (status === 408) return 'network.timeout';
  if (status >= 500) return 'network.error';
  return 'unknown';
}

