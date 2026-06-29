package com.jsy.site.modules.content.infrastructure.persistence.mapstruct;

import com.jsy.site.modules.content.domain.model.Article;
import com.jsy.site.modules.content.infrastructure.persistence.jpa.ArticleEntity;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;


@Mapper
public interface ArticleMapper {
    ArticleMapper INSTANCE = Mappers.getMapper(ArticleMapper.class);

    Article toDomain(ArticleEntity entity);

    ArticleEntity toEntity(Article article);
}
