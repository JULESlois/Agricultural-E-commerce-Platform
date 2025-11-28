const getBase = (key: string, fallback: string) => {
  const v = (import.meta as any).env?.[key];
  return typeof v === 'string' && v.length > 0 ? v : fallback;
};

export const BASES = {
  MARKET: getBase('VITE_MARKET_BASE', 'http://localhost:3001/api'),
  COMMUNITY: getBase('VITE_COMMUNITY_BASE', 'http://localhost:3003/api/community'),
  FINANCE: getBase('VITE_FINANCE_BASE', 'http://localhost:8082/finance/api'),
  AUTH: getBase('VITE_AUTH_BASE', 'http://localhost:3002/api')
};

type Json = Record<string, any> | undefined;

export async function request(path: string, options: RequestInit = {}, base?: string) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    ...(options.headers as Record<string, string> | undefined)
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (options.body && !headers['Content-Type']) headers['Content-Type'] = 'application/json';

  const url = `${base || ''}${path}`;
  const resp = await fetch(url, { ...options, headers });
  const text = await resp.text();
  let data: any;
  try { data = text ? JSON.parse(text) : undefined; } catch { data = text; }
  if (!resp.ok) throw { status: resp.status, data };
  return data;
}

export async function get(path: string, base: string) {
  return request(path, { method: 'GET' }, base);
}

export async function post(path: string, body: Json, base: string) {
  return request(path, { method: 'POST', body: body ? JSON.stringify(body) : undefined }, base);
}

export async function put(path: string, body: Json, base: string) {
  return request(path, { method: 'PUT', body: body ? JSON.stringify(body) : undefined }, base);
}

export async function del(path: string, base: string) {
  return request(path, { method: 'DELETE' }, base);
}

export async function patch(path: string, body: Json, base: string) {
  return request(path, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined }, base);
}

