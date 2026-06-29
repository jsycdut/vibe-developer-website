package com.jsy.site.modules.content.infrastructure.persistence.jpa;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ArticleJpaRepository extends JpaRepository<ArticleEntity, String> {
    <T> Page<T> findAllBy(Class<T> type, Pageable pageable);
    ArticleEntity findBySlug(String slug);
}
