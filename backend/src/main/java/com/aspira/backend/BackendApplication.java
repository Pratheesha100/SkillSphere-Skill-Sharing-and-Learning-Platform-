package com.aspira.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

	public static void main(String[] args) {
		 // Load .env
		 Dotenv dotenv = Dotenv.configure().load();
		  // Set system properties for Spring Boot to use
		  System.setProperty("DB_URL", dotenv.get("DB_URL"));
		  System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
		  System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		  
		SpringApplication.run(BackendApplication.class, args);
	}

}
