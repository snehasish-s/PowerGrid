package com.tpcodl.powerpulse;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * PowerPulse AI — Smart Utility Asset Intelligence Platform
 * 
 * Main entry point for the Spring Boot 3 backend service.
 * Serves REST APIs for asset management, fault tracking,
 * predictive maintenance, and outage monitoring across
 * TPCODL (Tata Power Central Odisha Distribution Limited) zones.
 * 
 * @author TPCODL Intern — PowerPulse AI Team
 * @version 1.0.0
 */
@SpringBootApplication
public class PowerPulseApplication {

    public static void main(String[] args) {
        SpringApplication.run(PowerPulseApplication.class, args);
    }
}
