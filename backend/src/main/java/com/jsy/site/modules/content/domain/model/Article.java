package com.jsy.site.modules.content.domain.model;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Builder
@Getter
@ToString
public class Article {
    private String author;
    private String slug;
    private String title;
    private String releaseDate;
    @Setter
    private String content;
    private String abstraction;
}
