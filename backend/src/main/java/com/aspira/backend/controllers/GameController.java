package com.aspira.backend.controllers;

import com.aspira.backend.dto.GameDTO;
import com.aspira.backend.service.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/games")
@CrossOrigin(origins = "http://localhost:5173")
public class GameController {

    private static final Logger logger = LoggerFactory.getLogger(GameController.class);

    @Autowired
    private GameService gameService;

    @GetMapping
    public List<GameDTO> getAllGames() {
        return gameService.getAllGames();
    }

    @GetMapping("/{id}")
    public ResponseEntity<GameDTO> getGame(@PathVariable Long id) {
        GameDTO game = gameService.getGameById(id);
        if (game == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(game);
    }

    @PostMapping
    public ResponseEntity<GameDTO> addGame(@RequestBody GameDTO dto) {
        try {
            logger.info("Received game DTO: {}", dto);
            GameDTO savedGame = gameService.addGame(dto);
            return ResponseEntity.ok(savedGame);
        } catch (Exception e) {
            logger.error("Error adding game: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/memory-match")
    public ResponseEntity<?> addMemoryMatchGame(@RequestBody GameDTO dto) {
        try {
            logger.info("Received memory match game DTO: {}", dto);
            
            // Validate required fields
            if (dto == null) {
                return ResponseEntity.badRequest().body("Game data cannot be null");
            }
            
            if (dto.getParagraph() == null || dto.getParagraph().trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Paragraph cannot be empty");
            }
            
            if (dto.getOptions() == null || dto.getOptions().isEmpty()) {
                return ResponseEntity.badRequest().body("Options cannot be empty");
            }
            
            GameDTO savedGame = gameService.addMemoryMatchGame(dto);
            return ResponseEntity.ok(savedGame);
        } catch (Exception e) {
            logger.error("Error adding memory match game: ", e);
            return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new HashMap<String, String>() {{
                    put("error", e.getMessage());
                    put("details", e.toString());
                }});
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<GameDTO> updateGame(@PathVariable Long id, @RequestBody GameDTO dto) {
        try {
            GameDTO updated = gameService.updateGame(id, dto);
            if (updated == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            logger.error("Error updating game: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PutMapping("/memory-match/{id}")
    public ResponseEntity<GameDTO> updateMemoryMatchGame(@PathVariable Long id, @RequestBody GameDTO dto) {
        try {
            GameDTO updated = gameService.updateMemoryMatchGame(id, dto);
            if (updated == null) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            logger.error("Error updating memory match game: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable Long id) {
        try {
            gameService.deleteGame(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting game: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/results")
    public ResponseEntity<?> submitGameResults(@RequestBody Map<String, Object> results) {
        try {
            logger.info("Received game results: {}", results);
            // TODO: Add logic to store results in the database
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            logger.error("Error submitting game results: ", e);
            return ResponseEntity.internalServerError().build();
        }
    }
}
