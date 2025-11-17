import axios from 'axios';
import type { ApiResponse } from '@/types';

const request = axios.create({
  baseURL: '/api/community',
  timeout: 10000,
});

// 请求拦截器
request.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
request.interceptors.response.use(
  (response) => {
    const res: ApiResponse = response.data;
    
    if (res.code === 200 || res.code === 201) {
      return res;
    }
    
    // 处理错误
    console.error(res.message || '请求失败');
    return Promise.reject(new Error(res.message || '请求失败'));
  },
  (error) => {
    if (error.response?.status === 401) {
      // 未授权，跳转登录
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    console.error(error.message || '网络错误');
    return Promise.reject(error);
  }
);

export default request;
