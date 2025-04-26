package com.aspira.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest(classes = {BackendApplication.class})
@ActiveProfiles("test")
@TestPropertySource(locations = "classpath:application-test.properties")
class BackendApplicationTests {

	@Test
	void contextLoads() {
		// This test will verify that the application context loads successfully
	}

}
