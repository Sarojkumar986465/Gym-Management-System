-- ===================================================================
-- IronPulse Gym Workout & Tracker Management System - MySQL 8 DDL
-- Database: gym_tracker
-- Normalization: 3NF with foreign keys, checks, indexes & cascades
-- ===================================================================

CREATE DATABASE IF NOT EXISTS gym_tracker CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gym_tracker;

-- 1. USERS TABLE
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

-- 6. WORKOUT PLAN EXERCISES
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

-- 7. MEMBER WORKOUT PLANS
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

-- 8. WORKOUT SESSIONS TABLE
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

-- 10. WORKOUT SETS TABLE
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

-- 13. PROGRESS ENTRIES TABLE
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
) ENGINE=InnoDB;
