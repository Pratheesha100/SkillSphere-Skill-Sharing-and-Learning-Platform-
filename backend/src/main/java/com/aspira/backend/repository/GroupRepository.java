package com.aspira.backend.repository;

import com.aspira.backend.model.Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends JpaRepository<Group, Long> {
    List<Group> findByAdmin_UserId(Long adminId);
    List<Group> findByMembers_UserId(Long userId);
    boolean existsByGroupName(String groupName);
} 