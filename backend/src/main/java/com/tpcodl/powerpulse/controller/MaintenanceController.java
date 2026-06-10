package com.tpcodl.powerpulse.controller;

import com.tpcodl.powerpulse.entity.Maintenance;
import com.tpcodl.powerpulse.enums.MaintenanceStatus;
import com.tpcodl.powerpulse.enums.MaintenanceType;
import com.tpcodl.powerpulse.exception.ResourceNotFoundException;
import com.tpcodl.powerpulse.repository.MaintenanceRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance")
public class MaintenanceController {

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @GetMapping
    public List<Maintenance> getAllMaintenance() {
        return maintenanceRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Maintenance> getMaintenanceById(@PathVariable Long id) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance", "id", id));
        return ResponseEntity.ok(maintenance);
    }

    @GetMapping("/workorder/{workOrderId}")
    public ResponseEntity<Maintenance> getMaintenanceByWorkOrderId(@PathVariable String workOrderId) {
        Maintenance maintenance = maintenanceRepository.findByWorkOrderId(workOrderId)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance", "workOrderId", workOrderId));
        return ResponseEntity.ok(maintenance);
    }

    @GetMapping("/status/{status}")
    public List<Maintenance> getMaintenanceByStatus(@PathVariable String status) {
        return maintenanceRepository.findByStatus(MaintenanceStatus.valueOf(status.toUpperCase()));
    }

    @GetMapping("/type/{type}")
    public List<Maintenance> getMaintenanceByType(@PathVariable String type) {
        return maintenanceRepository.findByMaintenanceType(MaintenanceType.valueOf(type.toUpperCase()));
    }

    @GetMapping("/asset/{assetId}")
    public List<Maintenance> getMaintenanceByAsset(@PathVariable Long assetId) {
        return maintenanceRepository.findByAssetId(assetId);
    }

    @PostMapping
    public Maintenance createMaintenance(@Valid @RequestBody Maintenance maintenance) {
        if (maintenance.getStatus() == null) {
            maintenance.setStatus(MaintenanceStatus.SCHEDULED);
        }
        return maintenanceRepository.save(maintenance);
    }

    @PutMapping("/{id}")
    public Maintenance updateMaintenance(@PathVariable Long id, @Valid @RequestBody Maintenance maintenanceDetails) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance", "id", id));

        maintenance.setMaintenanceType(maintenanceDetails.getMaintenanceType());
        maintenance.setStatus(maintenanceDetails.getStatus());
        maintenance.setTitle(maintenanceDetails.getTitle());
        maintenance.setDescription(maintenanceDetails.getDescription());
        maintenance.setScheduledDate(maintenanceDetails.getScheduledDate());
        maintenance.setCompletedDate(maintenanceDetails.getCompletedDate());
        maintenance.setEstimatedCost(maintenanceDetails.getEstimatedCost());
        maintenance.setActualCost(maintenanceDetails.getActualCost());
        maintenance.setPriority(maintenanceDetails.getPriority());
        maintenance.setNotes(maintenanceDetails.getNotes());

        return maintenanceRepository.save(maintenance);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMaintenance(@PathVariable Long id) {
        Maintenance maintenance = maintenanceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Maintenance", "id", id));
        maintenanceRepository.delete(maintenance);
        return ResponseEntity.ok().build();
    }
}
