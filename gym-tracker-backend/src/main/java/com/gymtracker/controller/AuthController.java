package com.gymtracker.controller;

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
