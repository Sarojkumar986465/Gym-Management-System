#!/usr/bin/env python3
import os
import zipfile
import shutil

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BASE_DIR = os.path.join(ROOT_DIR, "gym-tracker-backend")
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")

os.makedirs(os.path.join(BASE_DIR, "src/main/java/com/gymtracker/config"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "src/main/java/com/gymtracker/entity"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "src/main/java/com/gymtracker/repository"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "src/main/java/com/gymtracker/service"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "src/main/java/com/gymtracker/controller"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "src/main/java/com/gymtracker/dto"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "src/main/resources/templates/member"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "src/main/resources/templates/admin"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "src/main/resources/static/css"), exist_ok=True)
os.makedirs(os.path.join(BASE_DIR, "src/main/resources/static/js"), exist_ok=True)
os.makedirs(PUBLIC_DIR, exist_ok=True)

# 1. CustomUserDetailsService.java
with open(os.path.join(BASE_DIR, "src/main/java/com/gymtracker/service/CustomUserDetailsService.java"), "w", encoding="utf-8") as f:
    f.write('''package com.gymtracker.service;

import com.gymtracker.entity.User;
import com.gymtracker.repository.UserRepository;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));

        if (!user.isEnabled()) {
            throw new UsernameNotFoundException("Account is deactivated");
        }

        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPasswordHash(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
}
''')

# 2. UserRepository.java
with open(os.path.join(BASE_DIR, "src/main/java/com/gymtracker/repository/UserRepository.java"), "w", encoding="utf-8") as f:
    f.write('''package com.gymtracker.repository;

import com.gymtracker.entity.Role;
import com.gymtracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    List<User> findByRole(Role role);
}
''')

# 3. WorkoutSessionRepository.java
with open(os.path.join(BASE_DIR, "src/main/java/com/gymtracker/repository/WorkoutSessionRepository.java"), "w", encoding="utf-8") as f:
    f.write('''package com.gymtracker.repository;

import com.gymtracker.entity.WorkoutSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WorkoutSessionRepository extends JpaRepository<WorkoutSession, Long> {
    List<WorkoutSession> findByMemberIdOrderBySessionDateDesc(Long memberId);
    
    @Query("SELECT DISTINCT w.sessionDate FROM WorkoutSession w WHERE w.member.id = :memberId ORDER BY w.sessionDate DESC")
    List<LocalDate> findDistinctSessionDatesByMember(@Param("memberId") Long memberId);

    @Query("SELECT COUNT(w) FROM WorkoutSession w WHERE w.member.id = :memberId")
    long countCompletedSessionsByMember(@Param("memberId") Long memberId);
}
''')

# 4. ExerciseRepository.java
with open(os.path.join(BASE_DIR, "src/main/java/com/gymtracker/repository/ExerciseRepository.java"), "w", encoding="utf-8") as f:
    f.write('''package com.gymtracker.repository;

import com.gymtracker.entity.Exercise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    Optional<Exercise> findByName(String name);
    List<Exercise> findByCategory(String category);
    List<Exercise> findByMuscleGroup(String muscleGroup);
}
''')

# 5. SubscriptionPlan.java
with open(os.path.join(BASE_DIR, "src/main/java/com/gymtracker/entity/SubscriptionPlan.java"), "w", encoding="utf-8") as f:
    f.write('''package com.gymtracker.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "subscription_plans")
public class SubscriptionPlan {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal price;

    @Column(name = "billing_cycle", nullable = false, length = 30)
    private String billingCycle;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "max_visits_per_week")
    private Integer maxVisitsPerWeek;

    @Column(name = "locker_access")
    private Boolean lockerAccess = true;

    @Column(name = "trainer_sessions_included")
    private Integer trainerSessionsIncluded = 0;

    @Column(name = "active")
    private Boolean active = true;

    public SubscriptionPlan() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getBillingCycle() { return billingCycle; }
    public void setBillingCycle(String billingCycle) { this.billingCycle = billingCycle; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getMaxVisitsPerWeek() { return maxVisitsPerWeek; }
    public void setMaxVisitsPerWeek(Integer maxVisitsPerWeek) { this.maxVisitsPerWeek = maxVisitsPerWeek; }

    public Boolean getLockerAccess() { return lockerAccess; }
    public void setLockerAccess(Boolean lockerAccess) { this.lockerAccess = lockerAccess; }

    public Integer getTrainerSessionsIncluded() { return trainerSessionsIncluded; }
    public void setTrainerSessionsIncluded(Integer trainerSessionsIncluded) { this.trainerSessionsIncluded = trainerSessionsIncluded; }

    public Boolean getActive() { return active; }
    public void setActive(Boolean active) { this.active = active; }
}
''')

