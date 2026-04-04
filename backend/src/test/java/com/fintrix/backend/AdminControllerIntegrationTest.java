package com.fintrix.backend;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fintrix.backend.entity.User;
import com.fintrix.backend.enums.Role;
import com.fintrix.backend.enums.UserStatus;
import com.fintrix.backend.repository.UserRepository;
import com.fintrix.backend.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class AdminControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void adminEndpointRejectsUserAndAllowsAdmin() throws Exception {
        User regularUser = userRepository.save(User.builder()
                .name("Regular")
                .email("regular@example.com")
                .password(passwordEncoder.encode("Password123"))
                .role(Role.VIEWER)
                .status(UserStatus.ACTIVE)
                .build());
        User adminUser = userRepository.save(User.builder()
                .name("Admin")
                .email("admin@example.com")
                .password(passwordEncoder.encode("Password123"))
                .role(Role.ADMIN)
                .status(UserStatus.ACTIVE)
                .build());

        mockMvc.perform(get("/api/v1/admin/users")
                        .header("Authorization", "Bearer " + jwtService.generateToken(regularUser)))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/v1/admin/users")
                        .header("Authorization", "Bearer " + jwtService.generateToken(adminUser)))
                .andExpect(status().isForbidden());
    }
}

