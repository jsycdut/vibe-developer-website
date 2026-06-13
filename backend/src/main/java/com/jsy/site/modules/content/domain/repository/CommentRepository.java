package com.jsy.site.modules.content.domain.repository;

import com.jsy.site.modules.content.domain.model.Comment;
import java.util.List;

public interface CommentRepository {
    List<Comment> findByNoteIdOrderByCreatedAtAsc(String noteId);
    void save(Comment comment);
    void deleteById(String id);
}