# 6. PaymentRecord.java
with open(os.path.join(BASE_DIR, "src/main/java/com/gymtracker/entity/PaymentRecord.java"), "w", encoding="utf-8") as f:
    f.write('''package com.gymtracker.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payment_records")
public class PaymentRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "invoice_id", nullable = false, unique = true, length = 50)
    private String invoiceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    private User member;

    @Column(name = "plan_name", nullable = false, length = 100)
    private String planName;

    @Column(nullable = false, precision = 8, scale = 2)
    private BigDecimal amount;

    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod;

    @Column(nullable = false, length = 30)
    private String status = "PAID";

    @Column(name = "payment_date", nullable = false)
    private LocalDateTime paymentDate = LocalDateTime.now();

    public PaymentRecord() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getInvoiceId() { return invoiceId; }
    public void setInvoiceId(String invoiceId) { this.invoiceId = invoiceId; }

    public User getMember() { return member; }
    public void setMember(User member) { this.member = member; }

    public String getPlanName() { return planName; }
    public void setPlanName(String planName) { this.planName = planName; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }
}
''')

# 7. Exercise.java
with open(os.path.join(BASE_DIR, "src/main/java/com/gymtracker/entity/Exercise.java"), "w", encoding="utf-8") as f:
    f.write('''package com.gymtracker.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "exercises")
public class Exercise {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 120)
    private String name;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "muscle_group", nullable = false, length = 50)
    private String muscleGroup;

    @Column(name = "difficulty_level", nullable = false, length = 30)
    private String difficultyLevel = "INTERMEDIATE";

    @Column(name = "equipment_required", nullable = false, length = 120)
    private String equipmentRequired;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String instructions;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    public Exercise() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getMuscleGroup() { return muscleGroup; }
    public void setMuscleGroup(String muscleGroup) { this.muscleGroup = muscleGroup; }

    public String getDifficultyLevel() { return difficultyLevel; }
    public void setDifficultyLevel(String difficultyLevel) { this.difficultyLevel = difficultyLevel; }

    public String getEquipmentRequired() { return equipmentRequired; }
    public void setEquipmentRequired(String equipmentRequired) { this.equipmentRequired = equipmentRequired; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getInstructions() { return instructions; }
    public void setInstructions(String instructions) { this.instructions = instructions; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
}
''')

# 8. AdminController.java
with open(os.path.join(BASE_DIR, "src/main/java/com/gymtracker/controller/AdminController.java"), "w", encoding="utf-8") as f:
    f.write('''package com.gymtracker.controller;

import com.gymtracker.entity.Role;
import com.gymtracker.entity.User;
import com.gymtracker.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/dashboard")
    public String adminDashboard(Model model) {
        model.addAttribute("members", userRepository.findByRole(Role.MEMBER));
        model.addAttribute("trainers", userRepository.findByRole(Role.TRAINER));
        model.addAttribute("totalUsers", userRepository.count());
        return "admin/dashboard";
    }

    @PostMapping("/members/add")
    public String addMember(@RequestParam String fullName,
                            @RequestParam String email,
                            @RequestParam String password,
                            @RequestParam(required = false) String phoneNumber,
                            RedirectAttributes redirectAttributes) {
        if (userRepository.existsByEmail(email)) {
            redirectAttributes.addFlashAttribute("error", "Email already in use");
            return "redirect:/admin/dashboard";
        }

        User member = new User(email, passwordEncoder.encode(password), fullName, Role.MEMBER);
        member.setPhoneNumber(phoneNumber);
        userRepository.save(member);
        redirectAttributes.addFlashAttribute("success", "Member created successfully");
        return "redirect:/admin/dashboard";
    }

    @PostMapping("/members/delete/{id}")
    public String deleteMember(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        userRepository.deleteById(id);
        redirectAttributes.addFlashAttribute("success", "Member deleted successfully");
        return "redirect:/admin/dashboard";
    }

    @PostMapping("/trainers/add")
    public String addTrainer(@RequestParam String fullName,
                             @RequestParam String email,
                             @RequestParam String password,
                             @RequestParam(required = false) String phoneNumber,
                             RedirectAttributes redirectAttributes) {
        if (userRepository.existsByEmail(email)) {
            redirectAttributes.addFlashAttribute("error", "Email already in use");
            return "redirect:/admin/dashboard";
        }

        User trainer = new User(email, passwordEncoder.encode(password), fullName, Role.TRAINER);
        trainer.setPhoneNumber(phoneNumber);
        userRepository.save(trainer);
        redirectAttributes.addFlashAttribute("success", "Trainer added successfully");
        return "redirect:/admin/dashboard";
    }

    @PostMapping("/trainers/delete/{id}")
    public String deleteTrainer(@PathVariable Long id, RedirectAttributes redirectAttributes) {
        userRepository.deleteById(id);
        redirectAttributes.addFlashAttribute("success", "Trainer removed successfully");
        return "redirect:/admin/dashboard";
    }
}
''')

