package com.tpcodl.powerpulse.repository;

import com.tpcodl.powerpulse.entity.Prediction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PredictionRepository extends JpaRepository<Prediction, Long> {

    Optional<Prediction> findByPredictionId(String predictionId);

    List<Prediction> findByAssetId(Long assetId);

    List<Prediction> findByFailureProbabilityGreaterThan(Double threshold);

    List<Prediction> findByActionTakenFalse();

    @Query("SELECT p FROM Prediction p WHERE p.failureProbability > 0.7 AND p.actionTaken = false ORDER BY p.failureProbability DESC")
    List<Prediction> findHighRiskPredictions();
}
