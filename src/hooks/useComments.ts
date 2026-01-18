import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import type { CommentWithRelations } from '../types/database';
import { forumPosts } from '../data';

interface CreateCommentData {
  post_id: string;
  content: string;
  is_anonymous: boolean;
}

// 将 mock 评论转换为 CommentWithRelations 格式
function convertMockComment(comment: typeof forumPosts[0]['comments'][0], postId: string): CommentWithRelations {
  return {
    id: comment.id,
    post_id: postId,
    author_id: comment.author.name,
    content: comment.content,
    is_anonymous: false,
    created_at: comment.createdAt,
    author: {
      id: comment.author.name,
      name: comment.author.name,
      department: comment.author.department,
      avatar_url: comment.author.avatar || null,
      role: 'member',
      created_at: comment.createdAt,
    },
    likes_count: comment.likes,
    user_liked: false,
  };
}

// 获取评论列表 (mock 模式)
function fetchCommentsMock(postId: string): CommentWithRelations[] {
  const post = forumPosts.find(p => p.id === postId);
  if (!post) return [];
  return post.comments.map(c => convertMockComment(c, postId));
}

// 获取评论列表 (Supabase 模式)
async function fetchCommentsSupabase(postId: string): Promise<CommentWithRelations[]> {
  const { data: comments, error } = await supabase
    .from('comments')
    .select(`
      *,
      author:profiles!author_id(*)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (comments || []).map(comment => {
    const c = comment as Record<string, unknown>;
    return {
      ...c,
      likes_count: 0,
      user_liked: false,
    } as CommentWithRelations;
  });
}

// 创建评论 (mock 模式)
function createCommentMock(data: CreateCommentData, authorId: string): CommentWithRelations {
  return {
    id: `mock-comment-${Date.now()}`,
    post_id: data.post_id,
    author_id: authorId,
    content: data.content,
    is_anonymous: data.is_anonymous,
    created_at: new Date().toISOString(),
    author: {
      id: authorId,
      name: '测试用户',
      department: '研发部',
      avatar_url: null,
      role: 'member',
      created_at: new Date().toISOString(),
    },
    likes_count: 0,
    user_liked: false,
  };
}

// 创建评论 (Supabase 模式)
async function createCommentSupabase(data: CreateCommentData, authorId: string): Promise<CommentWithRelations> {
  const { data: comment, error } = await supabase
    .from('comments')
    .insert({
      post_id: data.post_id,
      author_id: authorId,
      content: data.content,
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

  const c = comment as Record<string, unknown>;
  return {
    ...c,
    likes_count: 0,
    user_liked: false,
  } as CommentWithRelations;
}

// Hook: 获取评论列表
export function useComments(postId: string | null) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['comments', postId, user?.id],
    queryFn: async () => {
      if (!postId) return [];
      if (!isSupabaseConfigured) {
        return fetchCommentsMock(postId);
      }
      return fetchCommentsSupabase(postId);
    },
    enabled: !!postId,
    staleTime: 1000 * 30, // 30 秒
  });
}

// Hook: 创建评论
export function useCreateComment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCommentData) => {
      if (!user) {
        throw new Error('请先登录');
      }
      if (!isSupabaseConfigured) {
        return createCommentMock(data, user.id);
      }
      return createCommentSupabase(data, user.id);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.post_id] });
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });
}

// Hook: 删除评论
export function useDeleteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ commentId, postId }: { commentId: string; postId: string }) => {
      if (!isSupabaseConfigured) {
        return { success: true, postId };
      }

      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        throw new Error(error.message);
      }

      return { success: true, postId };
    },
    onSuccess: (result) => {
      if (result.postId) {
        queryClient.invalidateQueries({ queryKey: ['comments', result.postId] });
        queryClient.invalidateQueries({ queryKey: ['posts'] });
      }
    },
  });
}
