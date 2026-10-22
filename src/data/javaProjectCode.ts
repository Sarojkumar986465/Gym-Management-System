export interface JavaSourceFile {
  path: string;
  category: 'config' | 'sql' | 'entity' | 'repository' | 'service' | 'controller' | 'dto' | 'security' | 'templates' | 'test' | 'doc';
  description: string;
  code: string;
}

export const javaProjectFiles: JavaSourceFile[] = [
  {
    path: 'pom.xml',
    category: 'config',
    description: 'Maven Project Object Model with Spring Boot 3.3, MySQL, Security & Thymeleaf',
    code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.3.4</version>
        <relativePath/>
    </parent>
    
    <groupId>com.gymtracker</groupId>
    <artifactId>gym-workout-tracker</artifactId>
    <version>1.0.0</version>
    <name>Gym Workout &amp; Tracker Management System</name>
    <description>Enterprise full-stack Gym Workout &amp; Tracker Management Platform built with Spring Boot 3, Spring Security, Spring Data JPA, MySQL 8, Thymeleaf, and Bootstrap 5</description>
    
    <properties>
        <java.version>17</java.version>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <mysql.version>8.3.0</mysql.version>
    </properties>
    
    <dependencies>
        <!-- Spring Boot Web Starter (MVC & REST) -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- Spring Boot Security Starter -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>

        <!-- Spring Data JPA & Hibernate -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>

        <!-- Thymeleaf Template Engine & Security Extras -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-thymeleaf</artifactId>
        </dependency>
        <dependency>
            <groupId>org.thymeleaf.extras</groupId>
            <artifactId>thymeleaf-extras-springsecurity6</artifactId>
        </dependency>

        <!-- MySQL Connector/J -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <scope>runtime</scope>
        </dependency>

        <!-- Jakarta Bean Validation -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>

        <!-- DevTools for Rapid Hot Reloading -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-devtools</artifactId>
            <scope>runtime</scope>
            <optional>true</optional>
        </dependency>

        <!-- Test Dependencies: JUnit 5, Mockito & Spring Security Test -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-test</artifactId>
            <scope>test</scope>
        </dependency>
        <dependency>
            <groupId>org.springframework.security</groupId>
            <artifactId>spring-security-test</artifactId>
            <scope>test</scope>
        </dependency>
        <!-- In-memory H2 Database for Isolated Unit Testing -->
        <dependency>
            <groupId>com.h2database</groupId>
            <artifactId>h2</artifactId>
            <scope>test</scope>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`,
  },
  {
    path: 'src/main/resources/application.properties.example',
    category: 'config',
    description: 'Database and environment settings template for MySQL and Server configuration',
    code: `# ===================================================================
# IronPulse Gym Tracker - Spring Boot 3 Configuration Template
# Rename this file to application.properties and customize credentials.
# ===================================================================

# Server Configuration
server.port=8080
server.servlet.context-path=/
server.error.include-message=always
server.error.include-binding-errors=always

# Database Configuration (MySQL 8)
spring.datasource.url=jdbc:mysql://localhost:3306/gym_tracker?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8
spring.datasource.username=\${DB_USERNAME:root}
spring.datasource.password=\${DB_PASSWORD:}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# Connection Pool (HikariCP)
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=3
spring.datasource.hikari.idle-timeout=30000
spring.datasource.hikari.max-lifetime=1800000

# JPA & Hibernate Settings
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.open-in-view=false

# SQL Script Initialization (Set to always or never based on needs)
spring.sql.init.mode=never
spring.sql.init.schema-locations=classpath:schema.sql
spring.sql.init.data-locations=classpath:data.sql

# Thymeleaf Template Engine Settings
spring.thymeleaf.cache=false
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html
spring.thymeleaf.mode=HTML
spring.thymeleaf.encoding=UTF-8

# File Upload Limits (for member profile pictures or workout attachments)
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=10MB

# Logging Configuration
logging.level.org.springframework.security=INFO
logging.level.com.gymtracker=DEBUG`,
  },
  {
    path: 'src/main/resources/schema.sql',
    category: 'sql',
    description: 'Complete MySQL 8 DDL schema for all 14 normalized tables, foreign keys, and indexes',
    code: `-- ===================================================================
-- IronPulse Gym Workout & Tracker Management System - MySQL 8 DDL
-- Database: gym_tracker
-- Normalization: 3NF with foreign keys, checks, indexes & cascades
-- ===================================================================

CREATE DATABASE IF NOT EXISTS gym_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gym_tracker;

-- 1. USERS TABLE (Core authentication & role)
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(25),
    role ENUM('ADMIN', 'TRAINER', 'MEMBER') NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_users_email (email),
    INDEX idx_users_role (role)
) ENGINE=InnoDB;

-- 2. MEMBER PROFILES TABLE
CREATE TABLE IF NOT EXISTS member_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    date_of_birth DATE,
    gender ENUM('MALE', 'FEMALE', 'OTHER'),
    height_cm DECIMAL(5,2),
    current_weight_kg DECIMAL(5,2),
    target_weight_kg DECIMAL(5,2),
    fitness_level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') DEFAULT 'BEGINNER',
    primary_goal ENUM('WEIGHT_LOSS', 'MUSCLE_GAIN', 'STRENGTH', 'ENDURANCE', 'GENERAL_FITNESS') DEFAULT 'GENERAL_FITNESS',
    assigned_trainer_id BIGINT,
    membership_status ENUM('ACTIVE', 'EXPIRED', 'PENDING', 'DEACTIVATED') DEFAULT 'ACTIVE',
    membership_type ENUM('STANDARD', 'PREMIUM', 'VIP') DEFAULT 'STANDARD',
    emergency_contact VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_trainer_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_member_status (membership_status),
    INDEX idx_member_trainer (assigned_trainer_id)
) ENGINE=InnoDB;

