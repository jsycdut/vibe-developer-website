# 个人网站项目产品需求文档 (PRD)

## 1. 项目概述

### 1.1 项目背景与目标
本项目旨在打造一个集个人品牌展示、技术笔记沉淀、作品集陈列以及**多端跨设备实时网络互动**的个人全栈站点。项目首期采用**纯本地 SQLite 数据存储**以降低初期部署与维护成本，但通信层完全支持**真实局域网/公网的实时网络连接**，满足跨设备（如手机与电脑后台）的即时通讯交互。

### 1.2 核心技术栈演进规划
为了应对未来可能出现的技术架构变更，项目在设计之初即采取高度解耦的工程设计，明确技术栈及演进路线如下：
* **前端 (Frontend)**：React + Tailwind CSS。
* **后端 (Backend)**：Spring Boot 3.x (Java 17+)，采用 **DDD（领域驱动设计）** 架构。
* **实时通信 (Real-time)**：Spring WebSocket + STOMP 协议。
* **数据存储与持久化 (Persistence)**：
  * **当前阶段**：本地嵌入式 SQLite 数据库 + Spring Data JPA。
  * **演进预留**：架构上必须支持一键无缝切换至 **MySQL / PostgreSQL**，并支持将数据访问层平滑替换为 **MyBatis** 框架。

### 1.3 核心设计原则
* **高质感扁平风 (Premium Flat)**：全站 UI 摒弃粗糙的手绘感或过度的拟物化，采用现代扁平化设计。通过柔和低饱和度的配色、精致的细边框、克制的阴影（Box Shadow）以及通透的毛玻璃效果（Backdrop Blur），营造高质感的极客氛围。
* **移动端全自适应 (Mobile First for Chat)**：由于后台聊天室的使用场景包含移动端随时随地沟通，因此后台聊天室界面必须完美适配手机屏幕，保障丝滑的移动端交互体验。

---

## 2. 用户角色与权限架构 (RBAC)

系统角色职责完全解耦，前台访客与后台管理角色形成绝对物理隔离：

| 角色 (Role) | 权限描述 | 对应前后台模块 |
| :--- | :--- | :--- |
| **Guest (访客)** | **非后台角色，无法登录后台**。在前台浏览内容、提交评论；在前台聊天界面输入临时昵称后，可直接**发起/参与实时聊天**。 | 前台展示、评论提交、前台实时聊天窗口 |
| **Chatter (客服/聊天官)** | **专属后台角色，只用于实时聊天，不处理任何其他事务**。该角色不提供任何聊天记录的运营管理、强行删除或审计功能，使其保持职责单一性。登录后直达后台聊天室工作台。 | 后台管理 - 实时聊天室工作台 |
| **Editor (内容官)** | **专属后台角色**。仅负责内容的生产，拥有文章、作品集的完整 **CRUD**（增删改查）权限。无聊天权限，无用户管理权限。 | 后台管理 - 笔记管理/作品管理 |
| **Admin (超级管理员)** | **全能后台角色**。拥有系统最高权限，覆盖 `Chatter` 和 `Editor` 的所有功能与系统全局配置。 | 后台管理 - 完整模块 |

---

## 3. 功能需求详解

### 3.1 前台展示模块 (Frontend - React)

前台采用标准的现代扁平化顶部导航栏（包含：首页、作品集、笔记、关于我）。
* **导航交互微效**：当某个导航标签被**选中/激活**时，对应文字**叠加一层精致、柔和的适当阴影**（`text-shadow: 0 2px 4px rgba(0,0,0,0.15);`），用于清晰指示当前页面位置，而未选中标签保持常规扁平无阴影状态。

#### 3.1.1 首页 (Home)
* **视觉要素**：大圆角扁平化容器卡片，微圆角设计，采用 `neutral` 或 `slate` 柔和色调。
* **文案核心**：页面居中大字标语：“欢迎来到jsy的站点，have fun!”。

#### 3.1.2 笔记 (Notes)
* **列表页**：按时间倒序（最新在最前）整齐排列文章列表，每行显示发布日期 `YYYY-MM-DD` 与文章标题。
* **详情页**：
  * 支持标准的 Markdown 渲染，包括代码高亮、表格、数学公式等。
  * **评论/留言区**：访客在输入框输入临时“昵称”和“评论内容”即可提交。评论直接写入本地数据库，按时间正序（最早在最上）展示在文章下方，不设后台审核流程（Admin 可直接在后台删除）。

#### 3.1.3 作品集 (Portfolio)
* **现代卡片式布局**：内置三款核心作品卡片，鼠标悬浮（Hover）时伴有微弱的垂直位移或阴影加深效果：
  1. **体育直播赛事链接解析**：点击跳转或打开解析工具面板。
  2. **线上聊天室**：点击可直接打开前台聊天浮窗或进入独立聊天页。
  3. **A股历史数据**：为未来数据分析预留的入口卡片。

#### 3.1.4 关于我 (About)
* **胶囊履历轴**：采用质感扁平色块的长条胶囊框，文字居中，清晰展示职场时间线：
  * `2024.05 ~ 2026.04 招商银行`
  * `2024.05 ~ 2026.04 蚂蚁集团`

---

### 3.2 后台管理模块 (Admin Dashboard)

整个后台基于响应式布局设计。在 **PC 端**采用经典的左侧导航栏 + 右侧工作区结构；切换至**手机端（窄屏）**时，左侧菜单自动收起隐藏为顶部汉堡按钮（Hamburger Menu），右侧工作区全屏自适应铺满。

