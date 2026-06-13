package com.jsy.site.modules.content.infrastructure.persistence.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NoteJpaRepository extends JpaRepository<NoteEntity, String> {
    List<NoteEntity> findAllByOrderByCreatedAtDesc();
}
