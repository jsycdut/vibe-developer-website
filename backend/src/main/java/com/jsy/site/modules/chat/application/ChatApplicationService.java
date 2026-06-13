package com.jsy.site.modules.chat.application;

import com.jsy.site.modules.auth.domain.model.UserRole;
import com.jsy.site.modules.auth.domain.repository.UserRepository;
import com.jsy.site.modules.chat.domain.model.ChatMessage;
import com.jsy.site.modules.chat.domain.model.ChatSession;
import com.jsy.site.modules.chat.domain.repository.ChatMessageRepository;
import com.jsy.site.modules.chat.domain.repository.ChatSessionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class ChatApplicationService {

    private final ChatMessageRepository messageRepository;
    private final ChatSessionRepository sessionRepository;
    private final UserRepository userRepository;

    public ChatApplicationService(ChatMessageRepository messageRepository,
                                   ChatSessionRepository sessionRepository,
                                   UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
    }

    public ChatSession joinSessionWithId(String sessionId, String guestNickname) {
        String id = (sessionId != null && !sessionId.isBlank()) ? sessionId : UUID.randomUUID().toString();
        ChatSession session = new ChatSession(id, guestNickname, true, LocalDateTime.now());
        session.setLastMessageAt(LocalDateTime.now());
        sessionRepository.save(session);
        return session;
    }

    public ChatMessage saveMessage(ChatMessage message) {
        if (message.getId() == null) {
            message.setId(UUID.randomUUID().toString());
        }
        if (message.getSentAt() == null) {
            message.setSentAt(LocalDateTime.now());
        }
        messageRepository.save(message);

        sessionRepository.findById(message.getSessionId()).ifPresent(session -> {
            String preview = message.getMessageType() != null &&
                    message.getMessageType().name().equals("TEXT") ?
                    message.getContent() : "[文件]";
            session.setLastMessage(preview);
            session.setLastMessageAt(message.getSentAt());
            sessionRepository.save(session);
        });

        return message;
    }

    public List<ChatMessage> getSessionMessages(String sessionId) {
        return messageRepository.findBySessionIdOrderBySentAtAsc(sessionId);
    }

    public List<ChatSession> listActiveSessions(String username) {
        return sessionRepository.findAllByOrderByLastMessageAtDesc().stream()
                .filter(s -> s.getInitiatorName() == null
                        || s.getInitiatorName().equals(username)
                        || s.getGuestNickname().equals(username))
                .toList();
    }

    public ChatSession createInternalSession(String initiatorName, String targetName) {
        String id = UUID.randomUUID().toString();
        ChatSession session = new ChatSession(id, targetName, true, LocalDateTime.now());
        session.setInitiatorName(initiatorName);
        session.setLastMessageAt(LocalDateTime.now());
        sessionRepository.save(session);
        return session;
    }

    public List<String> listChatterUsernames(String excludeUsername) {
        return userRepository.findAllByRole(UserRole.CHATTER)
                .stream()
                .map(u -> u.getUsername())
                .filter(u -> !u.equals(excludeUsername))
                .toList();
    }
}
