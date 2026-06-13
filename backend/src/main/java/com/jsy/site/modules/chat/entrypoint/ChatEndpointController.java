package com.jsy.site.modules.chat.entrypoint;

import com.jsy.site.modules.chat.application.ChatApplicationService;
import com.jsy.site.modules.chat.domain.model.ChatMessage;
import com.jsy.site.modules.chat.domain.model.ChatSession;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class ChatEndpointController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatApplicationService chatService;

    public ChatEndpointController(SimpMessagingTemplate messagingTemplate,
                                   ChatApplicationService chatService) {
        this.messagingTemplate = messagingTemplate;
        this.chatService = chatService;
    }

    @MessageMapping("/chat.join")
    public void handleJoin(@Payload JoinRequest request) {
        ChatSession session = chatService.joinSessionWithId(request.sessionId(), request.guestNickname());
        messagingTemplate.convertAndSend("/queue/session/" + session.getId() + "/joined", session);
        messagingTemplate.convertAndSend("/topic/chatter.workspace", session);
    }

    @MessageMapping("/chat.send")
    public void handleMessage(@Payload ChatMessage message) {
        ChatMessage saved = chatService.saveMessage(message);
        messagingTemplate.convertAndSend("/queue/session/" + saved.getSessionId(), saved);
        messagingTemplate.convertAndSend("/topic/chatter.workspace", saved);
    }

    public record JoinRequest(String sessionId, String guestNickname) {}
}
