package com.aspira.backend.service;

import com.aspira.backend.dto.GameDTO;
import com.aspira.backend.model.Game;
import com.aspira.backend.repository.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;

    public List<GameDTO> getAllGames() {
        return gameRepository.findAll()
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public GameDTO addGame(GameDTO dto) {
        Game game = new Game(
                null,
                dto.getQuestionText(),
                dto.getAnswer1(),
                dto.getAnswer2(),
                dto.getAnswer3(),
                dto.getAnswer4(),
                dto.getCorrectAnswer(),
                dto.getCategory(),
                dto.getLevel()
        );
        return convertToDTO(gameRepository.save(game));
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

    private GameDTO convertToDTO(Game game) {
        GameDTO dto = new GameDTO();
        dto.setId(game.getId());
        dto.setQuestionText(game.getQuestionText());
        dto.setAnswer1(game.getAnswer1());
        dto.setAnswer2(game.getAnswer2());
        dto.setAnswer3(game.getAnswer3());
        dto.setAnswer4(game.getAnswer4());
        dto.setCorrectAnswer(game.getCorrectAnswer());
        dto.setCategory(game.getCategory());
        dto.setLevel(game.getLevel());
        return dto;
    }
}
