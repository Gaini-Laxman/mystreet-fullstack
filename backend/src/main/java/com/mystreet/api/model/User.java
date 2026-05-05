package com.mystreet.api.model;
import jakarta.persistence.*;import lombok.*;import java.time.Instant;import java.util.UUID;
@Entity @Table(name="users") @Getter @Setter @NoArgsConstructor
public class User { @Id @GeneratedValue private UUID id; @Column(unique=true,nullable=false) private String email; @Column(nullable=false) private String passwordHash; private boolean admin; private Instant createdAt=Instant.now(); }
