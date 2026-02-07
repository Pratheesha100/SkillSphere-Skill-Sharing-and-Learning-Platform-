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
		  if (dotenv.get("DB_URL") != null) {
		      System.setProperty("DB_URL", dotenv.get("DB_URL"));
		  } else {
		      throw new IllegalArgumentException("DB_URL is not set in the .env file");
		  }

		  if (dotenv.get("DB_USERNAME") != null) {
		      System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
		  } else {
		      throw new IllegalArgumentException("DB_USERNAME is not set in the .env file");
		  }

		  if (dotenv.get("DB_PASSWORD") != null) {
		      System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		  } else {
		      throw new IllegalArgumentException("DB_PASSWORD is not set in the .env file");
		  }

		  if (dotenv.get("JWT_SECRET") != null) {
		      System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));
		  } else {
		      throw new IllegalArgumentException("JWT_SECRET is not set in the .env file");
		  }

        SpringApplication.run(BackendApplication.class, args);
	}

}
