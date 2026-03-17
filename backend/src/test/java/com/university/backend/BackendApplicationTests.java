package com.university.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
class BackendApplicationTests {

	// Default test. Ensures proper loading of reosources.
	@Test
	void contextLoads() {
	}

}
