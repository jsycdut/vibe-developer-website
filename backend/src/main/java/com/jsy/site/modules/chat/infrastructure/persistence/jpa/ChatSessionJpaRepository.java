package com.jsy.site.modules.chat.infrastructure.persistence.jpa;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChatSessionJpaRepository extends JpaRepository<ChatSessionEntity, String> {
    List<ChatSessionEntity> findAllByOrderByLastMessageAtDesc();
}
