package com.tpcodl.powerpulse.repository;

import com.tpcodl.powerpulse.entity.Outage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OutageRepository extends JpaRepository<Outage, Long> {

    Optional<Outage> findByOutageId(String outageId);

    List<Outage> findByZone(String zone);

    List<Outage> findByIsActiveTrue();

    @Query("SELECT SUM(o.affectedCustomers) FROM Outage o WHERE o.isActive = true")
    Long countTotalAffectedCustomers();

    @Query("SELECT o.zone, COUNT(o) FROM Outage o WHERE o.isActive = true GROUP BY o.zone")
    List<Object[]> countActiveByZone();
}
