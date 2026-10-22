# IronPulse Gym Workout & Tracker Management System

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
2. Run the provided \`schema.sql\` and \`data.sql\` scripts:
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
  Execute \`CREATE DATABASE gym_tracker;\` in MySQL before starting Spring Boot.
