package com.tpcodl.powerpulse.repository;

import com.tpcodl.powerpulse.entity.Maintenance;
import com.tpcodl.powerpulse.enums.MaintenanceStatus;
import com.tpcodl.powerpulse.enums.MaintenanceType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MaintenanceRepository extends JpaRepository<Maintenance, Long> {

    Optional<Maintenance> findByWorkOrderId(String workOrderId);

    List<Maintenance> findByStatus(MaintenanceStatus status);

    List<Maintenance> findByMaintenanceType(MaintenanceType type);

    List<Maintenance> findByAssetId(Long assetId);

    List<Maintenance> findByAssignedToId(Long userId);

    List<Maintenance> findByScheduledDateBetween(LocalDate start, LocalDate end);

    @Query("SELECT m.status, COUNT(m) FROM Maintenance m GROUP BY m.status")
    List<Object[]> countByStatus();

    @Query("SELECT COUNT(m) FROM Maintenance m WHERE m.status = 'OVERDUE'")
    Long countOverdue();
}
