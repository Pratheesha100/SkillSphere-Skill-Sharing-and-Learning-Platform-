package com.aspira.backend.repository;

import com.aspira.backend.model.UserGroup;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
 
public interface UserGroupRepository extends JpaRepository<UserGroup, Long> {
    List<UserGroup> findByAdmin_UserId(Long adminId);
} 