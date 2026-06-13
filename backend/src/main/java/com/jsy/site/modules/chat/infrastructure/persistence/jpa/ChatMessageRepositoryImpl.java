package com.jsy.site.modules.chat.infrastructure.persistence.jpa;

import com.jsy.site.modules.chat.domain.model.ChatMessage;
import com.jsy.site.modules.chat.domain.repository.ChatMessageRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@ConditionalOnProperty(name = "site.orm-type", havingValue = "jpa", matchIfMissing = true)
public class ChatMessageRepositoryImpl implements ChatMessageRepository {

    private final ChatMessageJpaRepository jpa;

    public ChatMessageRepositoryImpl(ChatMessageJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public void save(ChatMessage message) {
        jpa.save(toEntity(message));
    }

    @Override
    public List<ChatMessage> findBySessionIdOrderBySentAtAsc(String sessionId) {
        return jpa.findBySessionIdOrderBySentAtAsc(sessionId).stream().map(this::toDomain).toList();
    }

    private ChatMessage toDomain(ChatMessageEntity e) {
        return new ChatMessage(e.getId(), e.getSessionId(), e.getSenderName(), e.isFromChatter(),
                e.getMessageType(), e.getContent(), e.getFileUrl(), e.getSentAt());
    }

    private ChatMessageEntity toEntity(ChatMessage m) {
        ChatMessageEntity e = new ChatMessageEntity();
        e.setId(m.getId());
        e.setSessionId(m.getSessionId());
        e.setSenderName(m.getSenderName());
        e.setFromChatter(m.isFromChatter());
        e.setMessageType(m.getMessageType());
        e.setContent(m.getContent());
        e.setFileUrl(m.getFileUrl());
        e.setSentAt(m.getSentAt());
        return e;
    }
}
