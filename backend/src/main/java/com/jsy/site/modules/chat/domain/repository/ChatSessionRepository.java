package com.jsy.site.modules.chat.domain.repository;

import com.jsy.site.modules.chat.domain.model.ChatSession;
import java.util.List;
import java.util.Optional;

public interface ChatSessionRepository {
    void save(ChatSession session);
    Optional<ChatSession> findById(String id);
    List<ChatSession> findAllByOrderByLastMessageAtDesc();
}
