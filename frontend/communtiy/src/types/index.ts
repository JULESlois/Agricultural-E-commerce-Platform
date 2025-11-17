// 用户类型
export interface User {
  user_id: number;
  user_name: string;
  avatar?: string;
  is_mutual?: boolean;
}

// 内容类型
export interface Content {
  content_id: number;
  content_title: string;
  content_text?: string;
  content_cover?: string;
  content_type: number; // 1=经验分享 2=求助 3=问题咨询
  category_id: number;
  author: User;
  view_count: number;
  like_count: number;
  comment_count: number;
  collect_count?: number;
  is_liked?: boolean;
  is_collected?: boolean;
  create_time: string;
  tags?: Tag[];
  reward_amount?: string;
  qa_status?: number; // 0=待解决 1=已解决
}

// 评论类型
export interface Comment {
  comment_id: number;
  content_id: number;
  parent_id: number;
  user_info: User;
  comment_text: string;
  like_count: number;
  is_liked?: boolean;
  is_best_answer?: boolean;
  create_time: string;
  replies?: Comment[];
}

// 分类类型
export interface Category {
  category_id: number;
  category_name: string;
  children?: Category[];
}

// 标签类型
export interface Tag {
  tag_id: number;
  tag_name: string;
}

// API 响应类型
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data?: T;
  error?: string;
}

// 举报类型
export interface Report {
  report_type: number; // 1=内容 2=评论 3=用户
  report_obj_id: number;
  report_reason: number;
  report_detail?: string;
  report_evidence?: string[];
  is_anonymous?: boolean;
}