-- 3. TRAINER PROFILES TABLE
CREATE TABLE IF NOT EXISTS trainer_profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL UNIQUE,
    specialization VARCHAR(150) NOT NULL,
    experience_years INT NOT NULL DEFAULT 1,
    bio TEXT,
    certification VARCHAR(255),
    hourly_rate DECIMAL(7,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 4. EXERCISES LIBRARY TABLE
CREATE TABLE IF NOT EXISTS exercises (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(120) NOT NULL UNIQUE,
    category ENUM('STRENGTH', 'CARDIO', 'HYPERTROPHY', 'MOBILITY', 'OLYMPIC') NOT NULL,
    muscle_group ENUM('CHEST', 'BACK', 'LEGS', 'SHOULDERS', 'ARMS', 'CORE', 'FULL_BODY') NOT NULL,
    difficulty_level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL DEFAULT 'INTERMEDIATE',
    equipment_required VARCHAR(120) NOT NULL,
    description TEXT,
    instructions TEXT NOT NULL,
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_exercise_muscle (muscle_group),
    INDEX idx_exercise_category (category)
) ENGINE=InnoDB;

-- 5. WORKOUT PLANS TABLE
CREATE TABLE IF NOT EXISTS workout_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    creator_id BIGINT NOT NULL,
    fitness_goal VARCHAR(100) NOT NULL,
    difficulty_level ENUM('BEGINNER', 'INTERMEDIATE', 'ADVANCED') NOT NULL,
    duration_weeks INT NOT NULL DEFAULT 4,
    is_template BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_plan_creator (creator_id)
) ENGINE=InnoDB;

-- 6. WORKOUT PLAN EXERCISES (Prescribed exercises inside plans)
CREATE TABLE IF NOT EXISTS workout_plan_exercises (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    workout_plan_id BIGINT NOT NULL,
    exercise_id BIGINT NOT NULL,
    day_of_week TINYINT NOT NULL COMMENT '1=Mon, 7=Sun',
    day_name VARCHAR(50) NOT NULL,
    target_sets INT NOT NULL DEFAULT 3,
    target_reps VARCHAR(30) NOT NULL DEFAULT '8-12',
    suggested_weight_kg DECIMAL(5,2) DEFAULT 0.00,
    rest_interval_seconds INT NOT NULL DEFAULT 90,
    notes VARCHAR(255),
    order_index INT NOT NULL DEFAULT 1,
    FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE RESTRICT,
    INDEX idx_wpe_plan (workout_plan_id)
) ENGINE=InnoDB;

