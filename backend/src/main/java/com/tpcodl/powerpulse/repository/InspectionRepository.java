package com.tpcodl.powerpulse.repository;

import com.tpcodl.powerpulse.entity.Inspection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface InspectionRepository extends JpaRepository<Inspection, Long> {

    Optional<Inspection> findByInspectionId(String inspectionId);

    List<Inspection> findByAssetId(Long assetId);

    List<Inspection> findByInspectorId(Long inspectorId);

    List<Inspection> findByInspectionDateBetween(LocalDate start, LocalDate end);

    List<Inspection> findByRequiresImmediateActionTrue();

    List<Inspection> findByConditionScoreLessThan(Integer threshold);
}