#### 3.2.1 笔记管理 (Editor / Admin Visible)
* 提供标准的文章列表工作台，支持对文章进行标题搜索、编辑、删除、新建及发布。

#### 3.2.2 实时聊天室工作台 (Chatter / Admin Visible)
该界面作为 `Chatter` 角色登录后的核心（且唯一）工作台，完美还原高质感扁平化聊天设计，并做移动端专项优化：

* **PC 端双栏布局**：左侧为当前在线/活跃的会话列表（展示用户临时昵称、最后一条消息摘要及时间戳）；右侧为大视窗独立聊天框。
* **手机端自适应布局（核心机制）**：
  * 采用**双层滑块/视图切换机制**。默认状态下仅展示“会话列表”；当 Chatter 点击某个访客（如“王访客”）后，列表向左滑出隐藏，屏幕全屏展示与该访客的“聊天详情页”。
  * 聊天详情页左上角必须提供明显的“返回”按钮，点击后视图回退，重新显示会话列表。
* **核心交互要素**：
  * **状态指示**：主聊天窗顶部清晰显示当前对话用户的名字与实时连接状态（如 “王访客 - 在线/离线”）。
  * **双向气泡**：Chatter 自己发送的消息靠右（高亮品牌蓝背景，白色文字）；访客发送的消息靠左（浅灰/白背景，暗色文字）。
  * **功能底栏**：包含内置表情（Emoji）选择器、图片上传按钮、文本输入框。支持 `Enter` 发送（手机端表现为软键盘“发送”键），`Shift + Enter` 换行。

---

## 4. 后端 DDD 架构与动态切换规范

为了在后期实现“零成本”平滑切换数据库（SQLite -> MySQL / PostgreSQL）和 ORM 框架（JPA -> MyBatis），后端系统严格采用 **DDD（领域驱动设计）** 的四层分包架构，利用**依赖倒置原则 (DIP)** 将业务与底层技术实现完全隔离。

### 4.1 后端目录结构与依赖倒置

```text
src/main/java/com/jsy/site
│
├── bootstrap                   // 全局启动与基础配置（Security, WebSocket 注册等）
│
└── modules                     // 按限界上下文（Bounded Context）水平解耦业务
    ├── content                 // 1. 笔记内容限界上下文（文章与评论）
    │   ├── entrypoint          // [User Interface 层] Controller, DTO, 外部接口契约
    │   ├── application         // [Application 层] 应用服务，编排业务流与事务控制
    │   ├── domain              // [Domain 层] 纯粹业务逻辑（核心，无任何 Spring/JPA 注解）
    │   │   ├── model           // 领域实体（Note, Comment）、聚合根、值对象
    │   │   └── repository      // 仓储接口定义（纯 Java 接口）
    │   └── infrastructure      // [Infrastructure 层] 基础设施层（底层技术实现）
    │       └── persistence     // 持久化方案隔离
    │           ├── jpa         // 当前：JPA 的具体实现（包含 JPA Entity、Spring Data 接口）
    │           └── mybatis     // 未来扩展：MyBatis 实现（包含 DO、Mapper 接口、XML 映射）
    │
    └── chat                    // 2. 实时聊天限界上下文
        ├── entrypoint          // WebSocket 消息接入端点 (STOMP Handlers)
        ├── application         // 聊天流控制、在线会话状态管理
        ├── domain              // 聊天领域模型 (ChatMessage) 与仓储接口
        └── infrastructure      // 存储历史记录的具体实现（当前为 JPA 实现）
###	4.2 技术无缝切换规约
纯 Java 领域模型：domain/model 下的实体是纯粹的 Java 类（POJO），禁止包含 @Entity, @Table 或 MyBatis 相关的任何特定持久化注解。

屏蔽数据库方言特性：

禁止在代码中编写带有 SQLite 特性的原生 SQL 语句。

全局主键（ID）不在数据库端使用自增（Auto Increment），而是由 Java 业务代码（Domain/Application 层）在实体创建时统一生成 UUID（如 UUID.randomUUID().toString()），确保底层存储介质一键替换时表结构无感过渡。

ORM 动态条件注入：

业务层仅通过构造函数注入调用 domain/repository 下的纯接口。

在 infrastructure 中通过 Spring 的条件注解 @ConditionalOnProperty(name = "site.orm-type", havingValue = "jpa", matchIfMissing = true) 控制当前生效的实现类。未来切换到 MyBatis 时只需在 mybatis 包下补充实现类，并将配置文件改为 site.orm-type=mybatis 即可，Application 层和 Domain 层的代码完全不需要重写或重新测试。

## 5. 本地数据模型设计 (Entity 结构示例)
### 5.1 领域模型示例 (Domain Model - 无任何 ORM 注解)
```
package com.jsy.site.modules.content.domain.model;

import java.time.LocalDateTime;

public class Note {
    private String id;          // Java 生成的 UUID
    private String title;
    private String content;     // Markdown 原文
    private LocalDateTime createdAt;

    // 纯 Java 业务行为方法，不与任何数据库框架挂钩
    public void updateContent(String newContent) {
        this.content = newContent;
    }
    
    // Getters and Setters ...
}
```
### 5.2 基础设施层持久化模型示例 (JPA 实体 - 仅存在于 infrastructure 内部)
```
package com.jsy.site.modules.content.infrastructure.persistence.jpa;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notes")
public class NoteEntity {
    @Id
    private String id; 
    private String title;
    
    @Column(columnDefinition = "TEXT")
    private String content;
    
    private LocalDateTime createdAt;
    
    // Getters and Setters ...
}
```