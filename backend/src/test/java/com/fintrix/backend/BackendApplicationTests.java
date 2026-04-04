package com.fintrix.backend;

import com.fintrix.backend.service.TestEmailConfig;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;

@SpringBootTest
@Import(TestEmailConfig.class)
class BackendApplicationTests {

    @Test
    void contextLoads() {
    }
}
