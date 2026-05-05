package com.mystreet.api.repo;
import com.mystreet.api.model.Order;import org.springframework.data.jpa.repository.JpaRepository;import java.util.UUID;
public interface OrderRepository extends JpaRepository<Order, UUID> {  }
