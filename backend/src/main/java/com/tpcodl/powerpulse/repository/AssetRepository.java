package com.tpcodl.powerpulse.repository;

import com.tpcodl.powerpulse.entity.Asset;
import com.tpcodl.powerpulse.enums.AssetStatus;
import com.tpcodl.powerpulse.enums.AssetType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * JPA Repository for Asset entity operations.
 */
@Repository
public interface AssetRepository extends JpaRepository<Asset, Long> {

    Optional<Asset> findByAssetId(String assetId);

    List<Asset> findByZone(String zone);

    List<Asset> findByAssetType(AssetType assetType);

    List<Asset> findByStatus(AssetStatus status);

    List<Asset> findByZoneAndStatus(String zone, AssetStatus status);

    List<Asset> findByIsActiveTrue();

    List<Asset> findByHealthScoreLessThan(Integer threshold);

    @Query("SELECT COUNT(a) FROM Asset a WHERE a.status = :status AND a.isActive = true")
    Long countByStatus(AssetStatus status);

    @Query("SELECT a.zone, COUNT(a) FROM Asset a WHERE a.isActive = true GROUP BY a.zone")
    List<Object[]> countByZone();
}
