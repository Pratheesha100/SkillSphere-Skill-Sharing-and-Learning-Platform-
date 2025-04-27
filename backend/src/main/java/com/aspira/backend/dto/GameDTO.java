package com.aspira.backend.dto;

import lombok.Data;

@Data
public class GameDTO {
    private Long id;
    private String questionText;
    private String answer1;
    private String answer2;
    private String answer3;
    private String answer4;
    private String correctAnswer;
    private String category;
    private String level;
}
