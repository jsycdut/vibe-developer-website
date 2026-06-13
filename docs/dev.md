
文档遵循“绝不重复造轮子”的原则，所有复杂交互（Markdown 渲染、Emoji 选择、WebSocket 封装、响应式滑块、DDD 实体转换）全部交由对应的明星开源组件解决，并提供给 Claude 精确的配置与代码脚手架。

---

# 个人网站项目全栈技术架构与实施文档 (TDD)

## 1. 技术栈与开源组件选型 (Bill of Materials)

本着成熟、稳定、高内聚的原则，全栈核心依赖库选型如下：

### 1.1 前端 (React 生态)

* **核心框架**：React 18.x + Vite (构建工具) + TypeScript。
* **样式与自适应**：Tailwind CSS + `clsx` / `tailwind-merge`（动态类名合并）。
* **路由管理**：`react-router-dom` v6 (成熟的声明式路由)。
* **实时通信客户端**：`@stomp/stompjs` + `sockjs-client` (Spring WebSocket 官方标准配套)。
* **Markdown 渲染**：`react-markdown` + `remark-gfm` (支持表格/任务列表) + `rehype-katex` / `remark-math` (公式渲染) + `react-syntax-highlighter` (代码高亮)。
* **聊天室辅助组件**：`emoji-picker-react` (开箱即用表情包) + `lucide-react` (高质感扁平化图标库)。

### 1.2 后端 (Spring Boot 生态)

* **核心框架**：Spring Boot 3.x + Java 17。
* **数据持久化 (当前)**：Spring Data JPA + SQLite JDBC Driver (`org.xerial:sqlite-jdbc`)。
* **模型映射 (DDD 必备)**：MapStruct 1.x (编译期自动生成 Domain 与 Entity 之间的转换代码，零性能损耗、极其稳定)。
* **对象安全与校验**：Spring Boot Starter Validation (基于 JSR-380)。
* **实时网络通信**：`spring-boot-starter-websocket` (集成内置 STOMP 内存级 Broker)。

---

## 2. 后端 DDD 架构脚手架与依赖倒置配置

为了支持后续一键切换 MySQL 和 MyBatis，Claude 需要严格按照以下依赖倒置结构编写基础设施。

### 2.1 依赖配置文件 `pom.xml` 核心依赖

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-websocket</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.xerial</groupId>
        <artifactId>sqlite-jdbc</artifactId>
    </dependency>
    <dependency>
        <groupId>org.hibernate.orm</groupId>
        <artifactId>hibernate-community-dialects</artifactId>
    </dependency>

    <dependency>
        <groupId>org.mapstruct</groupId>
        <artifactId>mapstruct</artifactId>
        <version>1.5.5.Final</version>
    </dependency>
</dependencies>

```

### 2.2 数据库连接与 ORM 条件驱动配置 (`application.yml`)

```yaml
spring:
  profiles:
    active: dev
  datasource:
    url: jdbc:sqlite:local_site.db
    driver-class-name: org.xerial.sqlite.jdbc.JDBC
  jpa:
    database-platform: org.hibernate.dialect.SQLiteDialect
    hibernate:
      ddl-auto: update
    show-sql: true

# 自定义开关：用于未来无缝切换到 mybatis
site:
  orm-type: jpa

```

### 2.3 基础设施层封装示例：MapStruct 转换器

通过 MapStruct 隔离 Domain 和 JPA Entity，避免在业务层产生侵入。

```java
package com.jsy.site.modules.content.infrastructure.persistence.jpa;

import com.jsy.site.modules.content.domain.model.Note;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper(componentModel = "spring")
public interface NoteDataMapper {
    NoteEntity toEntity(Note domain);
    Note toDomain(NoteEntity entity);
}

```

---

## 3. WebSocket 实时网络通信设计 (STOMP 协议)

后端抛弃自定义轮询或低级 TCP Socket，直接使用标准的 STOMP 消息代理。

### 3.1 后端配置类 `WebSocketConfig.java`

```java
package com.jsy.site.bootstrap.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.*;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // 允许跨域连接的 SockJS 端点
        registry.addEndpoint("/ws-connect")
                .setAllowedOriginPatterns("*")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // 客户端接收消息的前缀：/topic 广播，/queue 私聊
        registry.enableSimpleBroker("/topic", "/queue");
        // 客户端发送消息到达指定 Controller 的前缀
        registry.setApplicationDestinationPrefixes("/app");
    }
}

```

### 3.2 聊天控制器 `ChatEndpointController.java`

```java
package com.jsy.site.modules.chat.entrypoint;

