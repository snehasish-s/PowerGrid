package com.tpcodl.powerpulse.controller;

import com.tpcodl.powerpulse.enums.AssetStatus;
import com.tpcodl.powerpulse.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private FaultRepository faultRepository;

    @Autowired
    private MaintenanceRepository maintenanceRepository;

    @Autowired
    private OutageRepository outageRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @GetMapping("/metrics")
    public ResponseEntity<Map<String, Object>> getDashboardMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        // Counts
        metrics.put("totalAssets", assetRepository.count());
        metrics.put("activeFaults", faultRepository.countUnresolved());
        metrics.put("overdueMaintenance", maintenanceRepository.countOverdue());
        metrics.put("activeOutages", outageRepository.findByIsActiveTrue().size());
        
        // Sum of affected customers
        Long affectedCustomers = outageRepository.countTotalAffectedCustomers();
        metrics.put("affectedCustomers", affectedCustomers != null ? affectedCustomers : 0L);

        // Low stock items
        metrics.put("lowStockItems", inventoryRepository.findByIsLowStockTrue().size());

        // Asset health profile
        long operational = assetRepository.countByStatus(AssetStatus.OPERATIONAL);
        long degraded = assetRepository.countByStatus(AssetStatus.DEGRADED);
        long faulty = assetRepository.countByStatus(AssetStatus.FAULTY);
        long decommissioned = assetRepository.countByStatus(AssetStatus.DECOMMISSIONED);

        Map<String, Long> statusCounts = new HashMap<>();
        statusCounts.put("OPERATIONAL", operational);
        statusCounts.put("DEGRADED", degraded);
        statusCounts.put("FAULTY", faulty);
        statusCounts.put("DECOMMISSIONED", decommissioned);
        metrics.put("assetStatusDistribution", statusCounts);

        // Calculate average health score
        Double avgHealth = assetRepository.findAll().stream()
                .filter(a -> a.getIsActive())
                .mapToInt(a -> a.getHealthScore() != null ? a.getHealthScore() : 100)
                .average()
                .orElse(100.0);
        metrics.put("averageHealthScore", Math.round(avgHealth * 10.0) / 10.0);

        return ResponseEntity.ok(metrics);
    }
}
