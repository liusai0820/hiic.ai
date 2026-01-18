// Supabase 数据库类型定义
// 注意：生产环境建议使用 supabase gen types typescript 自动生成

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          department: string;
          avatar_url: string | null;
          role: 'member' | 'admin';
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          department: string;
          avatar_url?: string | null;
          role?: 'member' | 'admin';
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          department?: string;
          avatar_url?: string | null;
          role?: 'member' | 'admin';
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          title: string;
          content: string;
          category: 'qa' | 'tips' | 'talk' | 'activity';
          author_id: string;
          is_anonymous: boolean;
          is_pinned: boolean;
          views: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          category: 'qa' | 'tips' | 'talk' | 'activity';
          author_id: string;
          is_anonymous?: boolean;
          is_pinned?: boolean;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          category?: 'qa' | 'tips' | 'talk' | 'activity';
          author_id?: string;
          is_anonymous?: boolean;
          is_pinned?: boolean;
          views?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      comments: {
        Row: {
          id: string;
          post_id: string;
          author_id: string;
          content: string;
          is_anonymous: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          author_id: string;
          content: string;
          is_anonymous?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          post_id?: string;
          author_id?: string;
          content?: string;
          is_anonymous?: boolean;
          created_at?: string;
        };
      };
      reactions: {
        Row: {
          id: string;
          user_id: string;
          target_type: 'post' | 'comment';
          target_id: string;
          reaction_type: 'like' | 'favorite';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          target_type: 'post' | 'comment';
          target_id: string;
          reaction_type: 'like' | 'favorite';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          target_type?: 'post' | 'comment';
          target_id?: string;
          reaction_type?: 'like' | 'favorite';
          created_at?: string;
        };
      };
      tags: {
        Row: {
          id: string;
          name: string;
          usage_count: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          usage_count?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          usage_count?: number;
          created_at?: string;
        };
      };
      post_tags: {
        Row: {
          post_id: string;
          tag_id: string;
        };
        Insert: {
          post_id: string;
          tag_id: string;
        };
        Update: {
          post_id?: string;
          tag_id?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// 便捷类型别名
export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Post = Database['public']['Tables']['posts']['Row'];
export type Comment = Database['public']['Tables']['comments']['Row'];
export type Reaction = Database['public']['Tables']['reactions']['Row'];
export type Tag = Database['public']['Tables']['tags']['Row'];

// 带关联数据的帖子类型
export interface PostWithRelations extends Post {
  author: Profile;
  tags: { tag: Tag }[];
  likes_count: number;
  favorites_count: number;
  comments_count: number;
  user_liked?: boolean;
  user_favorited?: boolean;
}

// 带关联数据的评论类型
export interface CommentWithRelations extends Comment {
  author: Profile;
  likes_count: number;
  user_liked?: boolean;
}
