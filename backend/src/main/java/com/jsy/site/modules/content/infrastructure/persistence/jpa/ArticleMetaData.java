package com.jsy.site.modules.content.infrastructure.persistence.jpa;

public interface ArticleMetaData {
    String getSlug();
    String getTitle();
    String getAuthor();
    String getAbstraction();
    String getReleaseDate();
}
