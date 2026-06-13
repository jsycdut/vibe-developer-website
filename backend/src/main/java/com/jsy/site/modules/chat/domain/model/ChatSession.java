package com.jsy.site.modules.chat.domain.model;

import java.time.LocalDateTime;

public class ChatSession {
    private String id;
    private String guestNickname;
    private boolean active;
    private LocalDateTime createdAt;
    private String lastMessage;
    private LocalDateTime lastMessageAt;
    // null=访客发起的会话, non-null=内部会话（记录发起者用户名）
    private String initiatorName;

    public ChatSession() {}

    public ChatSession(String id, String guestNickname, boolean active, LocalDateTime createdAt) {
        this.id = id;
        this.guestNickname = guestNickname;
        this.active = active;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getGuestNickname() { return guestNickname; }
    public void setGuestNickname(String guestNickname) { this.guestNickname = guestNickname; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getLastMessage() { return lastMessage; }
    public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }

    public LocalDateTime getLastMessageAt() { return lastMessageAt; }
    public void setLastMessageAt(LocalDateTime lastMessageAt) { this.lastMessageAt = lastMessageAt; }

    public String getInitiatorName() { return initiatorName; }
    public void setInitiatorName(String initiatorName) { this.initiatorName = initiatorName; }
}
