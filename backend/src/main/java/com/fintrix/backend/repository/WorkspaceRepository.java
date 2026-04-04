package com.fintrix.backend.repository;

import com.fintrix.backend.entity.Workspace;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkspaceRepository extends JpaRepository<Workspace, Long> {

    List<Workspace> findByOwnerIdOrderByCreatedAtDesc(Long ownerId);
}

