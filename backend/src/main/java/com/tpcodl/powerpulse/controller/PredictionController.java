package com.tpcodl.powerpulse.controller;

import com.tpcodl.powerpulse.entity.Asset;
import com.tpcodl.powerpulse.entity.Prediction;
import com.tpcodl.powerpulse.exception.ResourceNotFoundException;
import com.tpcodl.powerpulse.repository.AssetRepository;
import com.tpcodl.powerpulse.repository.PredictionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("/api/predictions")
public class PredictionController {

    @Autowired
    private PredictionRepository predictionRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${app.ml-service.url}")
    private String mlServiceUrl;

    @GetMapping
    public List<Prediction> getAllPredictions() {
        return predictionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prediction> getPredictionById(@PathVariable Long id) {
        Prediction prediction = predictionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prediction", "id", id));
        return ResponseEntity.ok(prediction);
    }

    @GetMapping("/asset/{assetId}")
    public List<Prediction> getPredictionsByAsset(@PathVariable Long assetId) {
        return predictionRepository.findByAssetId(assetId);
    }

    @GetMapping("/high-risk")
    public List<Prediction> getHighRiskPredictions() {
        return predictionRepository.findHighRiskPredictions();
    }

    @PostMapping("/trigger/{assetId}")
    public ResponseEntity<Prediction> triggerAssetPrediction(@PathVariable Long assetId) {
        Asset asset = assetRepository.findById(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset", "id", assetId));

        // Construct request payload for Python ML Service
        Map<String, Object> requestPayload = new HashMap<>();
        requestPayload.put("asset_id", asset.getAssetId());
        requestPayload.put("type", asset.getAssetType().name());
        requestPayload.put("status", asset.getStatus().name());
        
        // Calculate age
        double ageYears = 5.0;
        if (asset.getInstallationDate() != null) {
            ageYears = LocalDate.now().getYear() - asset.getInstallationDate().getYear();
            if (ageYears < 0) ageYears = 0;
        }
        requestPayload.put("age_years", ageYears);
        
        // Load factor: operational = normal, degraded = higher, faulty = critical
        double loadFactor = 60.0;
        if (asset.getStatus().name().equals("DEGRADED")) {
            loadFactor = 88.0;
        } else if (asset.getStatus().name().equals("FAULTY")) {
            loadFactor = 110.0;
        }
        requestPayload.put("load_factor", loadFactor);

        if (asset.getAssetType().name().equals("TRANSFORMER")) {
            requestPayload.put("oil_temperature", asset.getStatus().name().equals("DEGRADED") ? 98.0 : 75.0);
        }
        
        requestPayload.put("vibration_level", asset.getStatus().name().equals("DEGRADED") ? 0.25 : 0.05);
        
        double lastMaintDays = 90.0;
        if (asset.getLastMaintenanceDate() != null) {
            lastMaintDays = java.time.temporal.ChronoUnit.DAYS.between(asset.getLastMaintenanceDate(), LocalDate.now());
            if (lastMaintDays < 0) lastMaintDays = 0;
        }
        requestPayload.put("last_maintenance_days", lastMaintDays);

        Double failureProbability = 0.15;
        String riskLevel = "LOW";
        String predictedDateStr = LocalDate.now().plusDays(90).toString();
        String modelName = "FallbackHeuristic-v1.0";
        List<String> criticalFeatures = Arrays.asList("Normal aging process");

        try {
            // Call Python ML service
            String url = mlServiceUrl + "/predict";
            Map<String, Object> response = restTemplate.postForObject(url, requestPayload, Map.class);
            if (response != null) {
                failureProbability = ((Number) response.get("failureProbability")).doubleValue();
                riskLevel = (String) response.get("riskLevel");
                predictedDateStr = (String) response.get("predictedDate");
                modelName = (String) response.get("model");
                criticalFeatures = (List<String>) response.get("criticalFeatures");
            }
        } catch (Exception e) {
            // Log error and fallback to heuristic
            System.err.println("Error calling ML service, falling back to heuristic: " + e.getMessage());
            // Safe fallback logic
            if (asset.getStatus().name().equals("FAULTY")) {
                failureProbability = 0.92;
                riskLevel = "CRITICAL";
                predictedDateStr = LocalDate.now().plusDays(2).toString();
            } else if (asset.getStatus().name().equals("DEGRADED")) {
                failureProbability = 0.65;
                riskLevel = "HIGH";
                predictedDateStr = LocalDate.now().plusDays(15).toString();
            }
        }

        LocalDate predictedFailureDate = LocalDate.parse(predictedDateStr);

        // Save prediction result
        Prediction prediction = Prediction.builder()
                .predictionId("PRD-" + System.currentTimeMillis() / 1000)
                .failureProbability(failureProbability)
                .predictedFailureDate(predictedFailureDate)
                .failureMode(asset.getAssetType().name() + " Failure Mode " + (asset.getStatus().name().equals("DEGRADED") ? "B" : "A"))
                .confidenceScore(0.85)
                .modelVersion(modelName)
                .recommendedAction(riskLevel.equals("CRITICAL") ? "Trigger emergency maintenance immediately" : "Schedule inspection within next cycle")
                .predictionHorizonDays(30)
                .actionTaken(false)
                .asset(asset)
                .build();

        Prediction saved = predictionRepository.save(prediction);
        return ResponseEntity.ok(saved);
    }

    @PostMapping("/{id}/action")
    public ResponseEntity<Prediction> markActionTaken(@PathVariable Long id) {
        Prediction prediction = predictionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Prediction", "id", id));
        prediction.setActionTaken(true);
        Prediction saved = predictionRepository.save(prediction);
        return ResponseEntity.ok(saved);
    }
}
