import request from '@/utils/request';
import type { User } from '@/types';

// 关注用户
export const followUser = (followed_id: number) => {
  return request.post('/follows', { followed_id, follow_source: 1 });
};

// 取消关注
export const unfollowUser = (followed_id: number) => {
  return request.delete(`/follows/${followed_id}`);
};

// 获取关注列表
export const getFollowing = (userId: number) => {
  return request.get<any, { data: User[] }>(`/users/${userId}/following`);
};

// 获取粉丝列表
export const getFollowers = (userId: number) => {
  return request.get<any, { data: User[] }>(`/users/${userId}/followers`);
};

// 拉黑用户
export const blockUser = (blacked_user_id: number, black_reason?: string) => {
  return request.post('/blacklist', { blacked_user_id, black_reason });
};

// 移除黑名单
export const unblockUser = (blacked_user_id: number) => {
  return request.delete(`/blacklist/${blacked_user_id}`);
};
