package com.mystreet.api.dto;
import jakarta.validation.constraints.*;import java.math.BigDecimal;import java.util.*;
public class Dto {
 public record RegisterRequest(@Email @NotBlank String email,@Size(min=6) String password){}
 public record LoginRequest(@Email @NotBlank String email,@NotBlank String password){}
 public record LoginResponse(String token,String email,boolean admin){}
 public record ProductRequest(@NotBlank String name,@NotBlank String brand,String description,@NotNull BigDecimal price,String imageUrl,String sizesCsv,@Min(0) int stockQty){}
 public record OrderLine(@NotNull UUID productId,@NotBlank String size,@Min(1) int quantity){}
 public record OrderRequest(@NotEmpty List<OrderLine> items,@NotBlank String shippingAddress,@NotBlank String paymentMode){}
}
