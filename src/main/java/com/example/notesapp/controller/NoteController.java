package com.example.notesapp.controller;

import com.example.notesapp.model.Note;
import com.example.notesapp.service.NoteService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/notes")
@RequiredArgsConstructor
public class NoteController {

    private final NoteService noteService;

    // List all notes
    @GetMapping
    public String list(Model model) {
        model.addAttribute("notes", noteService.findAll());
        return "notes/list";
    }

    // Show create form
    @GetMapping("/new")
    public String showCreateForm(Model model) {
        model.addAttribute("noteForm", new Note());
        return "notes/form";
    }

    // Handle create submission
    @PostMapping("/new")
    public String create(@Valid @ModelAttribute("noteForm") Note noteForm,
                         BindingResult result,
                         RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            return "notes/form";
        }
        noteService.save(noteForm);
        redirectAttributes.addFlashAttribute("successMessage", "Note created successfully!");
        return "redirect:/notes";
    }

    // Show edit form
    @GetMapping("/edit/{id}")
    public String showEditForm(@PathVariable Long id, Model model) {
        model.addAttribute("noteForm", noteService.findById(id));
        return "notes/form";
    }

    // Handle edit submission
    @PostMapping("/edit/{id}")
    public String update(@PathVariable Long id,
                         @Valid @ModelAttribute("noteForm") Note noteForm,
                         BindingResult result,
                         RedirectAttributes redirectAttributes) {
        if (result.hasErrors()) {
            return "notes/form";
        }
        noteForm.setId(id);
        noteService.save(noteForm);
        redirectAttributes.addFlashAttribute("successMessage", "Note updated successfully!");
        return "redirect:/notes";
    }

    // Delete a note
    @PostMapping("/delete/{id}")
    public String delete(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        noteService.deleteById(id);
        redirectAttributes.addFlashAttribute("successMessage", "Note deleted successfully!");
        return "redirect:/notes";
    }
}
