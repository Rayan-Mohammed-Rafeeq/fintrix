package com.fintrix.backend;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fintrix.backend.dto.TransactionRequest;
import com.fintrix.backend.entity.Membership;
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
class TransactionControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private BorrowTransactionRepository transactionRepository;

    @Autowired
    private WorkspaceRepository workspaceRepository;

    @Autowired
    private MembershipRepository membershipRepository;

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
    void outsiderCannotMarkTransactionAsPaidButParticipantCan() throws Exception {
        User borrower = userRepository.save(User.builder()
                .name("Borrower")
                .email("borrower@example.com")
                .password(passwordEncoder.encode("Password123"))
                .role(Role.ADMIN)
                .status(UserStatus.ACTIVE)
                .build());
        User lender = userRepository.save(User.builder()
                .name("Lender")
                .email("lender@example.com")
                .password(passwordEncoder.encode("Password123"))
                .role(Role.ADMIN)
                .status(UserStatus.ACTIVE)
                .build());
        User outsider = userRepository.save(User.builder()
                .name("Outsider")
                .email("outsider@example.com")
                .password(passwordEncoder.encode("Password123"))
                .role(Role.ADMIN)
                .status(UserStatus.ACTIVE)
                .build());

        Workspace workspace = workspaceRepository.save(Workspace.builder()
                .name("WS")
                .ownerId(borrower.getId())
                .build());

        membershipRepository.save(Membership.builder()
                .user(borrower)
                .workspace(workspace)
                .role(Role.ADMIN)
                .build());
        membershipRepository.save(Membership.builder()
                .user(lender)
                .workspace(workspace)
                .role(Role.ADMIN)
                .build());

        String borrowerToken = jwtService.generateToken(borrower);
        String lenderToken = jwtService.generateToken(lender);
        String outsiderToken = jwtService.generateToken(outsider);

        TransactionRequest request = new TransactionRequest(
                lender.getEmail(),
                new java.math.BigDecimal("500.00"),
                "Short-term loan",
                java.time.LocalDate.now());

        String response = mockMvc.perform(post("/api/v1/workspaces/{workspaceId}/transactions/borrow", workspace.getId())
                        .header("Authorization", "Bearer " + borrowerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.borrowerId").value(borrower.getId()))
                .andExpect(jsonPath("$.lenderId").value(lender.getId()))
                .andExpect(jsonPath("$.status").value("PENDING"))
                .andReturn()
                .getResponse()
                .getContentAsString();

        Long transactionId = objectMapper.readTree(response).get("id").asLong();

        mockMvc.perform(put("/api/v1/workspaces/{workspaceId}/transactions/{id}/pay", workspace.getId(), transactionId)
                        .header("Authorization", "Bearer " + outsiderToken))
                .andExpect(status().isNotFound());

        mockMvc.perform(put("/api/v1/workspaces/{workspaceId}/transactions/{id}/pay", workspace.getId(), transactionId)
                        .header("Authorization", "Bearer " + lenderToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PAID"));
    }
}

