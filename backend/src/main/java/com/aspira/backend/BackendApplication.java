package com.aspira.backend;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import io.github.cdimascio.dotenv.Dotenv;

@SpringBootApplication
@EnableScheduling
public class BackendApplication {

	public static void main(String[] args) {
		 // Load .env
		 Dotenv dotenv = Dotenv.configure().load();
		  // Set system properties for Spring Boot to use
		  System.setProperty("DB_URL", dotenv.get("DB_URL"));
		  System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
		  System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		  System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));

        SpringApplication.run(BackendApplication.class, args);
	}

}