import com.jsy.site.modules.chat.application.ChatApplicationService;
import com.jsy.site.modules.chat.domain.model.ChatMessage;
import org.springframework.messaging.handler.annotation.*;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatEndpointController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatApplicationService chatService;

    public ChatEndpointController(SimpMessagingTemplate messagingTemplate, ChatApplicationService chatService) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
    }

    @MessageMapping("/chat.send")
    public void handleIncomingMessage(@Payload ChatMessage message) {
        // 1. 业务生成时通过 Java 代码分配 UUID 并落库持久化
        chatService.saveMessage(message);
        
        // 2. 路由分发：点对点推送到具体的会话中
        messagingTemplate.convertAndSend("/queue/session/" + message.getSessionId(), message);
        // 3. 同时推送到后台 Chatter 工作台的总控台
        messagingTemplate.convertAndSend("/topic/chatter.workspace", message);
    }
}

```

---

## 4. 前端核心组件集成与移动端状态机

### 4.1 React-Markdown 极简高效集成

前台笔记页直接使用标准成熟的组合，防止富文本产生注入攻击（XSS）。

```tsx
import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const NoteRenderer = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        code({ node, inline, className, children, ...props }) {
          const match = /language-(\w+)/.exec(className || '');
          return !inline && match ? (
            <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>{children}</code>
          );
        },
      }}
      className="prose prose-slate max-w-none"
    >
      {content}
    </ReactMarkdown>
  );
};

```

### 4.2 后台聊天室自适应布局 React 状态机

依靠 `activeSessionId` 控制动画偏移，无需任何重量级 UI 库，使用 Tailwind 原生动画即可达到 60 帧满帧滑动。

```tsx
import React, { useState } from 'react';
import { ArrowLeft, Smile, Image as ImageIcon } from 'lucide-react';
import EmojiPicker from 'emoji-picker-react';

export const MobileResponsiveChatConsole = () => {
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] flex overflow-hidden bg-slate-50">
      
      {/* 栏目一：会话列表 (在移动端激活会话时被推到左边隐藏) */}
      <div className={`w-full md:w-80 shrink-0 border-r border-slate-900/10 bg-white transition-transform duration-300 ease-in-out
        ${activeSessionId ? '-translate-x-full md:translate-x-0' : 'translate-x-0'}`}
      >
        <div className="p-4 font-bold border-b border-slate-900/10">对话列表</div>
        <div className="p-4 cursor-pointer hover:bg-slate-50" onClick={() => setActiveSessionId('session-101')}>
          <p className="font-semibold text-slate-800">王访客</p>
          <p className="text-sm text-slate-500 truncate">你们的系统是用JPA写的吗？</p>
        </div>
      </div>

      {/* 栏目二：大视窗聊天框 (在移动端默认在右侧屏幕外，激活后滑入) */}
      <div className={`absolute md:static top-0 left-0 w-full h-full bg-white flex flex-col transition-transform duration-300 ease-in-out
        ${activeSessionId ? 'translate-x-0' : 'translate-x-full md:translate-x-0'}`}
      >
        {/* 聊天头部 */}
        <div className="h-14 border-b border-slate-900/10 px-4 flex items-center justify-between bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-2">
            {/* 移动端专属返回按钮 */}
            <button className="md:hidden p-1 hover:bg-slate-100 rounded-lg" onClick={() => setActiveSessionId(null)}>
              <ArrowLeft size={20} />
            </button>
            <span className="font-bold text-slate-800">王访客</span>
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        </div>

        {/* 聊天气泡区 */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50">
          <div className="flex justify-end"><div className="bg-blue-500 text-white p-3 rounded-2xl max-w-xs shadow-sm">你们的系统是用JPA写的吗？</div></div>
          <div className="flex justify-start"><div className="bg-white text-slate-800 p-3 rounded-2xl border border-slate-900/10 max-w-xs shadow-sm">没错，但后期能切MyBatis。</div></div>
        </div>

        {/* 底部操作栏与Emoji集成 */}
        <div className="p-3 border-t border-slate-900/10 bg-white relative">
          {showEmoji && <div className="absolute bottom-16 left-2 z-50"><EmojiPicker onEmojiClick={(e) => console.log(e.emoji)} /></div>}
          <div className="flex items-center gap-2">
            <button className="p-2 text-slate-500 hover:text-slate-800" onClick={() => setShowEmoji(!showEmoji)}><Smile size={22} /></button>
            <button className="p-2 text-slate-500 hover:text-slate-800"><ImageIcon size={22} /></button>
            <input type="text" className="flex-1 px-4 py-2 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20" placeholder="键入回复内容..." />
          </div>
        </div>
      </div>
      
    </div>
  );
};

```
