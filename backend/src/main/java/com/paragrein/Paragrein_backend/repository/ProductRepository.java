package com.paragrein.Paragrein_backend.repository;

import com.paragrein.Paragrein_backend.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Product findBySku(String sku);
    Product findByName(String name);
}
