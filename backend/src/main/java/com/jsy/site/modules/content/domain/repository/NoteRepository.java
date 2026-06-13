package com.jsy.site.modules.content.domain.repository;

import com.jsy.site.modules.content.domain.model.Note;
import java.util.List;
import java.util.Optional;

public interface NoteRepository {
    List<Note> findAllOrderByCreatedAtDesc();
    Optional<Note> findById(String id);
    void save(Note note);
    void deleteById(String id);
}
