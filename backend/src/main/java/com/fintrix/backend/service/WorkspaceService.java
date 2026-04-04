package com.fintrix.backend.service;

import com.fintrix.backend.dto.WorkspaceResponse;
import com.fintrix.backend.entity.Membership;
import com.fintrix.backend.entity.User;
import com.fintrix.backend.entity.Workspace;
import com.fintrix.backend.enums.Role;
import com.fintrix.backend.exception.ResourceNotFoundException;
import com.fintrix.backend.repository.MembershipRepository;
import com.fintrix.backend.repository.WorkspaceRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class WorkspaceService {

    private final WorkspaceRepository workspaceRepository;
    private final MembershipRepository membershipRepository;
    private final UserService userService;

    /**
     * Creates a workspace and makes the creator an ADMIN member.
     */
    @Transactional
    public Workspace createWorkspaceFor(User owner, String name) {
        Workspace workspace = workspaceRepository.save(Workspace.builder()
                .name(name)
                .ownerId(owner.getId())
                .build());

        membershipRepository.save(Membership.builder()
                .user(owner)
                .workspace(workspace)
                .role(Role.ADMIN)
                .build());

        return workspace;
    }

    /**
     * Creates a workspace on behalf of the authenticated user.
     */
    @Transactional
    public WorkspaceResponse createWorkspace(Authentication authentication, String name) {
        User currentUser = userService.getCurrentUser(authentication);
        String trimmed = name == null ? null : name.trim();
        if (trimmed == null || trimmed.isBlank()) {
            throw new IllegalArgumentException("Workspace name is required");
        }

        Workspace workspace = createWorkspaceFor(currentUser, trimmed);
        return new WorkspaceResponse(workspace.getId(), workspace.getName(), workspace.getOwnerId());
    }

    @Transactional(readOnly = true)
    public Workspace getWorkspace(Long workspaceId) {
        return workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new ResourceNotFoundException("Workspace not found with id: " + workspaceId));
    }

    @Transactional(readOnly = true)
    public List<WorkspaceResponse> getMyWorkspaces(Authentication authentication) {
        User currentUser = userService.getCurrentUser(authentication);

        return membershipRepository.findByUserIdOrderByCreatedAtDesc(currentUser.getId())
                .stream()
                .map(m -> new WorkspaceResponse(
                        m.getWorkspace().getId(),
                        m.getWorkspace().getName(),
                        m.getWorkspace().getOwnerId()))
                .toList();
    }
}

