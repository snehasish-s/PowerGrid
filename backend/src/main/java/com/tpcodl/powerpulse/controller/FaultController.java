package com.tpcodl.powerpulse.controller;

import com.tpcodl.powerpulse.entity.Fault;
import com.tpcodl.powerpulse.enums.FaultSeverity;
import com.tpcodl.powerpulse.exception.ResourceNotFoundException;
import com.tpcodl.powerpulse.repository.FaultRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/faults")
public class FaultController {

    @Autowired
    private FaultRepository faultRepository;

    @GetMapping
    public List<Fault> getAllFaults() {
        return faultRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Fault> getFaultById(@PathVariable Long id) {
        Fault fault = faultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fault", "id", id));
        return ResponseEntity.ok(fault);
    }

    @GetMapping("/code/{faultId}")
    public ResponseEntity<Fault> getFaultByFaultId(@PathVariable String faultId) {
        Fault fault = faultRepository.findByFaultId(faultId)
                .orElseThrow(() -> new ResourceNotFoundException("Fault", "faultId", faultId));
        return ResponseEntity.ok(fault);
    }

    @GetMapping("/unresolved")
    public List<Fault> getUnresolvedFaults() {
        return faultRepository.findByIsResolvedFalse();
    }

    @GetMapping("/severity/{severity}")
    public List<Fault> getFaultsBySeverity(@PathVariable String severity) {
        return faultRepository.findBySeverity(FaultSeverity.valueOf(severity.toUpperCase()));
    }

    @GetMapping("/asset/{assetId}")
    public List<Fault> getFaultsByAsset(@PathVariable Long assetId) {
        return faultRepository.findByAssetId(assetId);
    }

    @PostMapping
    public Fault createFault(@Valid @RequestBody Fault fault) {
        if (fault.getReportedAt() == null) {
            fault.setReportedAt(LocalDateTime.now());
        }
        fault.setIsResolved(false);
        return faultRepository.save(fault);
    }

    @PutMapping("/{id}")
    public Fault updateFault(@PathVariable Long id, @Valid @RequestBody Fault faultDetails) {
        Fault fault = faultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fault", "id", id));

        fault.setFaultType(faultDetails.getFaultType());
        fault.setSeverity(faultDetails.getSeverity());
        fault.setDescription(faultDetails.getDescription());
        fault.setResolvedAt(faultDetails.getResolvedAt());
        fault.setResolutionNotes(faultDetails.getResolutionNotes());
        fault.setIsResolved(faultDetails.getIsResolved());
        fault.setAffectedCustomers(faultDetails.getAffectedCustomers());
        
        if (faultDetails.getIsResolved() && fault.getResolvedAt() == null) {
            fault.setResolvedAt(LocalDateTime.now());
        }

        return faultRepository.save(fault);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFault(@PathVariable Long id) {
        Fault fault = faultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Fault", "id", id));
        faultRepository.delete(fault);
        return ResponseEntity.ok().build();
    }
}
