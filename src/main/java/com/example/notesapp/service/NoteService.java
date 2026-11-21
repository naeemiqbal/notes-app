package com.example.notesapp.service;

import com.example.notesapp.model.Note;
import com.example.notesapp.repository.NoteRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NoteService {

    private final NoteRepository noteRepository;

    public List<Note> findAll() {
        return noteRepository.findAll();
    }

    public Note findById(Long id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Note not found with id: " + id));
    }

    public Note save(Note note) {
        return noteRepository.save(note);
    }

    public void deleteById(Long id) {
        noteRepository.deleteById(id);
    }
}
