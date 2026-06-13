package com.jsy.site.modules.content.application;

import com.jsy.site.modules.content.domain.model.Note;
import com.jsy.site.modules.content.domain.repository.NoteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class NoteApplicationService {

    private final NoteRepository noteRepository;

    public NoteApplicationService(NoteRepository noteRepository) {
        this.noteRepository = noteRepository;
    }

    public List<Note> listAll() {
        return noteRepository.findAllOrderByCreatedAtDesc();
    }

    public Note getById(String id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("笔记不存在: " + id));
    }

    public Note create(String title, String content) {
        Note note = new Note(UUID.randomUUID().toString(), title, content,
                LocalDateTime.now(), LocalDateTime.now());
        noteRepository.save(note);
        return note;
    }

    public Note update(String id, String title, String content) {
        Note note = getById(id);
        note.updateContent(title, content);
        noteRepository.save(note);
        return note;
    }

    public void delete(String id) {
        noteRepository.deleteById(id);
    }
}
