# PowerPulse AI — Final Phase Implementation Plan

Provide a comprehensive solution to complete all remaining features of the **PowerPulse AI** platform. The final steps will implement the missing frontend user interfaces for **Inventory Management** and **Outage Monitoring**, connect them to their existing backend REST endpoints, integrate them into the global layout (Sidebar and Router), and verify the database configuration.

## User Review Required

> [!IMPORTANT]
> **Database Environment**:
> 1. By default, the application runs using **Docker Compose** which spins up a dedicated MySQL container (`powerpulse-mysql`) using credentials from `.env` (`powerpulse_admin` / `TpCoDL@2026!`).
> 2. If you intend to run the backend *locally outside Docker* (via `mvn spring-boot:run`), please ensure you have a running MySQL server on localhost port 3306, with a database named `powerpulse_db`, and that your MySQL credentials match those in `.env` and `application.properties`. If they differ, please provide them so we can update the config.

## Open Questions

> [!IMPORTANT]
> **Role Access Clarification**:
> - Currently, we propose that **Inventory Management** is accessible to `['ADMIN', 'MAINTENANCE_MANAGER']` roles.
> - **Outage Monitoring** is proposed to be visible/editable for `['ADMIN', 'FIELD_ENGINEER', 'MAINTENANCE_MANAGER', 'EXECUTIVE']` roles.
> Let us know if you want to restrict or expand these role policies.

---

## Proposed Changes

### 1. React Frontend Pages & Components (`/frontend`)

#### [NEW] [InventoryPage.jsx](file:///d:/TPCODL_Project/frontend/src/pages/InventoryPage.jsx)
- Create a complete Inventory Management dashboard interface styled with the **Tata Power Dark Grid** design system.
- Features:
  - Table listing inventory items: Item Code, Name, Category, Quantity, Unit, Reorder Level, Unit Price, Warehouse, Supplier, and Stock Status.
  - Low-stock badge notifications with electric red text/borders when `quantity <= reorderLevel`.
  - Search bar by Item Name or Code.
  - Filters for Category (e.g., Transformer Parts, Cables, Metering) and Warehouse.
  - "Add Item" / "Edit Item" modal form linked to `POST /api/inventory` and `PUT /api/inventory/{id}`.
  - "Delete Item" button linked to `DELETE /api/inventory/{id}`.
  - Fallback mockup data in case the backend server is offline during load.

#### [NEW] [OutagesPage.jsx](file:///d:/TPCODL_Project/frontend/src/pages/OutagesPage.jsx)
- Create an Outage Tracking dashboard page matching the Dark Grid design.
- Features:
  - Table of active and historical outages showing: Outage ID, Zone, Affected Area, Affected Customers, Start/End times, Cause, Outage Type, and Status.
  - Status badges: `ACTIVE` (electric red pulse/glow) vs `RESOLVED` (mint green).
  - Search and filter controls by Zone (Bhubaneswar, Cuttack, Cuttack, etc.) and Status.
  - "Log Outage" modal form to report new grid outages, connected to `POST /api/outages`.
  - "Resolve Outage" action button that opens a modal to specify `endTime` and `restorationNotes`, connected to `PUT /api/outages/{id}`.
  - Fallback mockup data matching the backend's sample seed.

#### [MODIFY] [App.jsx](file:///d:/TPCODL_Project/frontend/src/App.jsx)
- Import `InventoryPage` and `OutagesPage`.
- Define new routes in the `Routes` component:
  - `/inventory` inside `ProtectedRoute` allowing `['ADMIN', 'MAINTENANCE_MANAGER']`
  - `/outages` inside `ProtectedRoute` allowing all authenticated roles

#### [MODIFY] [Sidebar.jsx](file:///d:/TPCODL_Project/frontend/src/components/layout/Sidebar.jsx)
- Import `ClipboardList` (or `Package`) and `PowerOff` (or `ZapOff`) icons from `lucide-react`.
- Append `Inventory` and `Outages` items to the `navItems` array with correct paths and allowed roles.

---

## Verification Plan

### Automated Tests
- Run `npm run build` inside the `frontend` folder to guarantee the new pages build without linting or compilation issues.

### Manual Verification
- Deploy containers using `docker compose up --build -d` (once Docker is running on your machine).
- Log in using default credentials (e.g., `admin@tpcodl.com` / `Admin@2026!`).
- Navigate to the **Inventory** page, create a new item, edit it, and verify that the low-stock highlighting triggers correctly.
- Navigate to the **Outages** page, report a new outage, verify its active display, and then resolve it.




2. Run Python ML Service
Open a terminal and navigate to the ml-service directory:
powershell
cd d:\TPCODL_Project\ml-service
Install the Python dependencies:
powershell
pip install -r requirements.txt
Start the FastAPI server:
powershell
uvicorn main:app --reload --port 8000
The ML service will now be running on http://localhost:8000.
3. Run Spring Boot Backend
Because Maven is not globally installed in your command path, the easiest way to run the backend is via an IDE:

Open the /backend folder in IntelliJ IDEA or VS Code (make sure you have the Extension Pack for Java installed).
The IDE will automatically read the 

pom.xml
 file and import all dependencies.
Locate PowerPulseApplication.java (in src/main/java/com/tpcodl/powerpulse/) and click the Run button. Alternatively, if you prefer using the command line and install Maven:
powershell
cd d:\TPCODL_Project\backend
mvn spring-boot:run
The backend API will run on http://localhost:8080.

4. Run React Frontend
Open a new terminal and navigate to the frontend directory:
powershell
cd d:\TPCODL_Project\frontend
Install dependencies (if you haven't already):
powershell
npm install
Start the Vite development server:
powershell
npm run dev
Click the link shown in your terminal (usually http://localhost:5173) to open the application in your browser.
Credentials Reference
Once all services are running, you can log in using these default credentials:

Admin: admin@tpcodl.com / Admin@2026!
Field Engineer: engineer@tpcodl.com / Engineer@2026!
Maintenance Manager: manager@tpcodl.com / Manager@2026!
Executive: executive@tpcodl.com / Executive@2026!
1:57 PM
3:19 PM
The BadCredentialsException is occurring because your local database tables were created by Spring Boot's Hibernate auto-generation (ddl-auto=update), but the initial seed data (the user accounts themselves) was never loaded. Consequently, the users table is currently empty.

What I Did to Fix It
I created a programmatic data seeder class 

DataSeeder.java
 in your backend.

On your next backend startup, it will check if the database is empty.
If it is, it will automatically register all default user accounts (with correct BCrypt-encrypted passwords) as well as default assets, faults, outages, and inventory items.
How to Resolve This Now
Restart your Spring Boot Backend: Stop the currently running Spring Boot server in your IDE (or terminal) and start it up again.
In your backend terminal logs, you will see confirmation lines like:
text
Seeded default user accounts successfully.
Seeded grid assets successfully.
...
Open your browser and log in with the default credentials:
Username/Email: admin@tpcodl.com
Password: Admin@2026!
What's Next?
Once you confirm you can log in, let me know if you would like me to proceed with executing the 

Implementation Plan
 to build out the remaining Inventory Management and Outage Monitoring pages so the project is 100% complete!

3:19 PM
