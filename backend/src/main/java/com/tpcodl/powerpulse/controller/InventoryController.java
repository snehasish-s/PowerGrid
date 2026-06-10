package com.tpcodl.powerpulse.controller;

import com.tpcodl.powerpulse.entity.Inventory;
import com.tpcodl.powerpulse.exception.ResourceNotFoundException;
import com.tpcodl.powerpulse.repository.InventoryRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    @Autowired
    private InventoryRepository inventoryRepository;

    @GetMapping
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inventory> getInventoryById(@PathVariable Long id) {
        Inventory item = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "id", id));
        return ResponseEntity.ok(item);
    }

    @GetMapping("/code/{itemCode}")
    public ResponseEntity<Inventory> getInventoryByItemCode(@PathVariable String itemCode) {
        Inventory item = inventoryRepository.findByItemCode(itemCode)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "itemCode", itemCode));
        return ResponseEntity.ok(item);
    }

    @GetMapping("/category/{category}")
    public List<Inventory> getInventoryByCategory(@PathVariable String category) {
        return inventoryRepository.findByCategory(category);
    }

    @GetMapping("/low-stock")
    public List<Inventory> getLowStockInventory() {
        return inventoryRepository.findByIsLowStockTrue();
    }

    @PostMapping
    public Inventory createInventory(@Valid @RequestBody Inventory item) {
        item.setIsLowStock(item.getQuantity() <= item.getReorderLevel());
        return inventoryRepository.save(item);
    }

    @PutMapping("/{id}")
    public Inventory updateInventory(@PathVariable Long id, @Valid @RequestBody Inventory itemDetails) {
        Inventory item = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "id", id));

        item.setItemName(itemDetails.getItemName());
        item.setCategory(itemDetails.getCategory());
        item.setQuantity(itemDetails.getQuantity());
        item.setUnit(itemDetails.getUnit());
        item.setReorderLevel(itemDetails.getReorderLevel());
        item.setUnitPrice(itemDetails.getUnitPrice());
        item.setWarehouse(itemDetails.getWarehouse());
        item.setSupplier(itemDetails.getSupplier());
        item.setIsLowStock(itemDetails.getQuantity() <= itemDetails.getReorderLevel());

        return inventoryRepository.save(item);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInventory(@PathVariable Long id) {
        Inventory item = inventoryRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inventory", "id", id));
        inventoryRepository.delete(item);
        return ResponseEntity.ok().build();
    }
}
