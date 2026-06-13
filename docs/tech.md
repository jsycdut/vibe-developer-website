# 技术参考文档

## 1. 技术栈

### 前端

| 分类 | 技术 | 版本/说明 |
|------|------|---------|
| 框架 | React + TypeScript | 18.x |
| 构建工具 | Vite | 8.x |
| 样式 | Tailwind CSS | v4（CSS-first，无 config 文件） |
| 路由 | react-router-dom | v6 |
| HTTP 客户端 | axios | JWT 自动注入拦截器 |
| WebSocket | @stomp/stompjs + sockjs-client | STOMP over SockJS |
| Markdown 渲染 | react-markdown + remark-gfm + rehype-katex + react-syntax-highlighter | |
| 聊天 UI | emoji-picker-react + lucide-react | |
| 工具 | clsx + tailwind-merge | 动态类名合并 |

### 后端

| 分类 | 技术 | 版本/说明 |
|------|------|---------|
| 框架 | Spring Boot | 3.2.5 |
| 语言 | Java | 17 |
| 架构 | DDD（领域驱动设计）四层分包 | |
| 数据库 | SQLite（本地嵌入式） | 预留切换 MySQL/PostgreSQL |
| ORM | Spring Data JPA + Hibernate Community Dialects | 支持切换 MyBatis |
| 认证 | Spring Security 6 + JWT（jjwt 0.12.5） | 无状态，Stateless |
| 实时通信 | Spring WebSocket + STOMP | |
| 对象映射 | MapStruct 1.5.5 | Domain ↔ JPA Entity 转换 |
| 文件存储 | 本地 `backend/uploads/` 目录 | 通过 `/files/**` 静态映射访问 |
| 构建 | Maven | |

---

## 2. 项目目录结构

```
vibe-developer-website/
├── frontend/                        # React + Vite 前端
│   ├── src/
│   │   ├── App.tsx                  # 路由入口
│   │   ├── main.tsx                 # ReactDOM 挂载点
│   │   ├── index.css                # Tailwind v4 @import + @theme
│   │   ├── layouts/
│   │   │   ├── PublicLayout.tsx     # 前台顶部导航栏布局
│   │   │   └── AdminLayout.tsx      # 后台侧边栏/汉堡菜单布局
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── NotesListPage.tsx
│   │   │   ├── NoteDetailPage.tsx
│   │   │   ├── PortfolioPage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── ChatPage.tsx         # 独立聊天页（/chat）
│   │   │   ├── AdminLoginPage.tsx
│   │   │   ├── AdminNotesPage.tsx
│   │   │   └── AdminChatPage.tsx
│   │   ├── components/
│   │   │   ├── NoteRenderer.tsx     # Markdown 渲染组件
│   │   │   └── ProtectedRoute.tsx   # 路由鉴权守卫
│   │   ├── contexts/
│   │   │   └── AuthContext.tsx      # JWT 认证上下文
│   │   ├── hooks/
│   │   │   └── useStompClient.ts    # WebSocket 封装
│   │   └── lib/
│   │       └── api.ts               # axios 实例（JWT 拦截器）
│   └── vite.config.ts               # 代理配置（/api → 8080，ws）
│
├── backend/                         # Spring Boot 后端
│   └── src/main/java/com/jsy/site/
│       ├── SiteApplication.java
│       ├── bootstrap/config/        # 全局配置
│       │   ├── SecurityConfig.java  # Spring Security + CORS + JWT Filter
│       │   ├── WebSocketConfig.java # STOMP Broker 注册
│       │   ├── WebMvcConfig.java    # /files/** 静态资源映射
│       │   ├── JwtUtils.java
│       │   ├── JwtAuthFilter.java
│       │   ├── DataInitializer.java # 初始账号创建
│       │   └── UploadController.java
│       └── modules/
│           ├── auth/                # 认证限界上下文
│           ├── content/             # 笔记/评论限界上下文
│           └── chat/                # 实时聊天限界上下文
│
├── docs/                            # 项目文档
│   ├── idea.md / prd.md / dev.md / ui.md
│   ├── plan.md                      # 开发计划（本文件）
│   └── tech.md                      # 技术参考（此文件）
│
└── backend/uploads/                 # 用户上传文件（图片/视频）
```

---

## 3. 运行端口

| 服务 | 地址 |
|------|------|
| 前端开发服务器 | http://localhost:5173 |
| 后端 API | http://localhost:8080 |
| 静态文件（上传） | http://localhost:8080/files/{filename} |

前端通过 Vite 代理转发，开发时无需处理跨域：
- `/api/*` → `http://localhost:8080/api/*`
- `/files/*` → `http://localhost:8080/files/*`
- `/ws-connect` → `http://localhost:8080/ws-connect`（WebSocket）

---

## 4. 用户角色与初始账号

