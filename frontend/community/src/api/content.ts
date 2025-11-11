import request from '@/utils/request';
import type { Content, Comment, Category, Tag } from '@/types';

// 获取内容列表
export const getContentList = (params?: {
  category_id?: number;
  sort?: 'hot' | 'new' | 'recommend';
  page?: number;
  limit?: number;
}) => {
  return request.get<any, { data: Content[] }>('/content', { params });
};

// 获取内容详情
export const getContentDetail = (contentId: number) => {
  return request.get<any, { data: Content }>(`/content/${contentId}`);
};

// 发布内容
export const createContent = (data: {
  category_id: number;
  content_type: number;
  content_title: string;
  content_text: string;
  content_cover?: string;
  tag_ids?: number[];
  reward_amount?: string;
}) => {
  return request.post<any, { data: { content_id: number } }>('/content', data);
};

// 点赞/取消点赞
export const toggleLike = (contentId: number, isLike: boolean) => {
  return isLike
    ? request.post(`/content/${contentId}/like`)
    : request.delete(`/content/${contentId}/like`);
};

// 收藏/取消收藏
export const toggleCollect = (contentId: number, isCollect: boolean) => {
  return isCollect
    ? request.post(`/content/${contentId}/collect`)
    : request.delete(`/content/${contentId}/collect`);
};

// 获取评论列表
export const getComments = (contentId: number) => {
  return request.get<any, { data: Comment[] }>(`/content/${contentId}/comments`);
};

// 发布评论
export const createComment = (contentId: number, data: {
  parent_id: number;
  comment_text: string;
}) => {
  return request.post<any, { data: Comment }>(`/content/${contentId}/comments`, data);
};

// 获取分类树
export const getCategoryTree = () => {
  return request.get<any, { data: Category[] }>('/categories/tree');
};

// 搜索标签
export const searchTags = (keyword: string) => {
  return request.get<any, { data: Tag[] }>('/tags', { params: { keyword } });
};
