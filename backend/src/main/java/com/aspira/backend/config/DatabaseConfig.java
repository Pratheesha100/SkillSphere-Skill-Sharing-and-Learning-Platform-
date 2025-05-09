package com.aspira.backend.config;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DriverManagerDataSource;

import javax.sql.DataSource;
import java.sql.SQLException;
//import org.springframework.beans.factory.annotation.Autowired;

@Configuration
public class DatabaseConfig {
   // @Autowired
   // public DataSource dataSource;  

    @Bean
    public DataSource dataSource() {
        HikariConfig config = new HikariConfig();
        config.setDriverClassName("org.postgresql.Driver");
        config.setJdbcUrl(System.getProperty("DB_URL"));
        config.setUsername(System.getProperty("DB_USERNAME"));
        config.setPassword(System.getProperty("DB_PASSWORD"));
        
        // Connection pool settings
        config.setMaximumPoolSize(10);
        config.setMinimumIdle(5);
        config.setIdleTimeout(300000);
        config.setConnectionTimeout(20000);
        config.setMaxLifetime(1200000);
        
        try {
            return new HikariDataSource(config);
        } catch (Exception e) {
            throw new RuntimeException("Failed to initialize database connection", e);
        }
    }

    @Bean
    public JdbcTemplate jdbcTemplate(DataSource dataSource) {
        return new JdbcTemplate(dataSource);
    }
    
}
