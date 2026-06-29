package com.jsy.site.modules.content.infrastructure.persistence.jpa;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name="article")
@Data
public class ArticleEntity {
    @Id
    private String slug;

    @Column
    private String author;

    @Column
    private String title;

    @Column(nullable = true)
    private String abstraction;

    @Column
    private String content;

    @Column(columnDefinition="TEXT")
    private String releaseDate;

    @Column(columnDefinition="INTEGER")
    private Integer viewCount;
}