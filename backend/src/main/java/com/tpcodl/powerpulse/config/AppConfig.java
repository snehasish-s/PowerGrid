package com.tpcodl.powerpulse.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

/**
 * Application-wide bean configuration.
 * 
 * Provides:
 *   - RestTemplate for calling the Python ML service
 */
@Configuration
public class AppConfig {

    @Value("${app.ml-service.url}")
    private String mlServiceUrl;

    /**
     * RestTemplate bean for HTTP calls to external services (FastAPI ML service).
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
