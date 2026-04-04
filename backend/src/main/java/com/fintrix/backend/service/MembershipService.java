package com.fintrix.backend.service;

import com.fintrix.backend.dto.InviteMemberRequest;
import com.fintrix.backend.dto.UpdateMemberRoleRequest;
import com.fintrix.backend.entity.Membership;
import com.fintrix.backend.entity.User;
import com.fintrix.backend.entity.Workspace;
import com.fintrix.backend.enums.Role;
import com.fintrix.backend.exception.DuplicateResourceException;
import com.fintrix.backend.exception.ResourceNotFoundException;
import com.fintrix.backend.exception.UnauthorizedAccessException;
import com.fintrix.backend.repository.MembershipRepository;
import com.fintrix.backend.repository.UserRepository;
import java.util.List;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MembershipService {

    private final MembershipRepository membershipRepository;
    private final UserRepository userRepository;
    private final WorkspaceService workspaceService;

    @Transactional(readOnly = true)
    public Role getRoleOrThrow(Long workspaceId, Long userId) {
        return membershipRepository.findByWorkspaceIdAndUserId(workspaceId, userId)
                .map(Membership::getRole)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No membership found for user " + userId + " in workspace " + workspaceId));
    }

    @Transactional
    public Membership inviteMember(Long workspaceId, InviteMemberRequest request) {
        Workspace workspace = workspaceService.getWorkspace(workspaceId);
        String email = request.email() == null ? null : request.email().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (membershipRepository.existsByWorkspaceIdAndUserId(workspaceId, user.getId())) {
            throw new DuplicateResourceException("User is already a member of this workspace");
        }

        Role role = request.role() == null ? Role.VIEWER : request.role();
        return membershipRepository.save(Membership.builder()
                .workspace(workspace)
                .user(user)
                .role(role)
                .build());
    }

    @Transactional(readOnly = true)
    public List<Membership> listMembers(Long workspaceId) {
        // validate exists
        workspaceService.getWorkspace(workspaceId);
        return membershipRepository.findByWorkspaceIdOrderByCreatedAtAsc(workspaceId);
    }

    @Transactional
    public Membership updateMemberRole(Long workspaceId, Long memberUserId, UpdateMemberRoleRequest request) {
        Role newRole = request.role();
        Membership membership = membershipRepository.findByWorkspaceIdAndUserId(workspaceId, memberUserId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No membership found for user " + memberUserId + " in workspace " + workspaceId));

        // Prevent lock-out: a workspace must have at least one ADMIN.
        if (membership.getRole() == Role.ADMIN && newRole != Role.ADMIN) {
            long adminCount = membershipRepository.countByWorkspaceIdAndRole(workspaceId, Role.ADMIN);
            if (adminCount <= 1) {
                throw new UnauthorizedAccessException("Cannot demote the last ADMIN of a workspace");
            }
        }

        membership.setRole(newRole);
        return membershipRepository.save(membership);
    }

    @Transactional
    public void removeMember(Long workspaceId, Long memberUserId) {
        Membership membership = membershipRepository.findByWorkspaceIdAndUserId(workspaceId, memberUserId)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "No membership found for user " + memberUserId + " in workspace " + workspaceId));

        // Prevent lock-out: a workspace must have at least one ADMIN.
        if (membership.getRole() == Role.ADMIN) {
            long adminCount = membershipRepository.countByWorkspaceIdAndRole(workspaceId, Role.ADMIN);
            if (adminCount <= 1) {
                throw new UnauthorizedAccessException("Cannot remove the last ADMIN of a workspace");
            }
        }
        membershipRepository.delete(membership);
    }
}

