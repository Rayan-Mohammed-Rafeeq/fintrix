package com.fintrix.backend.repository;

import com.fintrix.backend.entity.Membership;
import com.fintrix.backend.enums.Role;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {

    Optional<Membership> findByWorkspaceIdAndUserId(Long workspaceId, Long userId);

    List<Membership> findByWorkspaceIdOrderByCreatedAtAsc(Long workspaceId);

    List<Membership> findByUserIdOrderByCreatedAtDesc(Long userId);

    boolean existsByWorkspaceIdAndUserId(Long workspaceId, Long userId);

    long countByWorkspaceIdAndRole(Long workspaceId, Role role);
}