| 用户名 | 密码 | 角色 | 权限说明 |
|--------|------|------|---------|
| `admin` | `admin123` | ADMIN | 全部权限，覆盖 Editor + Chatter |
| `editor` | `editor123` | EDITOR | 笔记 CRUD，无聊天权限 |
| `chatter` | `chatter123` | CHATTER | 聊天室工作台，无笔记权限 |
| —— | —— | Guest | 前台访客，无后台账号，可匿名聊天/评论 |

> 账号由 `DataInitializer` 在后端首次启动时自动创建，密码使用 BCrypt 加密存储。

登录入口：http://localhost:5173/admin/login

登录成功后按角色跳转：
- CHATTER → `/admin/chat`
- ADMIN / EDITOR → `/admin/notes`

---

## 5. REST API 清单

### 认证

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/api/auth/login` | 公开 | 返回 JWT token |

### 笔记

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/api/notes` | 公开 | 笔记列表（按创建时间倒序） |
| GET | `/api/notes/{id}` | 公开 | 笔记详情（含 Markdown content） |
| POST | `/api/notes` | EDITOR / ADMIN | 新建笔记 |
| PUT | `/api/notes/{id}` | EDITOR / ADMIN | 更新笔记 |
| DELETE | `/api/notes/{id}` | EDITOR / ADMIN | 删除笔记 |

### 评论

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/api/notes/{noteId}/comments` | 公开 | 评论列表（按创建时间正序） |
| POST | `/api/notes/{noteId}/comments` | 公开 | 访客提交评论（需填昵称） |
| DELETE | `/api/comments/{id}` | ADMIN | 删除评论 |

### 聊天

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| GET | `/api/chat/sessions` | CHATTER / ADMIN | 会话列表（按最后消息时间倒序） |
| GET | `/api/chat/sessions/{id}/messages` | CHATTER / ADMIN | 会话历史消息 |

### 文件上传

| 方法 | 路径 | 权限 | 说明 |
|------|------|------|------|
| POST | `/api/upload` | 公开 | 上传图片/视频，返回 `{ "url": "/files/xxx" }` |
| GET | `/files/{filename}` | 公开 | 访问已上传文件 |

---

## 6. WebSocket / STOMP 路由

WebSocket 端点：`/ws-connect`（SockJS 兼容）

| 目标（发送） | 说明 |
|-------------|------|
| `/app/chat.join` | 访客加入，payload：`{ sessionId, guestNickname }` |
| `/app/chat.send` | 发送消息，payload：`{ sessionId, senderName, fromChatter, messageType, content, fileUrl? }` |

| 订阅（接收） | 说明 |
|-------------|------|
| `/queue/session/{sessionId}` | 该会话的消息推送（访客订阅） |
| `/queue/session/{sessionId}/joined` | join 成功确认（访客订阅） |
| `/topic/chatter.workspace` | 所有会话的新消息广播（Chatter 工作台订阅） |

> **sessionId 生成规则**：前端用 `crypto.randomUUID()` 预先生成，直接订阅，发 join 时带上，后端使用该 ID 创建会话，避免"先加入才能知道 ID"的死锁。

---

## 7. 数据库

- **类型**：SQLite（本地文件，无需安装数据库服务）
- **文件位置**：`backend/local_site.db`（运行目录下自动创建）
- **DDL 策略**：`ddl-auto: update`（JPA 自动建表/加列）
- **主键规则**：全部由 Java 层生成 UUID，不依赖数据库自增，保证切换数据库时无缝迁移

### 主要表结构

| 表名 | 字段 |
|------|------|
| `users` | id / username / passwordHash / role |
| `notes` | id / title / content(TEXT) / createdAt / updatedAt |
| `comments` | id / noteId / nickname / content(TEXT) / createdAt |
| `chat_sessions` | id / guestNickname / active / createdAt / lastMessage / lastMessageAt |
| `chat_messages` | id / sessionId / senderName / fromChatter / messageType / content / fileUrl / sentAt |

---

## 8. ORM 切换开关

```yaml
# application.yml
site:
  orm-type: jpa   # 改为 mybatis 可切换 ORM（需补充 MyBatis 实现类）
```

切换机制：所有 Repository 实现类带 `@ConditionalOnProperty(name = "site.orm-type", havingValue = "jpa", matchIfMissing = true)`，换 MyBatis 时在 `infrastructure/persistence/mybatis/` 下补充实现即可，Domain 和 Application 层代码零修改。

---

## 9. 关键配置速查

### 前端（`vite.config.ts`）

```ts
define: { global: {} }   // 修复 sockjs-client 白屏问题
```

### 后端（`application.yml`）

```yaml
site:
  jwt:
    secret: jsy-site-jwt-secret-key-must-be-at-least-256-bits-long-for-hs256
    expiration-ms: 86400000   # 24小时
  upload-dir: ${user.dir}/uploads
  orm-type: jpa
```

### 启动命令

```bash
# 后端
cd backend && mvn spring-boot:run

# 前端
cd frontend && npm run dev
```