-- 7. MEMBER WORKOUT PLANS (Assignment linking member to plan)
CREATE TABLE IF NOT EXISTS member_workout_plans (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    workout_plan_id BIGINT NOT NULL,
    assigned_by_user_id BIGINT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status ENUM('ACTIVE', 'COMPLETED', 'PAUSED') DEFAULT 'ACTIVE',
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_by_user_id) REFERENCES users(id) ON DELETE RESTRICT,
    INDEX idx_mwp_member (member_id),
    INDEX idx_mwp_plan (workout_plan_id)
) ENGINE=InnoDB;

-- 8. WORKOUT SESSIONS TABLE (Logged workouts)
CREATE TABLE IF NOT EXISTS workout_sessions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    workout_plan_id BIGINT,
    session_title VARCHAR(150) NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    duration_minutes INT NOT NULL DEFAULT 0,
    status ENUM('IN_PROGRESS', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'COMPLETED',
    notes TEXT,
    total_volume_kg DECIMAL(9,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (workout_plan_id) REFERENCES workout_plans(id) ON DELETE SET NULL,
    INDEX idx_session_member_date (member_id, session_date)
) ENGINE=InnoDB;

-- 9. WORKOUT SESSION EXERCISES
CREATE TABLE IF NOT EXISTS workout_session_exercises (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    workout_session_id BIGINT NOT NULL,
    exercise_id BIGINT NOT NULL,
    order_index INT NOT NULL DEFAULT 1,
    notes VARCHAR(255),
    FOREIGN KEY (workout_session_id) REFERENCES workout_sessions(id) ON DELETE CASCADE,
    FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE RESTRICT,
    INDEX idx_wse_session (workout_session_id)
) ENGINE=InnoDB;

-- 10. WORKOUT SETS TABLE (Sets, repetitions, weights)
CREATE TABLE IF NOT EXISTS workout_sets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    session_exercise_id BIGINT NOT NULL,
    set_number INT NOT NULL,
    reps_completed INT NOT NULL,
    weight_kg DECIMAL(6,2) NOT NULL,
    is_warmup BOOLEAN NOT NULL DEFAULT FALSE,
    rest_seconds_taken INT DEFAULT 90,
    rpe DECIMAL(3,1) COMMENT 'Rate of Perceived Exertion (1.0 to 10.0)',
    FOREIGN KEY (session_exercise_id) REFERENCES workout_session_exercises(id) ON DELETE CASCADE,
    INDEX idx_ws_exercise (session_exercise_id)
) ENGINE=InnoDB;

-- 11. DIET ENTRIES TABLE
CREATE TABLE IF NOT EXISTS diet_entries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    entry_date DATE NOT NULL,
    meal_type ENUM('BREAKFAST', 'LUNCH', 'DINNER', 'SNACK') NOT NULL,
    food_name VARCHAR(150) NOT NULL,
    serving_size VARCHAR(100) NOT NULL,
    calories INT NOT NULL,
    protein_grams DECIMAL(5,2) DEFAULT 0.00,
    carbs_grams DECIMAL(5,2) DEFAULT 0.00,
    fats_grams DECIMAL(5,2) DEFAULT 0.00,
    notes VARCHAR(255),
    logged_at TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_diet_member_date (member_id, entry_date)
) ENGINE=InnoDB;

