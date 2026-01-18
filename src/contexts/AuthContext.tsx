import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Profile } from '../types/database';
import type { User, Session } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithEmail: (email: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: Error | null }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock profile for development when Supabase is not configured
const mockProfile: Profile = {
  id: 'mock-user-id',
  name: '测试用户',
  department: '研发部',
  avatar_url: null,
  role: 'member',
  created_at: new Date().toISOString(),
};

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // 获取用户资料
  const fetchProfile = useCallback(async (userId: string) => {
    if (!isSupabaseConfigured) {
      setProfile(mockProfile);
      return;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('获取用户资料失败:', error);
      return;
    }

    setProfile(data);
  }, []);

  // 初始化认证状态
  useEffect(() => {
    if (!isSupabaseConfigured) {
      // 开发模式：使用 mock 数据
      setLoading(false);
      return;
    }

    // 获取当前会话
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (event === 'SIGNED_IN' && session?.user) {
          await fetchProfile(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setProfile(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [fetchProfile]);

  // 邮箱魔法链接登录
  const signInWithEmail = useCallback(async (email: string) => {
    if (!isSupabaseConfigured) {
      // 开发模式：模拟登录成功
      setUser({ id: mockProfile.id, email } as User);
      setProfile(mockProfile);
      return { error: null };
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    });

    return { error: error ? new Error(error.message) : null };
  }, []);

  // 登出
  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured) {
      setUser(null);
      setProfile(null);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  }, []);

  // 更新用户资料
  const updateProfile = useCallback(async (updates: Partial<Profile>) => {
    if (!user) {
      return { error: new Error('未登录') };
    }

    if (!isSupabaseConfigured) {
      setProfile(prev => prev ? { ...prev, ...updates } : null);
      return { error: null };
    }

    const { error } = await supabase
      .from('profiles')
      .update(updates as never)
      .eq('id', user.id);

    if (error) {
      return { error: new Error(error.message) };
    }

    // 更新本地状态
    setProfile(prev => prev ? { ...prev, ...updates } : null);
    return { error: null };
  }, [user]);

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    isConfigured: isSupabaseConfigured,
    signInWithEmail,
    signOut,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内部使用');
  }
  return context;
}
