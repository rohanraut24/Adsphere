package com.adsphere.config;

import com.adsphere.model.Role;
import com.adsphere.model.User;
import com.adsphere.model.UserStatus;
import com.adsphere.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedSuperAdmin("admin@adsphere.com", "Admin123!", "Super Admin");
    }

    private void seedSuperAdmin(String email, String password, String fullName) {
        if (userRepository.existsByEmail(email)) {
            log.info("SUPER_ADMIN already exists: {}", email);
            return;
        }
        User admin = new User();
        admin.setEmail(email);
        admin.setPassword(passwordEncoder.encode(password));
        admin.setFullName(fullName);
        admin.setRole(Role.SUPER_ADMIN);
        admin.setStatus(UserStatus.ACTIVE);
        userRepository.save(admin);
        log.info("==============================================");
        log.info("  SUPER_ADMIN created successfully");
        log.info("  Email   : {}", email);
        log.info("  Password: {}", password);
        log.info("==============================================");
    }
}
