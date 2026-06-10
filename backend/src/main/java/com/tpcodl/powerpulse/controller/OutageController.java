package com.tpcodl.powerpulse.controller;

import com.tpcodl.powerpulse.entity.Outage;
import com.tpcodl.powerpulse.exception.ResourceNotFoundException;
import com.tpcodl.powerpulse.repository.OutageRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/outages")
public class OutageController {

    @Autowired
    private OutageRepository outageRepository;

    @GetMapping
    public List<Outage> getAllOutages() {
        return outageRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Outage> getOutageById(@PathVariable Long id) {
        Outage outage = outageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Outage", "id", id));
        return ResponseEntity.ok(outage);
    }

    @GetMapping("/active")
    public List<Outage> getActiveOutages() {
        return outageRepository.findByIsActiveTrue();
    }

    @GetMapping("/zone/{zone}")
    public List<Outage> getOutagesByZone(@PathVariable String zone) {
        return outageRepository.findByZone(zone);
    }

    @PostMapping
    public Outage createOutage(@Valid @RequestBody Outage outage) {
        if (outage.getStartTime() == null) {
            outage.setStartTime(LocalDateTime.now());
        }
        outage.setIsActive(true);
        return outageRepository.save(outage);
    }

    @PutMapping("/{id}")
    public Outage updateOutage(@PathVariable Long id, @Valid @RequestBody Outage outageDetails) {
        Outage outage = outageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Outage", "id", id));

        outage.setZone(outageDetails.getZone());
        outage.setAffectedArea(outageDetails.getAffectedArea());
        outage.setAffectedCustomers(outageDetails.getAffectedCustomers());
        outage.setStartTime(outageDetails.getStartTime());
        outage.setEndTime(outageDetails.getEndTime());
        outage.setCause(outageDetails.getCause());
        outage.setOutageType(outageDetails.getOutageType());
        outage.setIsActive(outageDetails.getIsActive());
        outage.setRestorationNotes(outageDetails.getRestorationNotes());

        if (outageDetails.getEndTime() != null) {
            outage.setIsActive(false);
        }

        return outageRepository.save(outage);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOutage(@PathVariable Long id) {
        Outage outage = outageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Outage", "id", id));
        outageRepository.delete(outage);
        return ResponseEntity.ok().build();
    }
}
