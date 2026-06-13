package com.jsy.site.modules.chat.infrastructure.persistence.jpa;

import com.jsy.site.modules.chat.domain.model.ChatSession;
import com.jsy.site.modules.chat.domain.repository.ChatSessionRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@ConditionalOnProperty(name = "site.orm-type", havingValue = "jpa", matchIfMissing = true)
public class ChatSessionRepositoryImpl implements ChatSessionRepository {

    private final ChatSessionJpaRepository jpa;

    public ChatSessionRepositoryImpl(ChatSessionJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public void save(ChatSession session) {
        jpa.save(toEntity(session));
    }

    @Override
    public Optional<ChatSession> findById(String id) {
        return jpa.findById(id).map(this::toDomain);
    }

    @Override
    public List<ChatSession> findAllByOrderByLastMessageAtDesc() {
        return jpa.findAllByOrderByLastMessageAtDesc().stream().map(this::toDomain).toList();
    }

    private ChatSession toDomain(ChatSessionEntity e) {
        ChatSession s = new ChatSession(e.getId(), e.getGuestNickname(), e.isActive(), e.getCreatedAt());
        s.setLastMessage(e.getLastMessage());
        s.setLastMessageAt(e.getLastMessageAt());
        s.setInitiatorName(e.getInitiatorName());
        return s;
    }

    private ChatSessionEntity toEntity(ChatSession s) {
        ChatSessionEntity e = new ChatSessionEntity();
        e.setId(s.getId());
        e.setGuestNickname(s.getGuestNickname());
        e.setActive(s.isActive());
        e.setCreatedAt(s.getCreatedAt());
        e.setLastMessage(s.getLastMessage());
        e.setLastMessageAt(s.getLastMessageAt());
        e.setInitiatorName(s.getInitiatorName());
        return e;
    }
}
