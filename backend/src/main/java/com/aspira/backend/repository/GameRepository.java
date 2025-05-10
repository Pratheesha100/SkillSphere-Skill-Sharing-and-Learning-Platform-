package com.aspira.backend.repository;

import com.aspira.backend.model.Game;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GameRepository extends JpaRepository<Game, Long> {
    // No additional methods are defined to avoid repetition.
}
