package com.example.notesapp.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Entity
@Table(name = "notes")
@Getter
@Setter
@NoArgsConstructor
public class Note {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Note content cannot be empty")
    @Size(max = 500, message = "Note cannot exceed 500 characters")
    @Column(nullable = false, length = 500)
    private String note;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    @Column(nullable = false)
    private LocalDate created;

    @Column(nullable = false)
    private Boolean active = true;

    @PrePersist
    public void prePersist() {
        if (created == null) {
            created = LocalDate.now();
        }
        if (active == null) {
            active = true;
        }
    }
}
