package com.tpcodl.powerpulse.config;

import com.tpcodl.powerpulse.entity.*;
import com.tpcodl.powerpulse.enums.*;
import com.tpcodl.powerpulse.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private FaultRepository faultRepository;

    @Autowired
    private OutageRepository outageRepository;

    @Autowired
    private InventoryRepository inventoryRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedAssets();
        seedFaults();
        seedOutages();
        seedInventory();
    }

    private void seedUsers() {
        if (userRepository.count() > 0) {
            return;
        }

        User admin = User.builder()
                .username("admin")
                .email("admin@tpcodl.com")
                .password(passwordEncoder.encode("Admin@2026!"))
                .fullName("System Administrator")
                .phone("+91-9000000001")
                .role(Role.ADMIN)
                .zone("Bhubaneswar")
                .employeeId("EMP-10001")
                .isActive(true)
                .build();

        User engineer = User.builder()
                .username("rajesh.engineer")
                .email("engineer@tpcodl.com")
                .password(passwordEncoder.encode("Engineer@2026!"))
                .fullName("Rajesh Kumar Patel")
                .phone("+91-9000000002")
                .role(Role.FIELD_ENGINEER)
                .zone("Cuttack")
                .employeeId("EMP-10042")
                .isActive(true)
                .build();

        User manager = User.builder()
                .username("priya.manager")
                .email("manager@tpcodl.com")
                .password(passwordEncoder.encode("Manager@2026!"))
                .fullName("Priya Sharma")
                .phone("+91-9000000003")
                .role(Role.MAINTENANCE_MANAGER)
                .zone("Bhubaneswar")
                .employeeId("EMP-10015")
                .isActive(true)
                .build();

        User executive = User.builder()
                .username("amit.executive")
                .email("executive@tpcodl.com")
                .password(passwordEncoder.encode("Executive@2026!"))
                .fullName("Amit Mohanty")
                .phone("+91-9000000004")
                .role(Role.EXECUTIVE)
                .zone("Bhubaneswar")
                .employeeId("EMP-10005")
                .isActive(true)
                .build();

        userRepository.saveAll(List.of(admin, engineer, manager, executive));
        System.out.println("Seeded default user accounts successfully.");
    }

    private void seedAssets() {
        if (assetRepository.count() > 0) {
            return;
        }

        Asset tr1 = Asset.builder()
                .assetId("TR-1001")
                .assetName("33/11kV Power Transformer — Moradabad Sector-5")
                .assetType(AssetType.TRANSFORMER)
                .status(AssetStatus.OPERATIONAL)
                .location("Moradabad Sector-5, Near SBI Bank")
                .zone("Bhubaneswar")
                .latitude(20.2961)
                .longitude(85.8245)
                .manufacturer("Crompton Greaves")
                .model("CGL 33kV 5MVA ONAN")
                .installationDate(LocalDate.of(2019, 3, 15))
                .ratedCapacity("5 MVA")
                .voltageLevel("33kV")
                .healthScore(92)
                .isActive(true)
                .build();

        Asset tr2 = Asset.builder()
                .assetId("TR-1002")
                .assetName("33/11kV Distribution Transformer — Saheed Nagar")
                .assetType(AssetType.TRANSFORMER)
                .status(AssetStatus.DEGRADED)
                .location("Saheed Nagar, Main Road Junction")
                .zone("Bhubaneswar")
                .latitude(20.2856)
                .longitude(85.8462)
                .manufacturer("ABB India")
                .model("ABB 33kV 3MVA ONAN")
                .installationDate(LocalDate.of(2017, 6, 20))
                .ratedCapacity("3 MVA")
                .voltageLevel("33kV")
                .healthScore(64)
                .isActive(true)
                .build();

        Asset fd1 = Asset.builder()
                .assetId("FD-2001")
                .assetName("11kV Feeder — Patia Industrial")
                .assetType(AssetType.FEEDER)
                .status(AssetStatus.OPERATIONAL)
                .location("Patia Industrial Area, KIIT Road")
                .zone("Bhubaneswar")
                .latitude(20.3540)
                .longitude(85.8190)
                .manufacturer("Siemens India")
                .model("Siemens 11kV HV")
                .installationDate(LocalDate.of(2020, 1, 10))
                .ratedCapacity("400A")
                .voltageLevel("11kV")
                .healthScore(88)
                .isActive(true)
                .build();

        Asset fd3 = Asset.builder()
                .assetId("FD-2003")
                .assetName("11kV Feeder — Cuttack Ring Main")
                .assetType(AssetType.FEEDER)
                .status(AssetStatus.FAULTY)
                .location("Cuttack Ring Road, Near Barabati")
                .zone("Cuttack")
                .latitude(20.4625)
                .longitude(85.8828)
                .manufacturer("L&T Electrical")
                .model("LT 11kV RMU")
                .installationDate(LocalDate.of(2018, 9, 5))
                .ratedCapacity("630A")
                .voltageLevel("11kV")
                .healthScore(35)
                .isActive(true)
                .build();

        Asset pl = Asset.builder()
                .assetId("PL-3045")
                .assetName("RCC Pole — Mancheswar Colony")
                .assetType(AssetType.POLE)
                .status(AssetStatus.OPERATIONAL)
                .location("Mancheswar Industrial Estate")
                .zone("Bhubaneswar")
                .latitude(20.3100)
                .longitude(85.8380)
                .manufacturer("Odisha Cement")
                .model("RCC 9m Standard")
                .installationDate(LocalDate.of(2016, 4, 12))
                .ratedCapacity("N/A")
                .voltageLevel("0.4kV")
                .healthScore(78)
                .isActive(true)
                .build();

        Asset mt = Asset.builder()
                .assetId("MT-4012")
                .assetName("Smart Meter — Jharpada Residential")
                .assetType(AssetType.METER)
                .status(AssetStatus.OPERATIONAL)
                .location("Jharpada Housing Board Colony")
                .zone("Bhubaneswar")
                .latitude(20.2740)
                .longitude(85.8100)
                .manufacturer("Genus Power")
                .model("Genus Smart 3-Phase")
                .installationDate(LocalDate.of(2023, 2, 28))
                .ratedCapacity("100A")
                .voltageLevel("0.4kV")
                .healthScore(95)
                .isActive(true)
                .build();

        Asset sg = Asset.builder()
                .assetId("SG-5008")
                .assetName("33kV SF6 Circuit Breaker — Berhampur SS")
                .assetType(AssetType.SWITCHGEAR)
                .status(AssetStatus.OPERATIONAL)
                .location("Berhampur 132kV Substation")
                .zone("Berhampur")
                .latitude(19.3110)
                .longitude(84.7940)
                .manufacturer("Schneider Electric")
                .model("SE SF6 33kV")
                .installationDate(LocalDate.of(2021, 7, 15))
                .ratedCapacity("1250A")
                .voltageLevel("33kV")
                .healthScore(90)
                .isActive(true)
                .build();

        Asset cb = Asset.builder()
                .assetId("CB-6021")
                .assetName("11kV XLPE Underground Cable — Sambalpur")
                .assetType(AssetType.CABLE)
                .status(AssetStatus.DEGRADED)
                .location("Sambalpur City Center, Budharaja")
                .zone("Sambalpur")
                .latitude(21.4669)
                .longitude(83.9812)
                .manufacturer("Havells India")
                .model("Havells 11kV 3C XLPE")
                .installationDate(LocalDate.of(2015, 11, 22))
                .ratedCapacity("300 sqmm")
                .voltageLevel("11kV")
                .healthScore(55)
                .isActive(true)
                .build();

        assetRepository.saveAll(List.of(tr1, tr2, fd1, fd3, pl, mt, sg, cb));
        System.out.println("Seeded grid assets successfully.");
    }

    private void seedFaults() {
        if (faultRepository.count() > 0) {
            return;
        }

        Asset asset = assetRepository.findByAssetId("TR-1002").orElse(null);
        User reporter = userRepository.findByUsername("rajesh.engineer").orElse(null);

        if (asset != null) {
            Fault fault = Fault.builder()
                    .faultId("FLT-20260601-001")
                    .faultType("Oil Leakage")
                    .severity(FaultSeverity.HIGH)
                    .description("Transformer oil level dropping slowly, leakage spotted at valve B.")
                    .reportedAt(LocalDateTime.now().minusDays(3))
                    .isResolved(false)
                    .affectedCustomers(120)
                    .asset(asset)
                    .reportedBy(reporter)
                    .build();

            faultRepository.save(fault);
            System.out.println("Seeded active faults successfully.");
        }
    }

    private void seedOutages() {
        if (outageRepository.count() > 0) {
            return;
        }

        Asset asset = assetRepository.findByAssetId("FD-2003").orElse(null);

        Outage outage = Outage.builder()
                .outageId("OUT-BHU-20260609-001")
                .zone("Bhubaneswar")
                .affectedArea("Patia Sector-2")
                .affectedCustomers(340)
                .startTime(LocalDateTime.now().minusHours(4))
                .cause("Transformer Overheating")
                .outageType("Emergency")
                .isActive(true)
                .asset(asset)
                .build();

        outageRepository.save(outage);
        System.out.println("Seeded outages successfully.");
    }

    private void seedInventory() {
        if (inventoryRepository.count() > 0) {
            return;
        }

        Inventory item = Inventory.builder()
                .itemCode("INV-BHU-001")
                .itemName("Transformer Oil (Servo Electra-21)")
                .category("Transformer Parts")
                .quantity(5)
                .unit("Litres")
                .reorderLevel(10)
                .unitPrice(150.0)
                .warehouse("Bhubaneswar Central Warehouse")
                .supplier("Indian Oil Corp")
                .isLowStock(true)
                .build();

        inventoryRepository.save(item);
        System.out.println("Seeded inventory successfully.");
    }
}
