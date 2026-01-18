import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type TargetType = 'post' | 'comment';
type ReactionType = 'like' | 'favorite';

interface ToggleReactionData {
  targetType: TargetType;
  targetId: string;
  reactionType: ReactionType;
  postId?: string; // 用于刷新评论列表
}

// 切换点赞/收藏状态
async function toggleReaction(
  data: ToggleReactionData,
  userId: string
): Promise<{ added: boolean }> {
  if (!isSupabaseConfigured) {
    // 开发模式：模拟切换
    return { added: true };
  }

  // 检查是否已存在
  const { data: existing } = await supabase
    .from('reactions')
    .select('id')
    .eq('user_id', userId)
    .eq('target_type', data.targetType)
    .eq('target_id', data.targetId)
    .eq('reaction_type', data.reactionType)
    .single();

  if (existing) {
    // 已存在，删除
    const { error } = await supabase
      .from('reactions')
      .delete()
      .eq('id', (existing as { id: string }).id);

    if (error) {
      throw new Error(error.message);
    }

    return { added: false };
  } else {
    // 不存在，创建
    const { error } = await supabase
      .from('reactions')
      .insert({
        user_id: userId,
        target_type: data.targetType,
        target_id: data.targetId,
        reaction_type: data.reactionType,
      } as never);

    if (error) {
      throw new Error(error.message);
    }

    return { added: true };
  }
}

// Hook: 点赞帖子
export function useLikePost() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => {
      if (!user) {
        throw new Error('请先登录');
      }
      return toggleReaction(
        { targetType: 'post', targetId: postId, reactionType: 'like' },
        user.id
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
    },
  });
}

// Hook: 收藏帖子
export function useFavoritePost() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (postId: string) => {
      if (!user) {
        throw new Error('请先登录');
      }
      return toggleReaction(
        { targetType: 'post', targetId: postId, reactionType: 'favorite' },
        user.id
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      queryClient.invalidateQueries({ queryKey: ['post'] });
    },
  });
}

// Hook: 点赞评论
export function useLikeComment() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ commentId, postId }: { commentId: string; postId: string }) => {
      if (!user) {
        throw new Error('请先登录');
      }
      return toggleReaction(
        { targetType: 'comment', targetId: commentId, reactionType: 'like', postId },
        user.id
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
    },
  });
}

// Hook: 通用互动操作
export function useReaction() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ToggleReactionData) => {
      if (!user) {
        throw new Error('请先登录');
      }
      return toggleReaction(data, user.id);
    },
    onSuccess: (_, variables) => {
      if (variables.targetType === 'post') {
        queryClient.invalidateQueries({ queryKey: ['posts'] });
        queryClient.invalidateQueries({ queryKey: ['post'] });
      } else if (variables.targetType === 'comment' && variables.postId) {
        queryClient.invalidateQueries({ queryKey: ['comments', variables.postId] });
      }
    },
  });
}
