import { BASES, get, post, del } from './http';

export async function listContent(page = 1, page_size = 10) {
  const q = new URLSearchParams({ page: String(page), page_size: String(page_size) });
  return get(`/content?${q.toString()}`, BASES.COMMUNITY);
}

export async function contentDetail(content_id: string | number) {
  return get(`/content/${content_id}`, BASES.COMMUNITY);
}

export async function comments(content_id: string | number) {
  return get(`/content/${content_id}/comments`, BASES.COMMUNITY);
}

export async function createComment(content_id: string | number, body: any) {
  return post(`/content/${content_id}/comments`, body, BASES.COMMUNITY);
}

export async function like(content_id: string | number) {
  return post(`/content/${content_id}/like`, {}, BASES.COMMUNITY);
}

export async function unlike(content_id: string | number) {
  return del(`/content/${content_id}/like`, BASES.COMMUNITY);
}

export async function collect(content_id: string | number) {
  return post(`/content/${content_id}/collect`, {}, BASES.COMMUNITY);
}

export async function uncollect(content_id: string | number) {
  return del(`/content/${content_id}/collect`, BASES.COMMUNITY);
}

