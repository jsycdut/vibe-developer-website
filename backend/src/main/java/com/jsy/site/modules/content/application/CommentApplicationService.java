package com.jsy.site.modules.content.application;

import com.jsy.site.modules.content.domain.model.Comment;
import com.jsy.site.modules.content.domain.repository.CommentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class CommentApplicationService {

    private final CommentRepository commentRepository;

    public CommentApplicationService(CommentRepository commentRepository) {
        this.commentRepository = commentRepository;
    }

    public List<Comment> listByNote(String noteId) {
        return commentRepository.findByNoteIdOrderByCreatedAtAsc(noteId);
    }

    public Comment create(String noteId, String nickname, String content) {
        Comment comment = new Comment(UUID.randomUUID().toString(), noteId, nickname, content, LocalDateTime.now());
        commentRepository.save(comment);
        return comment;
    }

    public void delete(String id) {
        commentRepository.deleteById(id);
    }
}
