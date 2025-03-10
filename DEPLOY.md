# 部署指南

本文档提供将HIIC.gwy.life应用矩阵首页部署到Vercel的详细步骤。

## 步骤

1. Fork本仓库到您的GitHub账号下

2. 在Vercel上创建新项目，选择从GitHub导入

3. 添加您的自定义域名（例如：hiic.gwy.life）

4. 配置DNS记录，将域名指向Vercel的服务器

5. 等待DNS生效，访问您的网站

## 前提条件

1. 拥有GitHub账号
2. 拥有Vercel账号（可使用GitHub账号登录）
3. 已将本项目代码推送到GitHub仓库

## 部署步骤

### 1. 登录Vercel

访问 [Vercel官网](https://vercel.com/) 并使用GitHub账号登录。

### 2. 导入项目

1. 在Vercel控制台点击"Add New..."按钮，然后选择"Project"
2. 从列表中选择包含本项目的GitHub仓库
3. 如果没有看到您的仓库，可能需要配置GitHub权限，点击"Adjust GitHub App Permissions"

### 3. 配置项目

在配置页面上：

1. **项目名称**：可以使用默认名称或自定义
2. **框架预设**：选择"Other"
3. **构建和输出设置**：
   - 构建命令：留空（因为这是静态HTML网站）
   - 输出目录：留空（使用根目录）
4. **环境变量**：无需添加

### 4. 部署

点击"Deploy"按钮开始部署过程。部署通常在几秒钟内完成。

### 5. 自定义域名（可选）

1. 部署成功后，进入项目设置
2. 点击"Domains"选项卡
3. 添加您的自定义域名（例如：hiic.gwy.life）
4. 按照Vercel提供的说明配置DNS记录

## 持续部署

Vercel会自动监控您的GitHub仓库。每当您推送更改到主分支时，Vercel会自动重新部署您的网站。

## 故障排除

如果遇到部署问题：

1. 检查Vercel构建日志以获取错误信息
2. 确保所有文件路径正确（区分大小写）
3. 验证vercel.json配置是否有效

## 本地预览生产构建

如果您想在本地预览生产构建，可以安装Vercel CLI：

```bash
npm i -g vercel
vercel dev
```

这将在本地启动与Vercel生产环境相同的服务器。 