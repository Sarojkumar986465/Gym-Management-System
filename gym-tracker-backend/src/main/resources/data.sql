USE gym_tracker;

-- Seed Users (Passwords are BCrypt hashes for 'Password123!')
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

-- Exercises
INSERT INTO exercises (id, name, category, muscle_group, difficulty_level, equipment_required, description, instructions) VALUES
(1, 'Barbell Back Squat', 'STRENGTH', 'LEGS', 'INTERMEDIATE', 'Barbell, Power Rack', 'Lower body compound exercise targeting quads, glutes, and core.', 'Unrack on traps, break at hips and knees, descend below parallel, drive up.'),
(2, 'Flat Barbell Bench Press', 'STRENGTH', 'CHEST', 'INTERMEDIATE', 'Flat Bench, Barbell', 'Horizontal push developing pectoralis major, anterior deltoids, and triceps.', 'Retract scapulae, unrack, lower bar to sternum with elbows tucked, press up.'),
(3, 'Conventional Deadlift', 'STRENGTH', 'BACK', 'ADVANCED', 'Olympic Barbell, Plates', 'Posterior chain builder developing erectors, lats, glutes, and grip.', 'Hinge hips, grip outside knees, depress lats, push floor away through heels.'),
(4, 'Overhead Barbell Press', 'STRENGTH', 'SHOULDERS', 'INTERMEDIATE', 'Barbell, Squat Rack', 'Strict vertical press challenging shoulder stability and core rigidity.', 'Rest bar on clavicle, brace core and glutes, press vertically over head.'),
(5, 'Incline Dumbbell Press', 'HYPERTROPHY', 'CHEST', 'INTERMEDIATE', 'Adjustable Bench, Dumbbells', 'Emphasizes clavicular upper pectorals with natural wrist freedom.', 'Kick dumbbells up at 30 degrees bench, press up in a controlled arc.'),
(6, 'Pull-Up / Weighted Pull-Up', 'HYPERTROPHY', 'BACK', 'INTERMEDIATE', 'Pull-Up Bar', 'Vertical pulling movement for wide lats and upper back strength.', 'Overhand grip, start from dead hang, drive elbows into pockets to bar level.')
ON DUPLICATE KEY UPDATE description=VALUES(description);
