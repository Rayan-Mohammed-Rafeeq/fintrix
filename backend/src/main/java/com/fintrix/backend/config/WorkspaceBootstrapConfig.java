package com.fintrix.backend.config;

import com.fintrix.backend.entity.User;
import com.fintrix.backend.enums.Role;
import com.fintrix.backend.repository.MembershipRepository;
import com.fintrix.backend.repository.UserRepository;
import com.fintrix.backend.service.WorkspaceService;
import java.util.List;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.Transactional;

/**
 * Beginner-friendly migration/bootstrap:
 * ensures every existing user has a personal workspace + ADMIN membership.
 *
 * This is helpful if you previously created users before the workspace model existed.
 */
@Configuration
@Profile("!test")
@RequiredArgsConstructor
@Slf4j
public class WorkspaceBootstrapConfig {

    private final UserRepository userRepository;
    private final MembershipRepository membershipRepository;
    private final WorkspaceService workspaceService;

    @Bean
    ApplicationRunner ensureUsersHaveWorkspaces() {
        return args -> bootstrap();
    }

    @Transactional
    void bootstrap() {
        List<User> users = userRepository.findAll();
        int created = 0;

        for (User user : users) {
            boolean hasWorkspace = !membershipRepository.findByUserIdOrderByCreatedAtDesc(user.getId()).isEmpty();
            if (!hasWorkspace) {
                workspaceService.createWorkspaceFor(user, user.getName().trim() + "'s Workspace");
                created++;
                log.info("Created personal workspace for userId={} email={}", user.getId(), user.getEmail());
            }

            // Keep legacy global role aligned for existing UI flows.
            if (user.getRole() != Role.ADMIN) {
                user.setRole(Role.ADMIN);
                userRepository.save(user);
            }
        }

        if (created > 0) {
            log.info("Workspace bootstrap complete: created {} workspace(s)", created);
        }
    }
}

