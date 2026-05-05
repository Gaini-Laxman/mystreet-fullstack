package com.mystreet.api.controller;
import com.mystreet.api.dto.Dto.ProductRequest;import com.mystreet.api.model.Product;import com.mystreet.api.repo.ProductRepository;import com.mystreet.api.security.AuthService;import jakarta.servlet.http.HttpServletRequest;import jakarta.validation.Valid;import lombok.RequiredArgsConstructor;import org.springframework.web.bind.annotation.*;import java.util.*;import java.util.stream.*;
@RestController @RequestMapping("/api/products") @RequiredArgsConstructor
public class ProductController { private final ProductRepository repo; private final AuthService auth;
 @GetMapping List<Product> list(@RequestParam(required=false) String brand,@RequestParam(required=false) String size){ return repo.findAll().stream().filter(p->brand==null||p.getBrand().equalsIgnoreCase(brand)).filter(p->size==null||(p.getSizesCsv()!=null&&Arrays.asList(p.getSizesCsv().split(",")).contains(size))).toList();}
 @GetMapping("/{id}") Product one(@PathVariable UUID id){return repo.findById(id).orElseThrow();}
 @PostMapping Product create(@Valid @RequestBody ProductRequest r,HttpServletRequest req){auth.requireAdmin(req);return repo.save(map(new Product(),r));}
 @PutMapping("/{id}") Product update(@PathVariable UUID id,@Valid @RequestBody ProductRequest r,HttpServletRequest req){auth.requireAdmin(req);return repo.save(map(repo.findById(id).orElseThrow(),r));}
 @DeleteMapping("/{id}") void delete(@PathVariable UUID id,HttpServletRequest req){auth.requireAdmin(req);repo.deleteById(id);} 
 private Product map(Product p,ProductRequest r){p.setName(r.name());p.setBrand(r.brand());p.setDescription(r.description());p.setPrice(r.price());p.setImageUrl(r.imageUrl());p.setSizesCsv(r.sizesCsv());p.setStockQty(r.stockQty());return p;}
}
