package com.aspira.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = true)
    private String type; // MCQ or MEMORY_MATCH

    @Column(nullable = true)
    private String questionText;

    @Column(nullable = true)
    private String answer1;

    @Column(nullable = true)
    private String answer2;

    @Column(nullable = true)
    private String answer3;

    @Column(nullable = true)
    private String answer4;

    @Column(nullable = true)
    private String correctAnswer;

    @Column(nullable = true)
    private String category;  // (ICT / Math / Science / General Knowledge)

    @Column(nullable = true)
    private String level;     // (Easy / Medium / Hard)

    // New fields for Memory Match Game
    @Column(nullable = true, columnDefinition = "TEXT")
    private String paragraph;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "game_blanks", joinColumns = @JoinColumn(name = "game_id"))
    @Column(name = "blank", nullable = true)
    private List<String> blanks = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "game_options", joinColumns = @JoinColumn(name = "game_id"))
    @Column(name = "option", nullable = true)
    private List<String> options = new ArrayList<>();

    @Column(nullable = true)
    private Integer timer; // Timer in seconds
}
