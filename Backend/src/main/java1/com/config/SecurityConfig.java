package com.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;


/**
 * Security Configuration for allowing all operations and directions
 * Cors and csrf settings and access control of all endpoints
 */



@Configuration
public class SecurityConfig {

    /**
     *
     * @param http Security Object to configure all security filters
     * @return SecurityFilterChain, which includes all safety rules
     * @throws Exception if there is an error in the securityFilterChain
     */

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())  //disable csrf
                .cors(cors -> {})        // enable Cors
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()      //allow all requests to pass
                );

        return http.build();
    }

    /**
     * Setting up Cors configurations to allow Angular to send requests
     * @return CorsConfigurationSource
     */


    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));  //allow Angular port
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));  // allow all Http methods
        config.setAllowedHeaders(List.of("*")); //allow all headers
        config.setAllowCredentials(true);  //optional: allow credentials (e.g cookies)

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);  //register Cors for all paths
        return source;
    }


}
