# HIIC AI Lab 内部社区 - Supabase 集成设计

> 日期: 2026-01-18
> 状态: 待实施

## 概述

将现有的静态论坛组件改造为真实的内部社区系统，使用 Supabase 作为后端服务。

### 目标

- 支持真实的发帖、评论、点赞、收藏功能
- 支持匿名发帖
- 支持标签系统
- 邮箱魔法链接登录
- 保持现有 UI 风格不变

### 技术选型

| 层级 | 技术 |
|------|------|
| 前端 | React + TypeScript + Tailwind CSS (现有) |
| 数据获取 | @tanstack/react-query |
| 后端 | Supabase (PostgreSQL + Auth + Realtime) |
| 认证 | 邮箱魔法链接 (OTP) |

---

## 数据库设计

### ER 关系图

```
profiles (用户)
    |
    ├── posts (帖子) ──── post_tags ──── tags (标签)
    |       |
    |       └── comments (评论)
    |
    └── reactions (点赞/收藏)
```

### 表结构

#### profiles (用户信息)

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  department TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'member' CHECK (role IN ('member', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### tags (标签)

```sql
CREATE TABLE tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  usage_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### posts (帖子)

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('qa', 'tips', 'talk', 'activity')),
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  is_anonymous BOOLEAN DEFAULT FALSE,
  is_pinned BOOLEAN DEFAULT FALSE,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### post_tags (帖子-标签关联)

```sql
CREATE TABLE post_tags (
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);
```

#### comments (评论)

```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### reactions (互动)

```sql
CREATE TABLE reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
  target_id UUID NOT NULL,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('like', 'favorite')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, target_type, target_id, reaction_type)
);
```

### 索引

```sql
CREATE INDEX idx_posts_category ON posts(category);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_author ON posts(author_id);
CREATE INDEX idx_comments_post ON comments(post_id);
CREATE INDEX idx_reactions_target ON reactions(target_type, target_id);
CREATE INDEX idx_tags_usage ON tags(usage_count DESC);
```

### 触发器

```sql
-- 用户首次登录时自动创建 profile
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, department)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    '待填写'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## Row Level Security (RLS)

```sql
-- 启用 RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_tags ENABLE ROW LEVEL SECURITY;

-- PROFILES
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- POSTS
CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can update own posts"
  ON posts FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Authors can delete own posts"
  ON posts FOR DELETE USING (auth.uid() = author_id);

CREATE POLICY "Admins can update any post"
  ON posts FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- COMMENTS
CREATE POLICY "Comments are viewable by everyone"
  ON comments FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create comments"
  ON comments FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Authors can delete own comments"
  ON comments FOR DELETE USING (auth.uid() = author_id);

-- REACTIONS
CREATE POLICY "Reactions are viewable by everyone"
  ON reactions FOR SELECT USING (true);

CREATE POLICY "Users can manage own reactions"
  ON reactions FOR ALL USING (auth.uid() = user_id);

-- TAGS
CREATE POLICY "Tags are viewable by everyone"
  ON tags FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create tags"
  ON tags FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- POST_TAGS
CREATE POLICY "Post tags are viewable by everyone"
  ON post_tags FOR SELECT USING (true);

CREATE POLICY "Post authors can manage post tags"
  ON post_tags FOR ALL USING (
    EXISTS (SELECT 1 FROM posts WHERE id = post_id AND author_id = auth.uid())
  );
```

---

## 前端代码结构

### 新增文件

```
src/
├── lib/
│   └── supabase.ts              # Supabase 客户端
├── hooks/
│   ├── useAuth.ts               # 认证状态
│   ├── usePosts.ts              # 帖子 CRUD
│   ├── useComments.ts           # 评论 CRUD
│   ├── useReactions.ts          # 点赞/收藏
│   └── useTags.ts               # 标签管理
├── contexts/
│   └── AuthContext.tsx          # 认证上下文
├── components/
│   └── LoginModal.tsx           # 登录弹窗
└── types/
    └── database.ts              # Supabase 类型
```

### 依赖安装

```bash
npm install @supabase/supabase-js @tanstack/react-query
```

### 环境变量

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key
```

---

## 认证流程

```
用户点击"发帖" → 检查登录状态
       |
       ├── 已登录 → 打开发帖弹窗
       |
       └── 未登录 → 打开登录弹窗
                        |
                        ├── 输入工作邮箱
                        ├── 发送魔法链接
                        ├── 用户点击邮件链接
                        └── 自动登录 + 创建 profile
```

---

## 匿名发帖机制

| 层级 | 处理方式 |
|------|----------|
| 数据库 | `author_id` 始终存储真实用户 ID |
| 前端展示 | 当 `is_anonymous = true` 时显示 "匿名用户" |
| 管理后台 | 管理员可查看匿名帖子的真实作者 |

---

## 实施步骤

### 阶段 1: Supabase 设置
1. 创建 Supabase 项目
2. 执行数据库 Schema SQL
3. 配置 RLS 策略
4. 设置邮箱模板

### 阶段 2: 前端集成
1. 安装依赖
2. 创建 Supabase 客户端
3. 实现 AuthContext
4. 创建 LoginModal 组件

### 阶段 3: Hooks 开发
1. usePosts hook
2. useComments hook
3. useReactions hook
4. useTags hook

### 阶段 4: 组件改造
1. 改造 ForumPage 使用 usePosts
2. 改造 CreatePostModal 使用 useCreatePost
3. 改造 PostDetailModal 使用 useComments
4. 添加登录状态检查

### 阶段 5: 测试与部署
1. 本地测试所有功能
2. 配置生产环境变量
3. 部署验证

---

## 注意事项

- 匿名帖子的 `author_id` 仍需存储，用于管理需要
- 标签的 `usage_count` 需要通过触发器或应用层维护
- 考虑添加帖子浏览量统计（可选使用 Supabase Edge Functions）
- 生产环境需配置邮箱发送域名
