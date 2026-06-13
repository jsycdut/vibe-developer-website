package com.jsy.site.modules.content.domain.model;

import java.time.LocalDateTime;

public class Comment {
    private String id;
    private String noteId;
    private String nickname;
    private String content;
    private LocalDateTime createdAt;

    public Comment() {}

    public Comment(String id, String noteId, String nickname, String content, LocalDateTime createdAt) {
        this.id = id;
        this.noteId = noteId;
        this.nickname = nickname;
        this.content = content;
        this.createdAt = createdAt;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNoteId() { return noteId; }
    public void setNoteId(String noteId) { this.noteId = noteId; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
