import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { PostWithRelations } from '../types/database';
import type { ForumCategoryId } from '../types';
import { forumPosts } from '../data';

interface UsePostsOptions {
  category?: ForumCategoryId | null;
  searchQuery?: string;
  sortBy?: 'hot' | 'latest' | 'pinned';
}

interface CreatePostData {
  title: string;
  content: string;
  category: ForumCategoryId;
  is_anonymous: boolean;
  tags?: string[];
}

// 将 mock 数据转换为 PostWithRelations 格式
function convertMockPost(post: typeof forumPosts[0]): PostWithRelations {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    category: post.category,
    author_id: post.author.name,
    is_anonymous: post.isAnonymous || false,
    is_pinned: post.isPinned || false,
    views: post.views,
    created_at: post.createdAt,
    updated_at: post.createdAt,
    author: {
      id: post.author.name,
      name: post.author.name,
      department: post.author.department,
      avatar_url: post.author.avatar || null,
      role: 'member',
      created_at: post.createdAt,
    },
    tags: post.tags?.map(tag => ({
      tag: {
        id: tag,
        name: tag,
        usage_count: 1,
        created_at: post.createdAt,
      }
    })) || [],
    likes_count: post.likes,
    favorites_count: post.favorites || 0,
    comments_count: post.comments.length,
    user_liked: false,
    user_favorited: false,
  };
}

// 获取帖子列表 (mock 模式)
function fetchPostsMock(options: UsePostsOptions): PostWithRelations[] {
  let result = forumPosts.map(convertMockPost);

  if (options.category) {
    result = result.filter(p => p.category === options.category);
  }

  if (options.searchQuery?.trim()) {
    const query = options.searchQuery.toLowerCase();
    result = result.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.content.toLowerCase().includes(query)
    );
  }

  switch (options.sortBy) {
    case 'hot':
      result.sort((a, b) => b.likes_count - a.likes_count);
      break;
    case 'pinned':
      result.sort((a, b) => {
        if (a.is_pinned && !b.is_pinned) return -1;
        if (!a.is_pinned && b.is_pinned) return 1;
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      break;
    case 'latest':
    default:
      result.sort((a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }

  return result;
}

// 获取帖子列表 (Supabase 模式)
async function fetchPostsSupabase(options: UsePostsOptions): Promise<PostWithRelations[]> {
  let query = supabase
    .from('posts')
    .select(`
      *,
      author:profiles!author_id(*),
      tags:post_tags(tag:tags(*))
    `);

  if (options.category) {
    query = query.eq('category', options.category);
  }

  if (options.searchQuery?.trim()) {
    query = query.or(`title.ilike.%${options.searchQuery}%,content.ilike.%${options.searchQuery}%`);
  }

  switch (options.sortBy) {
    case 'hot':
      query = query.order('views', { ascending: false });
      break;
    case 'pinned':
      query = query.order('is_pinned', { ascending: false }).order('created_at', { ascending: false });
      break;
    case 'latest':
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data: posts, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  // 简化版本 - 直接返回数据
  return (posts || []).map(post => {
    const p = post as Record<string, unknown>;
    return {
      ...p,
      likes_count: 0,
      favorites_count: 0,
      comments_count: 0,
      user_liked: false,
      user_favorited: false,
    } as PostWithRelations;
  });
}

// 创建帖子 (mock 模式)
function createPostMock(data: CreatePostData, authorId: string): PostWithRelations {
  return {
    id: `mock-${Date.now()}`,
    title: data.title,
    content: data.content,
    category: data.category,
    author_id: authorId,
    is_anonymous: data.is_anonymous,
    is_pinned: false,
    views: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    author: {
      id: authorId,
      name: '测试用户',
      department: '研发部',
      avatar_url: null,
      role: 'member',
      created_at: new Date().toISOString(),
    },
    tags: [],
    likes_count: 0,
    favorites_count: 0,
    comments_count: 0,
    user_liked: false,
    user_favorited: false,
  };
}

// 创建帖子 (Supabase 模式)
async function createPostSupabase(data: CreatePostData, authorId: string): Promise<PostWithRelations> {
  const { data: post, error } = await supabase
    .from('posts')
    .insert({
      title: data.title,
      content: data.content,
      category: data.category,
      author_id: authorId,
      is_anonymous: data.is_anonymous,
    } as never)
    .select(`
      *,
      author:profiles!author_id(*)
    `)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...(post as object),
    tags: [],
    likes_count: 0,
    favorites_count: 0,
    comments_count: 0,
    user_liked: false,
    user_favorited: false,
  } as unknown as PostWithRelations;
}

// Hook: 获取帖子列表
export function usePosts(options: UsePostsOptions = {}) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['posts', options.category, options.searchQuery, options.sortBy, user?.id],
    queryFn: async () => {
      if (!isSupabaseConfigured) {
        return fetchPostsMock(options);
      }
      return fetchPostsSupabase(options);
    },
    staleTime: 1000 * 60, // 1 分钟
  });
}

// Hook: 获取单个帖子
export function usePost(postId: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['post', postId, user?.id],
    queryFn: async () => {
      if (!postId) return null;

      if (!isSupabaseConfigured) {
        const mockPost = forumPosts.find(p => p.id === postId);
        return mockPost ? convertMockPost(mockPost) : null;
      }

      const { data, error } = await supabase
        .from('posts')
        .select(`
          *,
          author:profiles!author_id(*),
          tags:post_tags(tag:tags(*))
        `)
        .eq('id', postId)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data as unknown as PostWithRelations;
    },
    enabled: !!postId,
  });
}

// Hook: 创建帖子
export function useCreatePost() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreatePostData) => {
      if (!user) {
        throw new Error('请先登录');
      }
      if (!isSupabaseConfigured) {
        return createPostMock(data, user.id);
      }
      return createPostSupabase(data, user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// Hook: 删除帖子
export function useDeletePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (postId: string) => {
      if (!isSupabaseConfigured) {
        return { success: true };
      }

      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}
