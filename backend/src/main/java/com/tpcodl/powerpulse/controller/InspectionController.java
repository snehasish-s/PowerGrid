package com.tpcodl.powerpulse.controller;

import com.tpcodl.powerpulse.entity.Inspection;
import com.tpcodl.powerpulse.exception.ResourceNotFoundException;
import com.tpcodl.powerpulse.repository.InspectionRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/inspections")
public class InspectionController {

    @Autowired
    private InspectionRepository inspectionRepository;

    @GetMapping
    public List<Inspection> getAllInspections() {
        return inspectionRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Inspection> getInspectionById(@PathVariable Long id) {
        Inspection inspection = inspectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inspection", "id", id));
        return ResponseEntity.ok(inspection);
    }

    @GetMapping("/code/{inspectionId}")
    public ResponseEntity<Inspection> getInspectionByInspectionId(@PathVariable String inspectionId) {
        Inspection inspection = inspectionRepository.findByInspectionId(inspectionId)
                .orElseThrow(() -> new ResourceNotFoundException("Inspection", "inspectionId", inspectionId));
        return ResponseEntity.ok(inspection);
    }

    @GetMapping("/asset/{assetId}")
    public List<Inspection> getInspectionsByAsset(@PathVariable Long assetId) {
        return inspectionRepository.findByAssetId(assetId);
    }

    @GetMapping("/inspector/{inspectorId}")
    public List<Inspection> getInspectionsByInspector(@PathVariable Long inspectorId) {
        return inspectionRepository.findByInspectorId(inspectorId);
    }

    @GetMapping("/immediate-action")
    public List<Inspection> getInspectionsRequiringImmediateAction() {
        return inspectionRepository.findByRequiresImmediateActionTrue();
    }

    @PostMapping
    public Inspection createInspection(@Valid @RequestBody Inspection inspection) {
        if (inspection.getInspectionDate() == null) {
            inspection.setInspectionDate(LocalDate.now());
        }
        return inspectionRepository.save(inspection);
    }

    @PutMapping("/{id}")
    public Inspection updateInspection(@PathVariable Long id, @Valid @RequestBody Inspection inspectionDetails) {
        Inspection inspection = inspectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inspection", "id", id));

        inspection.setInspectionDate(inspectionDetails.getInspectionDate());
        inspection.setConditionScore(inspectionDetails.getConditionScore());
        inspection.setFindings(inspectionDetails.getFindings());
        inspection.setRecommendedActions(inspectionDetails.getRecommendedActions());
        inspection.setRequiresImmediateAction(inspectionDetails.getRequiresImmediateAction());
        inspection.setInspectionType(inspectionDetails.getInspectionType());
        inspection.setNextInspectionDate(inspectionDetails.getNextInspectionDate());

        return inspectionRepository.save(inspection);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteInspection(@PathVariable Long id) {
        Inspection inspection = inspectionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Inspection", "id", id));
        inspectionRepository.delete(inspection);
        return ResponseEntity.ok().build();
    }
}