-- 12. FITNESS GOALS TABLE
CREATE TABLE IF NOT EXISTS fitness_goals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    goal_type ENUM('WEEKLY_WORKOUTS', 'TARGET_WEIGHT', 'EXERCISE_1RM', 'DAILY_CALORIES', 'CONSISTENCY') NOT NULL,
    title VARCHAR(150) NOT NULL,
    target_value DECIMAL(8,2) NOT NULL,
    current_value DECIMAL(8,2) NOT NULL DEFAULT 0.00,
    unit VARCHAR(30) NOT NULL,
    target_date DATE NOT NULL,
    status ENUM('IN_PROGRESS', 'ACHIEVED', 'MISSED') DEFAULT 'IN_PROGRESS',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_goal_member (member_id)
) ENGINE=InnoDB;

-- 13. PROGRESS ENTRIES TABLE (Body measurements)
CREATE TABLE IF NOT EXISTS progress_entries (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    member_id BIGINT NOT NULL,
    entry_date DATE NOT NULL,
    body_weight_kg DECIMAL(5,2) NOT NULL,
    chest_cm DECIMAL(5,2),
    waist_cm DECIMAL(5,2),
    arms_cm DECIMAL(5,2),
    thighs_cm DECIMAL(5,2),
    body_fat_percent DECIMAL(4,2),
    notes VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_progress_member (member_id, entry_date)
) ENGINE=InnoDB;

