package com.jsy.site.modules.content.infrastructure.persistence.jpa;

import com.jsy.site.modules.content.domain.model.Note;
import com.jsy.site.modules.content.domain.repository.NoteRepository;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
@ConditionalOnProperty(name = "site.orm-type", havingValue = "jpa", matchIfMissing = true)
public class NoteRepositoryImpl implements NoteRepository {

    private final NoteJpaRepository jpa;

    public NoteRepositoryImpl(NoteJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public List<Note> findAllOrderByCreatedAtDesc() {
        return jpa.findAllByOrderByCreatedAtDesc().stream().map(this::toDomain).toList();
    }

    @Override
    public Optional<Note> findById(String id) {
        return jpa.findById(id).map(this::toDomain);
    }

    @Override
    public void save(Note note) {
        jpa.save(toEntity(note));
    }

    @Override
    public void deleteById(String id) {
        jpa.deleteById(id);
    }

    private Note toDomain(NoteEntity e) {
        return new Note(e.getId(), e.getTitle(), e.getContent(), e.getCreatedAt(), e.getUpdatedAt());
    }

    private NoteEntity toEntity(Note n) {
        NoteEntity e = new NoteEntity();
        e.setId(n.getId());
        e.setTitle(n.getTitle());
        e.setContent(n.getContent());
        e.setCreatedAt(n.getCreatedAt());
        e.setUpdatedAt(n.getUpdatedAt());
        return e;
    }
}
