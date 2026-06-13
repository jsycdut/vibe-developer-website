package com.jsy.site.modules.content.infrastructure.persistence.jpa;

import com.jsy.site.modules.content.domain.model.Comment;
import com.jsy.site.modules.content.domain.repository.CommentRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@ConditionalOnProperty(name = "site.orm-type", havingValue = "jpa", matchIfMissing = true)
public class CommentRepositoryImpl implements CommentRepository {

    private final CommentJpaRepository jpa;

    public CommentRepositoryImpl(CommentJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public List<Comment> findByNoteIdOrderByCreatedAtAsc(String noteId) {
        return jpa.findByNoteIdOrderByCreatedAtAsc(noteId).stream().map(this::toDomain).toList();
    }

    @Override
    public void save(Comment comment) {
        jpa.save(toEntity(comment));
    }

    @Override
    public void deleteById(String id) {
        jpa.deleteById(id);
    }

    private Comment toDomain(CommentEntity e) {
        return new Comment(e.getId(), e.getNoteId(), e.getNickname(), e.getContent(), e.getCreatedAt());
    }

    private CommentEntity toEntity(Comment c) {
        CommentEntity e = new CommentEntity();
        e.setId(c.getId());
        e.setNoteId(c.getNoteId());
        e.setNickname(c.getNickname());
        e.setContent(c.getContent());
        e.setCreatedAt(c.getCreatedAt());
        return e;
    }
}