-- 14. TRAINER FEEDBACK TABLE
CREATE TABLE IF NOT EXISTS trainer_feedback (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    trainer_id BIGINT NOT NULL,
    member_id BIGINT NOT NULL,
    session_id BIGINT,
    feedback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    subject VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    rating TINYINT COMMENT '1 to 5 stars',
    FOREIGN KEY (trainer_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (member_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (session_id) REFERENCES workout_sessions(id) ON DELETE SET NULL,
    INDEX idx_feedback_member (member_id),
    INDEX idx_feedback_trainer (trainer_id)
) ENGINE=InnoDB;`,
  },
  {
    path: 'src/main/resources/data.sql',
    category: 'sql',
    description: 'Sample initial seed data with BCrypt passwords ($2a$12$...) and exercises',
    code: `-- ===================================================================
-- Sample Seed Data for gym_tracker
-- Note: All passwords are BCrypt hashes of: "Password123!"
-- BCrypt: $2a$12$bL0Y3k4K6e0k3d0V9eB1xehZ5a.uR9N4uPq7x1e2y6g8v9i1a2b3c (mock format)
-- In production, the Spring Boot DataInitializer dynamically generates valid BCrypt hashes.
-- ===================================================================

USE gym_tracker;

-- Insert Seed Users
INSERT INTO users (id, email, password_hash, full_name, phone_number, role, enabled) VALUES
(1, 'admin@gympulse.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Marcus Vance (Admin)', '+1-555-0100', 'ADMIN', TRUE),
(2, 'trainer@gympulse.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Elena Rostova (Coach)', '+1-555-0101', 'TRAINER', TRUE),
(3, 'member@gympulse.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Alex Reynolds', '+1-555-0102', 'MEMBER', TRUE),
(4, 'sarah.j@gympulse.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sarah Jenkins', '+1-555-0103', 'MEMBER', TRUE),
(5, 'david.kim@gympulse.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'David Kim (Coach)', '+1-555-0104', 'TRAINER', TRUE)
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

-- Member Profiles
INSERT INTO member_profiles (id, user_id, date_of_birth, gender, height_cm, current_weight_kg, target_weight_kg, fitness_level, primary_goal, assigned_trainer_id, membership_status, membership_type) VALUES
(1, 3, '1995-06-14', 'MALE', 182.0, 81.5, 85.0, 'INTERMEDIATE', 'MUSCLE_GAIN', 2, 'ACTIVE', 'PREMIUM'),
(2, 4, '1998-11-23', 'FEMALE', 168.0, 64.0, 60.0, 'BEGINNER', 'WEIGHT_LOSS', 2, 'ACTIVE', 'STANDARD')
ON DUPLICATE KEY UPDATE current_weight_kg=VALUES(current_weight_kg);

-- Trainer Profiles
INSERT INTO trainer_profiles (id, user_id, specialization, experience_years, bio, certification, hourly_rate) VALUES
(1, 2, 'Hypertrophy & Strength Conditioning', 7, 'CSCS & NASM certified master trainer focusing on compound biomechanics and periodization.', 'NSCA-CSCS, NASM-CPT', 75.00),
(2, 5, 'Mobility & Powerlifting', 5, 'Former collegiate powerlifter specialized in barbell mechanics and athletic power.', 'USAPL Club Coach', 70.00)
ON DUPLICATE KEY UPDATE experience_years=VALUES(experience_years);

-- Seed Exercises
INSERT INTO exercises (id, name, category, muscle_group, difficulty_level, equipment_required, description, instructions) VALUES
(1, 'Barbell Back Squat', 'STRENGTH', 'LEGS', 'INTERMEDIATE', 'Barbell, Power Rack', 'Lower body compound exercise targeting quads, glutes, and core.', 'Unrack on traps, break at hips and knees, descend below parallel, drive up.'),
(2, 'Flat Barbell Bench Press', 'STRENGTH', 'CHEST', 'INTERMEDIATE', 'Flat Bench, Barbell', 'Horizontal push developing pectoralis major, anterior deltoids, and triceps.', 'Retract scapulae, unrack, lower bar to sternum with elbows tucked, press up.'),
(3, 'Conventional Deadlift', 'STRENGTH', 'BACK', 'ADVANCED', 'Olympic Barbell, Plates', 'Posterior chain builder developing erectors, lats, glutes, and grip.', 'Hinge hips, grip outside knees, depress lats, push floor away through heels.'),
(4, 'Overhead Barbell Press', 'STRENGTH', 'SHOULDERS', 'INTERMEDIATE', 'Barbell, Squat Rack', 'Strict vertical press challenging shoulder stability and core rigidity.', 'Rest bar on clavicle, brace core and glutes, press vertically over head.'),
(5, 'Incline Dumbbell Press', 'HYPERTROPHY', 'CHEST', 'INTERMEDIATE', 'Adjustable Bench, Dumbbells', 'Emphasizes clavicular upper pectorals with natural wrist freedom.', 'Kick dumbbells up at 30 degrees bench, press up in a controlled arc.'),
(6, 'Pull-Up / Weighted Pull-Up', 'HYPERTROPHY', 'BACK', 'INTERMEDIATE', 'Pull-Up Bar', 'Vertical pulling movement for wide lats and upper back strength.', 'Overhand grip, start from dead hang, drive elbows into pockets to bar level.')
ON DUPLICATE KEY UPDATE description=VALUES(description);`,
  },
  {
    path: 'src/main/java/com/gymtracker/config/SecurityConfig.java',
    category: 'security',
    description: 'Spring Security 6 configuration with BCrypt, role-based URL authorization, and custom login',
    code: `package com.gymtracker.config;

import com.gymtracker.service.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;

    public SecurityConfig(CustomUserDetailsService userDetailsService) {
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .authenticationProvider(authenticationProvider())
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers(
                    "/",
                    "/about",
                    "/login",
                    "/register",
                    "/css/**",
                    "/js/**",
                    "/images/**",
                    "/webjars/**",
                    "/error",
                    "/access-denied"
                ).permitAll()

                // Role-based route protection
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/trainer/**").hasAnyRole("TRAINER", "ADMIN")
                .requestMatchers("/member/**").hasAnyRole("MEMBER", "ADMIN")
                
                // Shared workout & exercise endpoints
                .requestMatchers("/exercises/**", "/workout-plans/**", "/workouts/**", "/diet/**", "/goals/**").authenticated()

                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .loginProcessingUrl("/login-process")
                .defaultSuccessUrl("/dashboard-router", true)
                .failureUrl("/login?error=true")
                .usernameParameter("email")
                .passwordParameter("password")
                .permitAll()
            )
            .logout(logout -> logout
                .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
                .logoutSuccessUrl("/login?logout=true")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
                .permitAll()
            )
            .exceptionHandling(ex -> ex
                .accessDeniedPage("/access-denied")
            )
            .rememberMe(remember -> remember
                .key("IronPulseGymSecretKey2026")
                .tokenValiditySeconds(86400 * 14) // 14 days
                .userDetailsService(userDetailsService)
            );

        return http.build();
    }
}`,
  },
  {
    path: 'src/main/java/com/gymtracker/entity/User.java',
    category: 'entity',
    description: 'JPA Entity representing users with email, BCrypt password, and Role enum',
    code: `package com.gymtracker.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Email is required")
    @Email(message = "Please provide a valid email address")
    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @NotBlank(message = "Full name is required")
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "phone_number", length = 25)
    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Role role;

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Default constructor for JPA
    public User() {}

    public User(String email, String passwordHash, String fullName, Role role) {
        this.email = email;
        this.passwordHash = passwordHash;
        this.fullName = fullName;
        this.role = role;
        this.enabled = true;
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPhoneNumber() { return phoneNumber; }
    public void setPhoneNumber(String phoneNumber) { this.phoneNumber = phoneNumber; }

    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
}`,
  },
  {
    path: 'src/main/java/com/gymtracker/entity/WorkoutSession.java',
    category: 'entity',
    description: 'JPA Entity representing a completed or active workout session with sets and exercises',
    code: `package com.gymtracker.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "workout_sessions")
public class WorkoutSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private User member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workout_plan_id")
    private WorkoutPlan workoutPlan;

    @Column(name = "session_title", nullable = false, length = 150)
    private String sessionTitle;

    @Column(name = "session_date", nullable = false)
    private LocalDate sessionDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "duration_minutes", nullable = false)
    private Integer durationMinutes = 0;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private SessionStatus status = SessionStatus.COMPLETED;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "total_volume_kg", precision = 9, scale = 2)
    private BigDecimal totalVolumeKg = BigDecimal.ZERO;

    @OneToMany(mappedBy = "workoutSession", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WorkoutSessionExercise> exercises = new ArrayList<>();

    public enum SessionStatus {
        IN_PROGRESS, COMPLETED, CANCELLED
    }

    public WorkoutSession() {}

    public void addExercise(WorkoutSessionExercise exercise) {
        exercises.add(exercise);
        exercise.setWorkoutSession(this);
    }

    public void recalculateTotalVolume() {
        BigDecimal sum = BigDecimal.ZERO;
        for (WorkoutSessionExercise ex : exercises) {
            for (WorkoutSet s : ex.getSets()) {
                if (s.getRepsCompleted() != null && s.getWeightKg() != null) {
                    sum = sum.add(s.getWeightKg().multiply(BigDecimal.valueOf(s.getRepsCompleted())));
                }
            }
        }
        this.totalVolumeKg = sum;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getMember() { return member; }
    public void setMember(User member) { this.member = member; }

    public WorkoutPlan getWorkoutPlan() { return workoutPlan; }
    public void setWorkoutPlan(WorkoutPlan workoutPlan) { this.workoutPlan = workoutPlan; }

    public String getSessionTitle() { return sessionTitle; }
    public void setSessionTitle(String sessionTitle) { this.sessionTitle = sessionTitle; }

    public LocalDate getSessionDate() { return sessionDate; }
    public void setSessionDate(LocalDate sessionDate) { this.sessionDate = sessionDate; }

    public LocalTime getStartTime() { return startTime; }
    public void setStartTime(LocalTime startTime) { this.startTime = startTime; }

    public LocalTime getEndTime() { return endTime; }
    public void setEndTime(LocalTime endTime) { this.endTime = endTime; }

    public Integer getDurationMinutes() { return durationMinutes; }
    public void setDurationMinutes(Integer durationMinutes) { this.durationMinutes = durationMinutes; }

    public SessionStatus getStatus() { return status; }
    public void setStatus(SessionStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public BigDecimal getTotalVolumeKg() { return totalVolumeKg; }
    public void setTotalVolumeKg(BigDecimal totalVolumeKg) { this.totalVolumeKg = totalVolumeKg; }

    public List<WorkoutSessionExercise> getExercises() { return exercises; }
    public void setExercises(List<WorkoutSessionExercise> exercises) { this.exercises = exercises; }
}`,
  },
  {
    path: 'src/main/java/com/gymtracker/service/WorkoutSessionService.java',
    category: 'service',
    description: 'Transactional business service for session creation, volume calculation, streak & history',
    code: `package com.gymtracker.service;

import com.gymtracker.entity.User;
import com.gymtracker.entity.WorkoutSession;
import com.gymtracker.repository.WorkoutSessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class WorkoutSessionService {

    private final WorkoutSessionRepository sessionRepository;

    public WorkoutSessionService(WorkoutSessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    public WorkoutSession saveSession(WorkoutSession session) {
        session.recalculateTotalVolume();
        return sessionRepository.save(session);
    }

    @Transactional(readOnly = true)
    public List<WorkoutSession> getMemberSessions(Long memberId) {
        return sessionRepository.findByMemberIdOrderBySessionDateDesc(memberId);
    }

    @Transactional(readOnly = true)
    public Optional<WorkoutSession> getSessionById(Long id) {
        return sessionRepository.findById(id);
    }

    public void deleteSession(Long sessionId, Long memberId) {
        WorkoutSession session = sessionRepository.findById(sessionId)
            .orElseThrow(() -> new IllegalArgumentException("Session not found"));
        if (!session.getMember().getId().equals(memberId)) {
            throw new SecurityException("Unauthorized attempt to delete another member's workout");
        }
        sessionRepository.delete(session);
    }

    @Transactional(readOnly = true)
    public int calculateWorkoutStreakDays(Long memberId) {
        List<LocalDate> dates = sessionRepository.findDistinctSessionDatesByMember(memberId);
        if (dates.isEmpty()) return 0;

        LocalDate today = LocalDate.now();
        LocalDate expected = dates.get(0).equals(today) ? today : today.minusDays(1);

        if (!dates.contains(expected)) {
            return 0;
        }

        int streak = 0;
        for (LocalDate d : dates) {
            if (d.equals(expected)) {
                streak++;
                expected = expected.minusDays(1);
            } else if (d.isBefore(expected)) {
                break;
            }
        }
        return streak;
    }
}`,
  },
  {
    path: 'src/main/java/com/gymtracker/controller/MemberController.java',
    category: 'controller',
    description: 'Spring MVC controller rendering Member Dashboard, Workout History, and Diet stats',
    code: `package com.gymtracker.controller;

import com.gymtracker.entity.User;
import com.gymtracker.service.*;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

import java.time.LocalDate;

@Controller
@RequestMapping("/member")
public class MemberController {

    private final WorkoutSessionService sessionService;
    private final DietService dietService;
    private final GoalService goalService;
    private final FeedbackService feedbackService;
    private final UserService userService;

    public MemberController(WorkoutSessionService sessionService,
                            DietService dietService,
                            GoalService goalService,
                            FeedbackService feedbackService,
                            UserService userService) {
        this.sessionService = sessionService;
        this.dietService = dietService;
        this.goalService = goalService;
        this.feedbackService = feedbackService;
        this.userService = userService;
    }

    @GetMapping("/dashboard")
    public String showDashboard(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
                                Model model) {
        User currentUser = userService.findByEmail(principal.getUsername())
                .orElseThrow(() -> new IllegalStateException("User not found"));

        Long memberId = currentUser.getId();
        LocalDate today = LocalDate.now();

        model.addAttribute("user", currentUser);
        model.addAttribute("recentSessions", sessionService.getMemberSessions(memberId));
        model.addAttribute("streakDays", sessionService.calculateWorkoutStreakDays(memberId));
        model.addAttribute("todayDiet", dietService.getDailySummary(memberId, today));
        model.addAttribute("activeGoals", goalService.getActiveGoals(memberId));
        model.addAttribute("trainerNotes", feedbackService.getFeedbackForMember(memberId));

        return "member/dashboard";
    }

    @GetMapping("/workouts")
    public String showWorkoutHistory(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
                                     Model model) {
        User currentUser = userService.findByEmail(principal.getUsername()).orElseThrow();
        model.addAttribute("sessions", sessionService.getMemberSessions(currentUser.getId()));
        return "member/workouts";
    }

    @GetMapping("/diet")
    public String showDietTracker(@AuthenticationPrincipal org.springframework.security.core.userdetails.User principal,
                                  Model model) {
        User currentUser = userService.findByEmail(principal.getUsername()).orElseThrow();
        model.addAttribute("entries", dietService.getEntriesByDate(currentUser.getId(), LocalDate.now()));
        return "member/diet";
    }
}`,
  },
  {
    path: 'README.md',
    category: 'doc',
    description: 'Complete Windows 11 setup guide, Maven build, MySQL setup, and verification instructions',
    code: `# IronPulse Gym Workout & Tracker Management System

A production-grade, secure, responsive fitness and gym management application built with **Java 17, Spring Boot 3, Spring Data JPA, Spring Security, MySQL 8, Thymeleaf, and Bootstrap 5**.

---

## 1. System Requirements (Windows 11)

1. **Java Development Kit (JDK)**: JDK 17 or higher (Eclipse Temurin, Oracle JDK, or Microsoft OpenJDK).
   Verify in Command Prompt or PowerShell:
   \`\`\`cmd
   java -version
   javac -version
   \`\`\`

2. **Apache Maven**: Version 3.8.x or 3.9.x.
   Verify:
   \`\`\`cmd
   mvn -version
   \`\`\`

3. **MySQL Database**: MySQL 8.0+ or XAMPP (MariaDB/MySQL).
   Ensure the MySQL service is running on \`localhost:3306\`.

---

## 2. MySQL Database Setup

1. Open **MySQL Command Line Client** or **phpMyAdmin** (\`http://localhost/phpmyadmin\` in XAMPP) or **MySQL Workbench**.
2. Run the provided \`schema.sql\` script:
   \`\`\`cmd
   mysql -u root -p < src/main/resources/schema.sql
   mysql -u root -p < src/main/resources/data.sql
   \`\`\`
   Or create the database manually:
   \`\`\`sql
   CREATE DATABASE gym_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   \`\`\`

---

## 3. Configuration

1. Copy \`src/main/resources/application.properties.example\` to \`src/main/resources/application.properties\`.
2. Configure your MySQL credentials:
   \`\`\`properties
   spring.datasource.url=jdbc:mysql://localhost:3306/gym_tracker?useSSL=false&serverTimezone=UTC
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   server.port=8080
   \`\`\`

---

## 4. Build, Test & Run Commands

In Windows PowerShell or Command Prompt, navigate to the project directory:

\`\`\`cmd
# Clean and compile
mvn clean compile

# Run automated tests (JUnit 5 & Spring Security tests)
mvn clean test

# Run the Spring Boot Application
mvn spring-boot:run
\`\`\`

The web application will launch and be accessible at:
\`\`\`
http://localhost:8080/
\`\`\`

---

## 5. Seed Accounts & Roles

| Role | Email | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Admin** | \`admin@gympulse.com\` | \`Password123!\` | \`/admin/**\` (Member, Trainer, Exercise & Plan CRUD) |
| **Trainer** | \`trainer@gympulse.com\` | \`Password123!\` | \`/trainer/**\` (Assigned Members, Plan Editor, Feedback) |
| **Member** | \`member@gympulse.com\` | \`Password123!\` | \`/member/**\` (Log Workouts, Sets, Diet Tracker, Goals) |

---

## 6. Troubleshooting Common Issues

- **Port 8080 in use**:
  Change \`server.port=8081\` in \`application.properties\`, or kill the process on Windows:
  \`\`\`cmd
  netstat -ano | findstr :8080
  taskkill /PID <PID> /F
  \`\`\`

- **MySQL Access Denied (1045)**:
  Check \`spring.datasource.username\` and \`password\` in \`application.properties\`.

- **Unknown database 'gym_tracker'**:
  Execute \`CREATE DATABASE gym_tracker;\` in MySQL before starting Spring Boot.`,
  },
];
