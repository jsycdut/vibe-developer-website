package com.jsy.site.modules.chat.domain.repository;

import com.jsy.site.modules.chat.domain.model.ChatMessage;
import java.util.List;

public interface ChatMessageRepository {
    void save(ChatMessage message);
    List<ChatMessage> findBySessionIdOrderBySentAtAsc(String sessionId);
}
