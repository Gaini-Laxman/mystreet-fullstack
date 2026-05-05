package com.mystreet.api.model;
import jakarta.persistence.*;import lombok.*;import java.math.BigDecimal;import java.time.Instant;import java.util.*;
@Entity @Table(name="orders") @Getter @Setter @NoArgsConstructor
public class Order { @Id @GeneratedValue private UUID id; @ManyToOne(optional=false) private User user; @Column(nullable=false,length=1000) private String shippingAddress; private String paymentMode; private String status="PLACED"; private BigDecimal total=BigDecimal.ZERO; private Instant createdAt=Instant.now(); @OneToMany(mappedBy="order",cascade=CascadeType.ALL,orphanRemoval=true) private List<OrderItem> items=new ArrayList<>(); }
