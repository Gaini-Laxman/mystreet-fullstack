package com.mystreet.api.model;
import jakarta.persistence.*;import lombok.*;import java.math.BigDecimal;import java.time.Instant;import java.util.UUID;
@Entity @Getter @Setter @NoArgsConstructor
public class Product { @Id @GeneratedValue private UUID id; @Column(nullable=false) private String name; @Column(nullable=false) private String brand; @Column(length=1000) private String description; @Column(nullable=false) private BigDecimal price; private String imageUrl; private String sizesCsv; private int stockQty; private Instant createdAt=Instant.now(); }
