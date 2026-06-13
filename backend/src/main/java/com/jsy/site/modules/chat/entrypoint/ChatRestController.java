package com.jsy.site.modules.chat.entrypoint;

import com.jsy.site.modules.chat.application.ChatApplicationService;
import com.jsy.site.modules.chat.domain.model.ChatMessage;
import com.jsy.site.modules.chat.domain.model.ChatSession;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatRestController {

    private final ChatApplicationService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatRestController(ChatApplicationService chatService,
                               SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/sessions")
    public List<ChatSession> listSessions(Principal principal) {
        return chatService.listActiveSessions(principal.getName());
    }

    @GetMapping("/sessions/{id}/messages")
    public List<ChatMessage> listMessages(@PathVariable String id) {
        return chatService.getSessionMessages(id);
    }

    @GetMapping("/chatters")
    public List<String> listChatters(Principal principal) {
        return chatService.listChatterUsernames(principal.getName());
    }

    @PostMapping("/sessions/internal")
    public ChatSession createInternalSession(@RequestBody InternalSessionRequest request,
                                              Principal principal) {
        ChatSession session = chatService.createInternalSession(principal.getName(), request.targetUsername());
        messagingTemplate.convertAndSend("/topic/chatter.workspace", session);
        return session;
    }

    public record InternalSessionRequest(String targetUsername) {}
}
