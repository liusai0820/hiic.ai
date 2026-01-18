import { useQuery } from '@tanstack/react-query';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Tag } from '../types/database';
import { forumPosts } from '../data';

// 获取热门标签
async function fetchHotTags(limit: number = 10): Promise<Tag[]> {
  if (!isSupabaseConfigured) {
    // 开发模式：从 mock 数据中提取标签
    const tagCount = new Map<string, number>();
    forumPosts.forEach(post => {
      post.tags?.forEach(tag => {
        tagCount.set(tag, (tagCount.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit)
      .map(([name, count], index) => ({
        id: `mock-tag-${index}`,
        name,
        usage_count: count,
        created_at: new Date().toISOString(),
      }));
  }

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .order('usage_count', { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// 搜索标签
async function searchTags(query: string): Promise<Tag[]> {
  if (!isSupabaseConfigured) {
    // 开发模式：从 mock 数据中搜索
    const allTags = new Set<string>();
    forumPosts.forEach(post => {
      post.tags?.forEach(tag => allTags.add(tag));
    });

    const results = Array.from(allTags)
      .filter(tag => tag.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 10)
      .map((name, index) => ({
        id: `mock-tag-${index}`,
        name,
        usage_count: 1,
        created_at: new Date().toISOString(),
      }));

    return results;
  }

  const { data, error } = await supabase
    .from('tags')
    .select('*')
    .ilike('name', `%${query}%`)
    .order('usage_count', { ascending: false })
    .limit(10);

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

// Hook: 获取热门标签
export function useHotTags(limit: number = 10) {
  return useQuery({
    queryKey: ['tags', 'hot', limit],
    queryFn: () => fetchHotTags(limit),
    staleTime: 1000 * 60 * 5, // 5 分钟
  });
}

// Hook: 搜索标签
export function useSearchTags(query: string) {
  return useQuery({
    queryKey: ['tags', 'search', query],
    queryFn: () => searchTags(query),
    enabled: query.length >= 1,
    staleTime: 1000 * 30, // 30 秒
  });
}
