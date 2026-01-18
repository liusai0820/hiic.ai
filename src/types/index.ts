import type { LucideIcon } from 'lucide-react';

export type Category = '全部' | '办公效率' | '数据可视化' | '文档处理' | '研究分析';

export type AppColor = 'blue' | 'violet' | 'emerald' | 'amber' | 'rose' | 'indigo';

export interface App {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  url: string;
  category: Category;
  status: 'online' | 'coming' | 'maintenance';
  visitCount: number;
  version?: string;
  color: AppColor;
}

export interface Announcement {
  id: string;
  date: string;
  title: string;
  content: string;
  type: 'notice' | 'feature' | 'update' | 'fix';
}

export interface Developer {
  name: string;
  title: string;
  organization: string;
  avatar: string;
  slogan: string;
  email: string;
  github?: string;
}

export interface Feedback {
  type: 'suggestion' | 'bug' | 'question' | 'other';
  appId?: string;
  content: string;
  contact?: string;
}

export interface Tutorial {
  id: string;
  title: string;
  description: string;
  appId?: string;
  readTime: string;
  type: 'quickstart' | 'advanced' | 'usecase';
  content: string;
  author: string;
  publishDate: string;
}

export interface Comment {
  id: string;
  tutorialId: string;
  author: string;
  content: string;
  createdAt: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  votes: number;
}

// 论坛相关类型
export type ForumCategoryId = 'qa' | 'tips' | 'talk' | 'activity';

export interface ForumCategory {
  id: ForumCategoryId;
  name: string;
  description: string;
  icon: LucideIcon;
  color: AppColor;
  postCount: number;
}

export interface ForumAuthor {
  name: string;
  avatar: string;
  department: string;
}

export interface ForumComment {
  id: string;
  postId: string;
  author: ForumAuthor;
  content: string;
  createdAt: string;
  likes: number;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  category: ForumCategoryId;
  author: ForumAuthor;
  createdAt: string;
  likes: number;
  comments: ForumComment[];
  favorites: number;
  views: number;
  isPinned?: boolean;
  isHot?: boolean;
  isAnonymous?: boolean;
  tags?: string[];
}
