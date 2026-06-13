# 个人全栈网站 从零到一 开发计划

## 背景

基于 idea.md / prd.md / dev.md / ui.md 四份文档，从空仓库构建完整个人全栈网站。

**关键决策**
- 目录结构：`frontend/` + `backend/` 同一 repo
- 后端构建：Maven
- 认证方案：JWT Token + Spring Security RBAC（4 角色）
- 开发顺序：前后端并行，最后联调

---

## 阶段 0：项目脚手架 ✅

**目标**：建立可运行的前后端骨架。

- 后端：`backend/pom.xml` + `application.yml` + `SiteApplication.java` + DDD 空包骨架
- 前端：Vite + React + TypeScript，安装全部依赖，配置 Tailwind v4 Design Tokens，配置 Vite 代理

**验证**：后端 `mvn spring-boot:run`（8080）；前端 `npm run dev`（5173）均可启动。

> **已知坑**：`sockjs-client` 依赖 Node.js 的 `global`，需在 `vite.config.ts` 加 `define: { global: {} }`，否则白屏。

---

## 阶段 1：后端认证模块 ✅

**目标**：JWT 登录 + RBAC 鉴权。

关键文件：
- `modules/auth/domain/model/User.java`（POJO + UserRole 枚举）
- `modules/auth/infrastructure/persistence/jpa/`（UserEntity / UserJpaRepository / UserRepositoryImpl）
- `modules/auth/application/AuthApplicationService.java`
- `modules/auth/entrypoint/AuthController.java`（POST /api/auth/login）
- `bootstrap/config/JwtUtils.java` + `JwtAuthFilter.java` + `SecurityConfig.java`
- `bootstrap/config/DataInitializer.java`（启动时自动建初始账号）

> **已知坑**：Spring Security 6.x 必须将 CORS Bean 命名为 `corsConfigurationSource`，并用 `.cors(Customizer.withDefaults())`，否则 403 Invalid CORS request。

**验证**：POST /api/auth/login 返回 JWT；有 token → 200，无 token → 401。

---

## 阶段 2：后端内容模块 ✅

**目标**：笔记 CRUD + 评论 API。

关键文件：
- `modules/content/domain/model/`（Note.java / Comment.java，纯 POJO）
- `modules/content/domain/repository/`（NoteRepository / CommentRepository，纯接口）
- `modules/content/infrastructure/persistence/jpa/`（Entity / JpaRepository / RepositoryImpl）
- `modules/content/application/`（NoteApplicationService / CommentApplicationService）
- `modules/content/entrypoint/`（NoteController / CommentController）

**验证**：curl 测试全部接口，鉴权符合预期。

---

## 阶段 3：后端聊天模块 ✅

**目标**：WebSocket + STOMP 实时聊天，支持文字/图片/视频消息。

关键文件：
- `bootstrap/config/WebSocketConfig.java`（STOMP Broker 注册）
- `modules/chat/domain/model/`（ChatMessage / ChatSession / MessageType）
- `modules/chat/infrastructure/persistence/jpa/`（Entity / JpaRepository / RepositoryImpl × 2）
- `modules/chat/application/ChatApplicationService.java`
- `modules/chat/entrypoint/ChatEndpointController.java`（STOMP 消息处理）
- `modules/chat/entrypoint/ChatRestController.java`（REST 会话/历史接口）
- `bootstrap/config/UploadController.java`（POST /api/upload，存 backend/uploads/）
- `bootstrap/config/WebMvcConfig.java`（/files/** 静态资源映射）

> **设计要点**：前端预先生成 UUID 作为 sessionId，直接订阅 `/queue/session/{uuid}`，join 时把 sessionId 一并发给后端，避免"先加入才能知道 ID"的死锁问题。

**验证**：两标签页模拟访客和 Chatter，文字/图片/视频双向实时到达。

---

## 阶段 4：前端基础架构 ✅

**目标**：路由体系、认证上下文、API 客户端。

关键文件：
- `frontend/src/main.tsx`（BrowserRouter + AuthProvider 根节点）
- `frontend/src/App.tsx`（Routes 定义，含公开/后台两套路由）
- `frontend/src/layouts/PublicLayout.tsx`（顶部导航栏，激活态绿色+drop-shadow）
- `frontend/src/layouts/AdminLayout.tsx`（PC 侧边栏 + 手机汉堡抽屉）
- `frontend/src/contexts/AuthContext.tsx`（JWT 解析 + login/logout）
- `frontend/src/lib/api.ts`（axios + JWT 拦截器 + 401 自动跳转）
- `frontend/src/components/ProtectedRoute.tsx`（按角色守卫路由）

**验证**：未登录访问 /admin/* 自动跳转 /admin/login。

---

## 阶段 5：前台公开页面 ✅

关键文件：
- `HomePage.tsx`（大圆角卡片 + 硬投影）
- `NotesListPage.tsx`（日期 + 标题列表，倒序）
- `NoteDetailPage.tsx`（Markdown 渲染 + 评论区）
- `NoteRenderer.tsx`（react-markdown + remark-gfm + rehype-katex + SyntaxHighlighter）
- `PortfolioPage.tsx`（3 张卡片，hover 上移阴影；聊天室卡片跳 /chat）
- `AboutPage.tsx`（胶囊履历轴）

---

## 阶段 6：前台独立聊天页 ✅

**唯一入口**：作品集页面的「线上聊天室」卡片 → `/chat`，无其他入口。

关键文件：
- `frontend/src/pages/ChatPage.tsx`（全屏聊天页）
- `frontend/src/hooks/useStompClient.ts`（@stomp/stompjs 封装）

流程：进入页面 → 输入昵称 → 前端生成 UUID sessionId → STOMP 连接 → 发 join → 订阅 `/queue/session/{uuid}` 收 Chatter 回复。

---

## 阶段 7：后台管理系统 ✅

关键文件：
- `AdminLoginPage.tsx`（登录 → 按角色跳转）
- `AdminNotesPage.tsx`（列表+搜索+新建/编辑弹窗+删除确认弹窗）
- `AdminChatPage.tsx`（PC 双栏 / 手机滑动状态机 + Emoji 选择器 + 文件上传）

---

## 阶段 8：集成联调与收尾

- [ ] CORS 配置验证（已修复，Bean 名 `corsConfigurationSource` + `Customizer.withDefaults()`）
- [ ] WebSocket SockJS 代理（vite.config.ts `ws: true`）
- [ ] JWT 过期处理（axios 401 拦截 → /admin/login）
- [ ] 移动端聊天室滑动动画流畅度
- [ ] Markdown：代码高亮、表格、数学公式
- [ ] 评论提交后立即追加到列表
- [ ] 导航栏激活态 text-shadow
- [ ] 作品集卡片 hover 动效

---

## 坑汇总（避免重复踩）

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 白屏 | sockjs-client 用了 Node.js `global` | vite.config.ts 加 `define: { global: {} }` |
| 登录 403 Invalid CORS request | Spring Security 6 查找固定名称的 Bean | CORS Bean 命名为 `corsConfigurationSource`，用 `Customizer.withDefaults()` |
