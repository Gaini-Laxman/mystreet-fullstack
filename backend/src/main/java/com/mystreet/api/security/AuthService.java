package com.mystreet.api.security;
import com.mystreet.api.model.User;import com.mystreet.api.repo.UserRepository;import jakarta.servlet.http.HttpServletRequest;import lombok.RequiredArgsConstructor;import org.springframework.stereotype.Service;import java.nio.charset.StandardCharsets;import java.util.Base64;
@Service @RequiredArgsConstructor
public class AuthService { private final UserRepository users;
 public String token(User u){ return Base64.getEncoder().encodeToString((u.getEmail()+":"+u.isAdmin()).getBytes(StandardCharsets.UTF_8)); }
 public User current(HttpServletRequest req){ String h=req.getHeader("Authorization"); if(h==null||!h.startsWith("Bearer ")) throw new RuntimeException("Unauthorized"); try{String email=new String(Base64.getDecoder().decode(h.substring(7)),StandardCharsets.UTF_8).split(":")[0]; return users.findByEmail(email).orElseThrow();}catch(Exception e){throw new RuntimeException("Unauthorized");}}
 public void requireAdmin(HttpServletRequest req){ if(!current(req).isAdmin()) throw new RuntimeException("Forbidden"); }
}
