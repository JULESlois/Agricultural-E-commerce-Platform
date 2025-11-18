import request from '@/utils/request';

// 采纳最佳答案
export const adoptBestAnswer = (contentId: number, commentId: number) => {
  return request.post(`/questions/${contentId}/best-answer`, {
    comment_id: commentId,
  });
};

// 取消最佳答案
export const cancelBestAnswer = (contentId: number) => {
  return request.delete(`/questions/${contentId}/best-answer`);
};
