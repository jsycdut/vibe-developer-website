package com.jsy.site.modules.content.application;

import com.jsy.site.modules.content.domain.model.Article;
import com.jsy.site.modules.content.domain.repository.ArticleRepository;
import com.jsy.site.modules.content.infrastructure.parser.OrgFileParserService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ArticleApplicationService {
    private final ArticleRepository articleRepository;
    private final OrgFileParserService orgParser;

    public ArticleApplicationService(ArticleRepository articleRepository, OrgFileParserService parser) {
        this.articleRepository = articleRepository;
        this.orgParser = parser;
    }

    @Scheduled(cron = "59 59 23 * * ?")
    public void refresh() throws IOException {
        List<Article> articles = orgParser.parse();
        for (Article article : articles) {
            articleRepository.refresh(article);
        }

    }

    public List<Article> articleList(int page, int size) {
        return articleRepository.list(page, size);
    }

    public long articleCount() {
        return articleRepository.count();
    }

    public Article getArticle(String slug) throws IOException, InterruptedException {
        Article article = articleRepository.query(slug);
        article.setContent(convertToHtml(normalizeLanguage(article.getContent())));
        return article;
    }

    private String normalizeLanguage(String content) {
        return content.replaceAll("(?i)#\\+BEGIN_SRC\\s+elisp", "#+BEGIN_SRC commonlisp");
    }

    private String convertToHtml(String content) throws IOException, InterruptedException {
        ProcessBuilder processBuilder = new ProcessBuilder("pandoc", "-f", "org", "-t", "html5", "--syntax-highlighting=pygments");
        Process process = processBuilder.start();
        try(OutputStream os = process.getOutputStream()) {
           os.write(content.getBytes(StandardCharsets.UTF_8));
           os.flush();
        }

        String result;
        try(BufferedReader reader=new BufferedReader(new InputStreamReader(process.getInputStream(),StandardCharsets.UTF_8))) {
            result= reader.lines().collect(Collectors.joining(System.lineSeparator()));
        }

        int exitCode = process.waitFor();
        if (exitCode != 0) {
            try(BufferedReader reader = new BufferedReader(new InputStreamReader(process.getErrorStream(), StandardCharsets.UTF_8))) {
                System.err.println(reader.lines().collect(Collectors.joining(System.lineSeparator())));
            }
        }

        return result;
    }
}