# 9. AuthController.java
with open(os.path.join(BASE_DIR, "src/main/java/com/gymtracker/controller/AuthController.java"), "w", encoding="utf-8") as f:
    f.write('''package com.gymtracker.controller;

import com.gymtracker.entity.Role;
import com.gymtracker.entity.User;
import com.gymtracker.repository.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/login")
    public String loginPage(@RequestParam(value = "error", required = false) String error,
                            @RequestParam(value = "logout", required = false) String logout,
                            Model model) {
        if (error != null) model.addAttribute("errorMessage", "Invalid email or password.");
        if (logout != null) model.addAttribute("successMessage", "You have been logged out securely.");
        return "login";
    }

    @GetMapping("/register")
    public String registerPage() {
        return "register";
    }

    @PostMapping("/register")
    public String processRegistration(@RequestParam String fullName,
                                      @RequestParam String email,
                                      @RequestParam String password,
                                      @RequestParam(defaultValue = "MEMBER") String role,
                                      RedirectAttributes redirectAttributes) {
        if (userRepository.existsByEmail(email)) {
            redirectAttributes.addFlashAttribute("errorMessage", "An account with that email already exists.");
            return "redirect:/register";
        }

        Role userRole = Role.MEMBER;
        try {
            userRole = Role.valueOf(role.toUpperCase());
        } catch (IllegalArgumentException ignored) {}

        User newUser = new User(email, passwordEncoder.encode(password), fullName, userRole);
        userRepository.save(newUser);

        redirectAttributes.addFlashAttribute("successMessage", "Registration complete! You may now sign in.");
        return "redirect:/login";
    }

    @GetMapping("/dashboard-router")
    public String routeAfterLogin(Authentication auth) {
        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return "redirect:/admin/dashboard";
        } else if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_TRAINER"))) {
            return "redirect:/trainer/dashboard";
        }
        return "redirect:/member/dashboard";
    }
}
''')

# 10. application.properties (preconfigured default ready to run)
with open(os.path.join(BASE_DIR, "src/main/resources/application.properties"), "w", encoding="utf-8") as f:
    f.write('''# ===================================================================
# Gym Management System - Spring Boot 3 & MySQL 8 Configuration
# ===================================================================

server.port=8080
server.servlet.context-path=/

# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/gym_tracker?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC&characterEncoding=UTF-8
spring.datasource.username=root
spring.datasource.password=
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA & Hibernate Settings
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
spring.jpa.open-in-view=false

# Thymeleaf Template Settings
spring.thymeleaf.cache=false
spring.thymeleaf.prefix=classpath:/templates/
spring.thymeleaf.suffix=.html
spring.thymeleaf.mode=HTML
spring.thymeleaf.encoding=UTF-8

# File Upload limits
spring.servlet.multipart.max-file-size=10MB
spring.servlet.multipart.max-request-size=20MB

logging.level.org.springframework.security=INFO
logging.level.com.gymtracker=DEBUG
''')

# 11. Windows Maven Wrapper Scripts
with open(os.path.join(BASE_DIR, "mvnw.cmd"), "w", encoding="utf-8") as f:
    f.write('''@REM ----------------------------------------------------------------------------
@REM Maven Wrapper for Windows (Gym Management System)
@REM ----------------------------------------------------------------------------
@echo off
setlocal
mvn %*
''')

with open(os.path.join(BASE_DIR, "mvnw"), "w", encoding="utf-8") as f:
    f.write('''#!/bin/sh
# Maven Wrapper for Linux/macOS
mvn "$@"
''')
os.chmod(os.path.join(BASE_DIR, "mvnw"), 0o755)

# 12. Create complete ZIP archives in /public directory
backend_zip_path = os.path.join(PUBLIC_DIR, "gym-management-system-backend.zip")
full_zip_path = os.path.join(PUBLIC_DIR, "gym-management-system-full.zip")

print("Zipping backend to", backend_zip_path)
with zipfile.ZipFile(backend_zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(BASE_DIR):
        for file in files:
            full_file_path = os.path.join(root, file)
            arcname = os.path.relpath(full_file_path, BASE_DIR)
            zipf.write(full_file_path, os.path.join("gym-management-system-backend", arcname))

print("Zipping full project to", full_zip_path)
with zipfile.ZipFile(full_zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
    # Add backend
    for root, dirs, files in os.walk(BASE_DIR):
        for file in files:
            full_file_path = os.path.join(root, file)
            arcname = os.path.relpath(full_file_path, BASE_DIR)
            zipf.write(full_file_path, os.path.join("gym-management-system", "backend", arcname))
    
    # Add frontend and project configs
    frontend_roots = ["src", "index.html", "package.json", "vite.config.ts", "tsconfig.json", "metadata.json", ".env.example"]
    for item in frontend_roots:
        full_item_path = os.path.join(ROOT_DIR, item)
        if os.path.isfile(full_item_path):
            zipf.write(full_item_path, os.path.join("gym-management-system", "frontend", item))
        elif os.path.isdir(full_item_path):
            for root, dirs, files in os.walk(full_item_path):
                for file in files:
                    full_file_path = os.path.join(root, file)
                    arcname = os.path.relpath(full_file_path, ROOT_DIR)
                    zipf.write(full_file_path, os.path.join("gym-management-system", arcname))

print("Zips successfully created!")
