package com.moomoo.auth;

import com.moomoo.common.Role;
import com.moomoo.modules.admin.User;
import com.moomoo.modules.admin.UserRepository;
import com.moomoo.modules.admin.Farm;
import com.moomoo.modules.admin.FarmRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class AuthBootstrapConfig {

    @Bean
    CommandLineRunner bootstrapAdmin(UserRepository userRepository,
                                     FarmRepository farmRepository,
                                     PasswordEncoder passwordEncoder,
                                     @Value("${app.bootstrap.admin-email}") String adminEmail,
                                     @Value("${app.bootstrap.admin-password}") String adminPassword) {
        return args -> {
            Farm farm = farmRepository.findAll().stream().findFirst().orElseGet(() -> {
                Farm newFarm = new Farm();
                newFarm.setName("Default Smart Farm");
                return farmRepository.save(newFarm);
            });

            userRepository.findByEmailIgnoreCase(adminEmail).orElseGet(() -> {
                User user = new User();
                user.setName("System Admin");
                user.setEmail(adminEmail);
                user.setPasswordHash(passwordEncoder.encode(adminPassword));
                user.setRole(Role.ADMIN);
                user.setActive(true);
                user.setFarmId(farm.getId());
                return userRepository.save(user);
            });
        };
    }
}
