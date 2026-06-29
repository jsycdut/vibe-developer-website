package com.jsy.site.modules.content.entrypoint;

import com.jsy.site.modules.content.application.ArticleApplicationService;
import com.jsy.site.modules.content.domain.model.Article;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/article")
public class ArticleController {
    private final ArticleApplicationService articleApplicationService;
    public ArticleController(ArticleApplicationService service) {
        this.articleApplicationService = service;
    }

    @GetMapping("/refresh")
    public void refresh() throws IOException {
        articleApplicationService.refresh();
    }

    @GetMapping("/list")
    public Map<String, Object> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        List<Article> articles = articleApplicationService.articleList(page, size);
        long total = articleApplicationService.articleCount();
        return Map.of("content", articles, "total", total, "page", page, "size", size);
    }

    @GetMapping("/detail/{slug}")
    public Article articleContent(@PathVariable("slug")  String slug) throws IOException, InterruptedException {
        return articleApplicationService.getArticle(slug);
    }
}
