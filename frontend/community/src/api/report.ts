import request from '@/utils/request';
import type { Report } from '@/types';

// 提交举报
export const submitReport = (data: Report) => {
  return request.post('/reports', data);
};
