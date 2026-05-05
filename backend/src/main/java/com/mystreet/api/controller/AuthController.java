package com.mystreet.api.controller;
import com.mystreet.api.dto.Dto.*;import com.mystreet.api.model.User;import com.mystreet.api.repo.UserRepository;import com.mystreet.api.security.AuthService;import jakarta.validation.Valid;import lombok.RequiredArgsConstructor;import org.springframework.http.*;import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/auth") @RequiredArgsConstructor
public class AuthController { private final UserRepository users; private final BCryptPasswordEncoder encoder; private final AuthService auth;
 @PostMapping("/register") ResponseEntity<?> register(@Valid @RequestBody RegisterRequest r){ if(users.existsByEmail(r.email())) return ResponseEntity.badRequest().body("Email already exists"); User u=new User();u.setEmail(r.email());u.setPasswordHash(encoder.encode(r.password()));users.save(u);return ResponseEntity.status(201).body(new LoginResponse(auth.token(u),u.getEmail(),u.isAdmin()));}
 @PostMapping("/login") LoginResponse login(@Valid @RequestBody LoginRequest r){ User u=users.findByEmail(r.email()).orElseThrow(); if(!encoder.matches(r.password(),u.getPasswordHash())) throw new RuntimeException("Invalid credentials"); return new LoginResponse(auth.token(u),u.getEmail(),u.isAdmin());}
}
