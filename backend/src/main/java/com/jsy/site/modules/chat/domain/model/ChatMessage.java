package com.jsy.site.modules.chat.domain.model;

import java.time.LocalDateTime;

public class ChatMessage {
    private String id;
    private String sessionId;
    private String senderName;
    private boolean fromChatter;
    private MessageType messageType;
    private String content;
    private String fileUrl;
    private LocalDateTime sentAt;

    public ChatMessage() {}

    public ChatMessage(String id, String sessionId, String senderName, boolean fromChatter,
                       MessageType messageType, String content, String fileUrl, LocalDateTime sentAt) {
        this.id = id;
        this.sessionId = sessionId;
        this.senderName = senderName;
        this.fromChatter = fromChatter;
        this.messageType = messageType;
        this.content = content;
        this.fileUrl = fileUrl;
        this.sentAt = sentAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getSessionId() { return sessionId; }
    public void setSessionId(String sessionId) { this.sessionId = sessionId; }

    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }

    public boolean isFromChatter() { return fromChatter; }
    public void setFromChatter(boolean fromChatter) { this.fromChatter = fromChatter; }

    public MessageType getMessageType() { return messageType; }
    public void setMessageType(MessageType messageType) { this.messageType = messageType; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }
}
