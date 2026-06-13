package com.jsy.site.modules.content.entrypoint;

import com.jsy.site.modules.content.application.NoteApplicationService;
import com.jsy.site.modules.content.domain.model.Note;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notes")
public class NoteController {

    private final NoteApplicationService noteService;

    public NoteController(NoteApplicationService noteService) {
        this.noteService = noteService;
    }

    @GetMapping
    public List<Note> list() {
        return noteService.listAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> get(@PathVariable String id) {
        try {
            return ResponseEntity.ok(noteService.getById(id));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Note> create(@RequestBody NoteRequest request) {
        return ResponseEntity.ok(noteService.create(request.title(), request.content()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody NoteRequest request) {
        try {
            return ResponseEntity.ok(noteService.update(id, request.title(), request.content()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> delete(@PathVariable String id) {
        noteService.delete(id);
        return ResponseEntity.ok(Map.of("message", "deleted"));
    }

    public record NoteRequest(String title, String content) {}
}
