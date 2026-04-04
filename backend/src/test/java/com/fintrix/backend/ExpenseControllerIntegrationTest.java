package com.fintrix.backend;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fintrix.backend.dto.ExpenseRequest;
import com.fintrix.backend.entity.Expense;
import com.fintrix.backend.entity.User;
import com.fintrix.backend.entity.Workspace;
import com.fintrix.backend.enums.Role;
import com.fintrix.backend.enums.UserStatus;
import com.fintrix.backend.repository.BorrowTransactionRepository;
import com.fintrix.backend.repository.ExpenseRepository;
import com.fintrix.backend.repository.MembershipRepository;
import com.fintrix.backend.repository.UserRepository;
import com.fintrix.backend.repository.WorkspaceRepository;
import com.fintrix.backend.security.JwtService;
import com.fintrix.backend.service.WorkspaceService;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
class ExpenseControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private WorkspaceService workspaceService;

    @Autowired
    private MembershipRepository membershipRepository;

    @Autowired
    private BorrowTransactionRepository transactionRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        transactionRepository.deleteAll();
        expenseRepository.deleteAll();
        membershipRepository.deleteAll();
        workspaceRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void authenticatedUserCanCreateAndListOwnExpense() throws Exception {
        User user = userRepository.save(User.builder()
                .name("Bob")
                .email("bob@example.com")
                .password(passwordEncoder.encode("Password123"))
                .role(Role.ADMIN)
                .status(UserStatus.ACTIVE)
                .build());

        Workspace workspace = workspaceService.createWorkspaceFor(user, "Bob's Workspace");

        String token = jwtService.generateToken(user);
        ExpenseRequest request = new ExpenseRequest("Groceries", new BigDecimal("1499.50"), "Food", LocalDate.now());

        mockMvc.perform(post("/api/v1/workspaces/{workspaceId}/expenses", workspace.getId())
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Groceries"))
                .andExpect(jsonPath("$.category").value("Food"));

        mockMvc.perform(get("/api/v1/workspaces/{workspaceId}/expenses", workspace.getId())
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Groceries"))
                .andExpect(jsonPath("$[0].userId").value(user.getId()));
    }

    @Test
    void userCannotReadAnotherUsersExpense() throws Exception {
        User owner = userRepository.save(User.builder()
                .name("Owner")
                .email("owner@example.com")
                .password(passwordEncoder.encode("Password123"))
                .role(Role.VIEWER)
                .status(UserStatus.ACTIVE)
                .build());
        User intruder = userRepository.save(User.builder()
                .name("Intruder")
                .email("intruder@example.com")
                .password(passwordEncoder.encode("Password123"))
                .role(Role.VIEWER)
                .status(UserStatus.ACTIVE)
                .build());

        Workspace ownersWorkspace = workspaceService.createWorkspaceFor(owner, "Owner's Workspace");

        Expense expense = expenseRepository.save(Expense.builder()
                .title("Rent")
                .amount(new BigDecimal("25000.00"))
                .category("Housing")
                .date(LocalDate.now())
                .user(owner)
                .workspace(ownersWorkspace)
                .build());

        String intruderToken = jwtService.generateToken(intruder);

        mockMvc.perform(get("/api/v1/workspaces/{workspaceId}/expenses/{id}", ownersWorkspace.getId(), expense.getId())
                        .header("Authorization", "Bearer " + intruderToken))
                .andExpect(status().isNotFound());
    }
}

