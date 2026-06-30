package com.jsy.site.modules.content.infrastructure.parser;

import com.jsy.site.modules.content.domain.model.Article;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class OrgFileParserService {

    private static final String TITLE_MARK = "** ";
    private static final String SLUG_MARK = "SLUG";
    private static final String RELEASE_DATE_MARK = "RELEASE_DATE";

    private static final String DEFAULT_AUTHOR = "jsy";
    @Value("${site.blog-file}")
    private String DEFAULT_BLOG_FILEPATH;

    public List<Article> parse() throws IOException {
        List<String> lines = readLines(DEFAULT_BLOG_FILEPATH);
        List<List<String>> rawArticles = splitIntoArticles(lines);
        List<Article> result = new ArrayList<>();
        for (List<String> rawArticle : rawArticles) {
            Article article = parseArticle(rawArticle);
            if (article != null) {
                System.out.println(article);
                result.add(article);
            }
        }
        return result;
    }

    private List<String> readLines(String filePath) throws IOException {
        List<String> lines = new ArrayList<>();
        try (BufferedReader bufferedReader = new BufferedReader(new FileReader(filePath))) {
            String line;
            while ((line = bufferedReader.readLine()) != null) {
                lines.add(line);
            }
        }
        return lines;
    }

    private List<List<String>> splitIntoArticles(List<String> lines) {
        List<Integer> titleLineIndices = new ArrayList<>();
        for (int lineIndex = 0; lineIndex < lines.size(); lineIndex++) {
            if (lines.get(lineIndex).startsWith(TITLE_MARK)) {
                titleLineIndices.add(lineIndex);
            }
        }

        if (titleLineIndices.isEmpty()) {
            return new ArrayList<>();
        }

        List<List<String>> rawArticles = new ArrayList<>();
        for (int i = 1; i < titleLineIndices.size(); i++) {
            rawArticles.add(new ArrayList<>(lines.subList(titleLineIndices.get(i - 1), titleLineIndices.get(i))));
        }
        rawArticles.add(new ArrayList<>(lines.subList(titleLineIndices.get(titleLineIndices.size() - 1), lines.size())));
        return rawArticles;
    }

    private Article parseArticle(List<String> rawLines) {
        String title = stripTitle(rawLines);
        Map<String, String> properties = stripProperties(rawLines);
        if (!properties.containsKey(SLUG_MARK)) {
            return null;
        }
        String body = String.join(System.lineSeparator(), rawLines);
        return Article.builder()
                .title(title)
                .author(DEFAULT_AUTHOR)
                .slug(properties.get(SLUG_MARK))
                .releaseDate(properties.get(RELEASE_DATE_MARK))
                .content(body)
                .build();
    }

    private Map<String, String> stripProperties(List<String> rawLines) {
        StringBuilder propertyStr = new StringBuilder();
        String line;
        while (!rawLines.isEmpty() && (line = rawLines.get(0)).matches("^:\\w+:.*")) {
            propertyStr.append(line).append(System.lineSeparator());
            rawLines.remove(0);
        }

        Map<String, String> properties = new HashMap<>();
        Pattern pattern = Pattern.compile(":(\\w+):\\s*([^:\\s]\\S+)");
        Matcher matcher = pattern.matcher(propertyStr.toString());
        while (matcher.find()) {
            String key = matcher.group(1).toUpperCase();
            String value = matcher.group(2).strip();
            properties.put(key.toUpperCase(), value);
        }

        return properties;
    }

    private String stripTitle(List<String> rawLines) {
        String titleLine = rawLines.remove(0);
        return titleLine.replace("*", "")
                .replace("TODO", "")
                .replace("DONE", "")
                .trim();
    }
}