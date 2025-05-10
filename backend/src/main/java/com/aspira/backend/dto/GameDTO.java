package com.aspira.backend.dto;

import lombok.Data;
import java.util.List;

@Data
public class GameDTO {
    private Long id;
    private String type; // MCQ or MEMORY_MATCH
    private String questionText;
    private String answer1;
    private String answer2;
    private String answer3;
    private String answer4;
    private String correctAnswer;
    private String category;
    private String level;

    // New fields for Memory Match Game
    private String paragraph;
    private List<String> blanks;
    private List<String> options;
    private Integer timer; // Timer in seconds
}
