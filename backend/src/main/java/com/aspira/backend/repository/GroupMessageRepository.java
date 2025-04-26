package com.aspira.backend.repository;

import com.aspira.backend.model.GroupMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupMessageRepository extends JpaRepository<GroupMessage, Long> {
    List<GroupMessage> findByGroup_GroupIdOrderBySentAtAsc(Long groupId);
} 