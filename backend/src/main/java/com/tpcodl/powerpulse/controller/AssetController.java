package com.tpcodl.powerpulse.controller;

import com.tpcodl.powerpulse.entity.Asset;
import com.tpcodl.powerpulse.enums.AssetStatus;
import com.tpcodl.powerpulse.enums.AssetType;
import com.tpcodl.powerpulse.exception.ResourceNotFoundException;
import com.tpcodl.powerpulse.repository.AssetRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
public class AssetController {

    @Autowired
    private AssetRepository assetRepository;

    @GetMapping
    public List<Asset> getAllAssets() {
        return assetRepository.findByIsActiveTrue();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Asset> getAssetById(@PathVariable Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset", "id", id));
        return ResponseEntity.ok(asset);
    }

    @GetMapping("/code/{assetId}")
    public ResponseEntity<Asset> getAssetByAssetId(@PathVariable String assetId) {
        Asset asset = assetRepository.findByAssetId(assetId)
                .orElseThrow(() -> new ResourceNotFoundException("Asset", "assetId", assetId));
        return ResponseEntity.ok(asset);
    }

    @GetMapping("/zone/{zone}")
    public List<Asset> getAssetsByZone(@PathVariable String zone) {
        return assetRepository.findByZone(zone);
    }

    @GetMapping("/type/{type}")
    public List<Asset> getAssetsByType(@PathVariable String type) {
        return assetRepository.findByAssetType(AssetType.valueOf(type.toUpperCase()));
    }

    @GetMapping("/status/{status}")
    public List<Asset> getAssetsByStatus(@PathVariable String status) {
        return assetRepository.findByStatus(AssetStatus.valueOf(status.toUpperCase()));
    }

    @PostMapping
    public Asset createAsset(@Valid @RequestBody Asset asset) {
        asset.setIsActive(true);
        return assetRepository.save(asset);
    }

    @PutMapping("/{id}")
    public Asset updateAsset(@PathVariable Long id, @Valid @RequestBody Asset assetDetails) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset", "id", id));

        asset.setAssetName(assetDetails.getAssetName());
        asset.setAssetType(assetDetails.getAssetType());
        asset.setStatus(assetDetails.getStatus());
        asset.setLocation(assetDetails.getLocation());
        asset.setZone(assetDetails.getZone());
        asset.setLatitude(assetDetails.getLatitude());
        asset.setLongitude(assetDetails.getLongitude());
        asset.setManufacturer(assetDetails.getManufacturer());
        asset.setModel(assetDetails.getModel());
        asset.setInstallationDate(assetDetails.getInstallationDate());
        asset.setRatedCapacity(assetDetails.getRatedCapacity());
        asset.setVoltageLevel(assetDetails.getVoltageLevel());
        asset.setHealthScore(assetDetails.getHealthScore());

        return assetRepository.save(asset);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAsset(@PathVariable Long id) {
        Asset asset = assetRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Asset", "id", id));
        asset.setIsActive(false);
        assetRepository.save(asset);
        return ResponseEntity.ok().build();
    }
}
