package com.tpcodl.powerpulse.repository;

import com.tpcodl.powerpulse.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    Optional<Inventory> findByItemCode(String itemCode);

    List<Inventory> findByCategory(String category);

    List<Inventory> findByWarehouse(String warehouse);

    List<Inventory> findByIsLowStockTrue();

    List<Inventory> findByQuantityLessThanEqual(Integer quantity);
}
