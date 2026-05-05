package com.mystreet.api.model;
import jakarta.persistence.*;import lombok.*;import java.math.BigDecimal;import java.util.UUID;
@Entity @Getter @Setter @NoArgsConstructor
public class OrderItem { @Id @GeneratedValue private UUID id; @ManyToOne(optional=false) private Order order; @ManyToOne(optional=false) private Product product; private String size; private int quantity; private BigDecimal price; }
