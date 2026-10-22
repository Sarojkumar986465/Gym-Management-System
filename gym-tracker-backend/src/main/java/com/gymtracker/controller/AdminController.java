package com.gymtracker.controller;

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
