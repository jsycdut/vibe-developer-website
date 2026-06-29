package com.jsy.site.modules.content.domain.repository;

import com.jsy.site.modules.content.domain.model.Article;

import java.util.List;

public interface ArticleRepository {
    void refresh(Article article);
    List<Article> list(int page, int size);
    long count();
    Article query(String slug);
}
