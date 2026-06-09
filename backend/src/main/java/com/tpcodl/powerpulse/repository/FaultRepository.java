package com.tpcodl.powerpulse.repository;

import com.tpcodl.powerpulse.entity.Fault;
import com.tpcodl.powerpulse.enums.FaultSeverity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface FaultRepository extends JpaRepository<Fault, Long> {

    Optional<Fault> findByFaultId(String faultId);

    List<Fault> findBySeverity(FaultSeverity severity);

    List<Fault> findByIsResolvedFalse();

    List<Fault> findByAssetId(Long assetId);

    List<Fault> findByReportedAtBetween(LocalDateTime start, LocalDateTime end);

    @Query("SELECT f.severity, COUNT(f) FROM Fault f GROUP BY f.severity")
    List<Object[]> countBySeverity();

    @Query("SELECT COUNT(f) FROM Fault f WHERE f.isResolved = false")
    Long countUnresolved();
}
