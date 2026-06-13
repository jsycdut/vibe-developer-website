package com.jsy.site.modules.content.infrastructure.persistence.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommentJpaRepository extends JpaRepository<CommentEntity, String> {
    List<CommentEntity> findByNoteIdOrderByCreatedAtAsc(String noteId);
}
