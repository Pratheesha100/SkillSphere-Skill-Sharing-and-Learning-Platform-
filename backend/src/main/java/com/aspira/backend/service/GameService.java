package com.aspira.backend.service;

import com.aspira.backend.dto.GameDTO;
import com.aspira.backend.model.Game;
import com.aspira.backend.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GameService {

    private static final Logger logger = LoggerFactory.getLogger(GameService.class);

    @Autowired
    private GameRepository gameRepository;

    public List<GameDTO> getAllGames() {
        return gameRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public GameDTO addGame(GameDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Game DTO cannot be null");
        }
        
        Game game = new Game();
        
        if (dto.getType() != null && dto.getType().equals("MEMORY_MATCH")) {
            game.setType("MEMORY_MATCH");
            game.setParagraph(dto.getParagraph());
            game.setOptions(dto.getOptions() != null ? dto.getOptions() : new ArrayList<>());
            game.setBlanks(dto.getBlanks() != null ? dto.getBlanks() : new ArrayList<>());
            game.setCategory(dto.getCategory());
            game.setLevel(dto.getLevel());
            game.setTimer(dto.getTimer());
            // Set other fields to null
            game.setQuestionText(null);
            game.setAnswer1(null);
            game.setAnswer2(null);
            game.setAnswer3(null);
            game.setAnswer4(null);
            game.setCorrectAnswer(null);
        } else {
            game.setType("MCQ");
            game.setQuestionText(dto.getQuestionText());
            game.setAnswer1(dto.getAnswer1());
            game.setAnswer2(dto.getAnswer2());
            game.setAnswer3(dto.getAnswer3());
            game.setAnswer4(dto.getAnswer4());
            game.setCorrectAnswer(dto.getCorrectAnswer());
            game.setCategory(dto.getCategory());
            game.setLevel(dto.getLevel());
        }
        
        try {
            Game savedGame = gameRepository.save(game);
            return convertToDTO(savedGame);
        } catch (Exception e) {
            logger.error("Error saving game: ", e);
            throw new RuntimeException("Error saving game: " + e.getMessage());
        }
    }

    public GameDTO updateGame(Long id, GameDTO dto) {
        Optional<Game> optionalGame = gameRepository.findById(id);
        if (optionalGame.isPresent()) {
            Game game = optionalGame.get();
            game.setQuestionText(dto.getQuestionText());
            game.setAnswer1(dto.getAnswer1());
            game.setAnswer2(dto.getAnswer2());
            game.setAnswer3(dto.getAnswer3());
            game.setAnswer4(dto.getAnswer4());
            game.setCorrectAnswer(dto.getCorrectAnswer());
            game.setCategory(dto.getCategory());
            game.setLevel(dto.getLevel());
            return convertToDTO(gameRepository.save(game));
        }
        return null;
    }

    public void deleteGame(Long id) {
        gameRepository.deleteById(id);
    }

    public GameDTO getGameById(Long id) {
        return gameRepository.findById(id).map(this::convertToDTO).orElse(null);
    }

    @Transactional
    public GameDTO addMemoryMatchGame(GameDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("Game DTO cannot be null");
        }
        
        if (dto.getParagraph() == null || dto.getParagraph().trim().isEmpty()) {
            throw new IllegalArgumentException("Paragraph cannot be empty");
        }
        
        Game game = new Game();
        game.setType("MEMORY_MATCH");
        game.setParagraph(dto.getParagraph());
        
        // Initialize collections if null
        if (dto.getOptions() == null) {
            game.setOptions(new ArrayList<>());
        } else {
            game.setOptions(new ArrayList<>(dto.getOptions()));
        }
        
        if (dto.getBlanks() == null) {
            game.setBlanks(new ArrayList<>());
        } else {
            game.setBlanks(new ArrayList<>(dto.getBlanks()));
        }
        
        game.setCategory(dto.getCategory() != null ? dto.getCategory() : "General Knowledge");
        game.setLevel(dto.getLevel() != null ? dto.getLevel() : "Medium");
        game.setTimer(dto.getTimer() != null ? dto.getTimer() : 600);
        
        // Set other fields to null
        game.setQuestionText(null);
        game.setAnswer1(null);
        game.setAnswer2(null);
        game.setAnswer3(null);
        game.setAnswer4(null);
        game.setCorrectAnswer(null);
        
        try {
            Game savedGame = gameRepository.save(game);
            return convertToDTO(savedGame);
        } catch (Exception e) {
            logger.error("Error saving memory match game: ", e);
            throw new RuntimeException("Error saving memory match game: " + e.getMessage());
        }
    }

    public GameDTO updateMemoryMatchGame(Long id, GameDTO dto) {
        Optional<Game> optionalGame = gameRepository.findById(id);
        if (optionalGame.isPresent()) {
            Game game = optionalGame.get();
            game.setParagraph(dto.getParagraph());
            game.setBlanks(dto.getBlanks());
            game.setOptions(dto.getOptions());
            game.setTimer(dto.getTimer());
            return convertToDTO(gameRepository.save(game));
        }
        return null;
    }

    private GameDTO convertToDTO(Game game) {
        if (game == null) {
            return null;
        }
        
        GameDTO dto = new GameDTO();
        dto.setId(game.getId());
        dto.setType(game.getType());
        dto.setQuestionText(game.getQuestionText());
        dto.setAnswer1(game.getAnswer1());
        dto.setAnswer2(game.getAnswer2());
        dto.setAnswer3(game.getAnswer3());
        dto.setAnswer4(game.getAnswer4());
        dto.setCorrectAnswer(game.getCorrectAnswer());
        dto.setCategory(game.getCategory());
        dto.setLevel(game.getLevel());
        dto.setParagraph(game.getParagraph());
        dto.setBlanks(game.getBlanks());
        dto.setOptions(game.getOptions());
        dto.setTimer(game.getTimer());
        return dto;
    }
}
