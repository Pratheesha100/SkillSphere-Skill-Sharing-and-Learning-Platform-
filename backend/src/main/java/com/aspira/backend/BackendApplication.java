package com.aspira.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import io.github.cdimascio.dotenv.Dotenv;
import java.util.Arrays;
import java.util.List;

@SpringBootApplication
@EnableScheduling
public class BackendApplication {

	public static void main(String[] args) {
<<<<<<< Updated upstream
		 // Load .env
		 Dotenv dotenv = Dotenv.configure().load();
		  // Set system properties for Spring Boot to use
		  String dbUrl = dotenv.get("DB_URL");
		  String dbUsername = dotenv.get("DB_USERNAME");
		  String dbPassword = dotenv.get("DB_PASSWORD");
		  String jwtSecret = dotenv.get("JWT_SECRET");

		  if (dbUrl != null) System.setProperty("DB_URL", dbUrl);
		  else System.out.println("DB_URL is not set in .env");

		  if (dbUsername != null) System.setProperty("DB_USERNAME", dbUsername);
		  else System.out.println("DB_USERNAME is not set in .env");

		  if (dbPassword != null) System.setProperty("DB_PASSWORD", dbPassword);
		  else System.out.println("DB_PASSWORD is not set in .env");

		  if (jwtSecret != null) System.setProperty("JWT_SECRET", jwtSecret);
		  else System.out.println("JWT_SECRET is not set in .env");
=======
		try {
			// Load .env file
			Dotenv dotenv = Dotenv.configure()
					.ignoreIfMissing()
					.load();
>>>>>>> Stashed changes

			// List of required environment variables
			List<String> requiredEnvVars = Arrays.asList(
				"DB_URL",
				"DB_USERNAME",
				"DB_PASSWORD",
				"JWT_SECRET"
			);

			// Check if all required environment variables are present
			for (String envVar : requiredEnvVars) {
				String value = dotenv.get(envVar);
				if (value == null || value.trim().isEmpty()) {
					throw new IllegalStateException(
						String.format("Required environment variable '%s' is not set in .env file", envVar)
					);
				}
			}

			// Set system properties only if all required variables are present
			System.setProperty("DB_URL", dotenv.get("DB_URL"));
			System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
			System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
			System.setProperty("JWT_SECRET", dotenv.get("JWT_SECRET"));

			SpringApplication.run(BackendApplication.class, args);
		} catch (Exception e) {
			System.err.println("Error starting application: " + e.getMessage());
			e.printStackTrace();
			System.exit(1);
		}
	}

}
