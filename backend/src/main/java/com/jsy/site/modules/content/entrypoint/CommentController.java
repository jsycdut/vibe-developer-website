package com.jsy.site.modules.content.entrypoint;

import com.jsy.site.modules.content.application.CommentApplicationService;
import com.jsy.site.modules.content.domain.model.Comment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class CommentController {

    private final CommentApplicationService commentService;

    public CommentController(CommentApplicationService commentService) {
        this.commentService = commentService;
    }

    @GetMapping("/notes/{noteId}/comments")
    public List<Comment> list(@PathVariable String noteId) {
        return commentService.listByNote(noteId);
    }

    @PostMapping("/notes/{noteId}/comments")
    public ResponseEntity<Comment> create(@PathVariable String noteId,
                                          @RequestBody CommentRequest request) {
        return ResponseEntity.ok(commentService.create(noteId, request.nickname(), request.content()));
    }

    @DeleteMapping("/comments/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        commentService.delete(id);
        return ResponseEntity.ok(Map.of("message", "deleted"));
    }

    public record CommentRequest(String nickname, String content) {}
}
