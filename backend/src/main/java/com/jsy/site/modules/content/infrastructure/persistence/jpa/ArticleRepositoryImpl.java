package com.jsy.site.modules.content.infrastructure.persistence.jpa;

import com.jsy.site.modules.content.domain.model.Article;
import com.jsy.site.modules.content.domain.repository.ArticleRepository;
import com.jsy.site.modules.content.infrastructure.persistence.mapstruct.ArticleMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class ArticleRepositoryImpl implements ArticleRepository {
    private final ArticleJpaRepository jpa;

    public ArticleRepositoryImpl(ArticleJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public void refresh(Article article) {
        ArticleEntity entity = ArticleMapper.INSTANCE.toEntity(article);
        jpa.save(entity);
    }

    @Override
    public List<Article> list(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "releaseDate"));
        Page<ArticleMetaData> pageResult = jpa.findAllBy(ArticleMetaData.class, pageable);
        return pageResult.getContent().stream()
                .map(meta -> Article.builder()
                        .slug(meta.getSlug())
                        .title(meta.getTitle())
                        .abstraction(meta.getAbstraction())
                        .releaseDate(meta.getReleaseDate())
                        .build())
                .toList();
    }

    @Override
    public long count() {
        return jpa.count();
    }

    @Override
    public Article query(String slug) {
        ArticleEntity bySlug = jpa.findBySlug(slug);
        return ArticleMapper.INSTANCE.toDomain(bySlug);
    }
}