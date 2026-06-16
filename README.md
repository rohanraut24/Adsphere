# AdSphere - Advertisement Management Platform

## Project Status: Phase 1 Completed ✓

### What Has Been Completed

#### Phase 1: Project Skeleton + H2 + Security Placeholder

**Created Files:**
1. Project structure with Maven (pom.xml)
2. Main application class (AdSphereApplication.java)
3. application.properties with H2 database configuration
4. Temporary SecurityConfig that permits all requests
5. All package directories:
   - config, security, model, repository, dto, service, controller, exception
6. Empty placeholder files for all future models, repositories, services, and controllers

**Configuration:**
- Spring Boot 3.2.0
- Java 17
- H2 In-Memory Database
- Spring Security (temporarily permitting all requests)
- JWT dependencies ready
- Lombok for boilerplate reduction

**Database Setup:**
- H2 Console enabled at: http://localhost:8080/h2-console
- JDBC URL: jdbc:h2:mem:adsphere
- Username: sa
- Password: (empty)

---

## How to Test Phase 1

### Step 1: Build the Project
```bash
cd C:\AdSphere
mvn clean install
```

### Step 2: Run the Application
```bash
mvn spring-boot:run
```

### Step 3: Verify H2 Console Access
1. Open browser
2. Navigate to: http://localhost:8080/h2-console
3. Enter connection details:
   - JDBC URL: jdbc:h2:mem:adsphere
   - Username: sa
   - Password: (leave empty)
4. Click "Connect"
5. You should see the H2 console interface (no tables yet)

### Expected Results:
- Application starts without errors
- Port 8080 is accessible
- H2 console loads successfully
- No database tables visible yet (will be created in Phase 2)

---

## Next Phase: Phase 2

**Objective:** Models + Repositories

**What Will Be Built:**
1. All 8 entity models with proper JPA annotations:
   - User (with Role and Status enums)
   - Website (with WebsiteStatus enum)
   - UpgradeRequest (with UpgradeStatus enum)
   - Campaign (with CampaignStatus enum)
   - AdCreative
   - AdPlacement
   - Analytics
   - RevenueTransaction

2. All 8 JPA repositories with custom query methods

**Expected Outcome:**
- All database tables automatically created by Hibernate
- Tables visible in H2 console

---

## Project Overview

**AdSphere** is a multi-role advertising platform with 4 user roles:

1. **SUPER_ADMIN** - Platform owner, approves upgrades, manages all users
2. **NETWORK_ADMIN** - Manages ad network, approves advertisers and campaigns
3. **PUBLISHER** - Registers websites, displays ads, earns 70% revenue
4. **ADVERTISER** - Creates campaigns, sets budgets, views analytics

**Revenue Model (CPC - Cost Per Click):**
- Publisher: 70%
- Network Admin: 20%
- Platform: 10%

---

## Technology Stack

- **Framework:** Spring Boot 3.2.0
- **Language:** Java 17
- **Database:** H2 (in-memory)
- **ORM:** Spring Data JPA + Hibernate
- **Security:** Spring Security + JWT
- **Build Tool:** Maven
- **Boilerplate:** Lombok

---

## Project Structure

```
C:\AdSphere\
├── pom.xml
├── src\main\
│   ├── java\com\adsphere\
│   │   ├── AdSphereApplication.java
│   │   ├── config\
│   │   │   └── SecurityConfig.java
│   │   ├── model\
│   │   ├── repository\
│   │   ├── service\
│   │   ├── controller\
│   │   ├── dto\
│   │   ├── security\
│   │   └── exception\
│   └── resources\
│       └── application.properties
```

---

## Development Phases

- ✓ Phase 1: Project Skeleton + H2 + Security Placeholder
- ⏳ Phase 2: Models + Repositories
- ⏳ Phase 3: Auth System (JWT)
- ⏳ Phase 4: Publisher Module (Websites)
- ⏳ Phase 5: Upgrade Request Flow
- ⏳ Phase 6: Campaign Management
- ⏳ Phase 7: Ad Placement + Revenue Engine
- ⏳ Phase 8: Analytics Dashboards + Admin Panel

---

**Last Updated:** Phase 1 Completion
**Ready for:** Phase 2 Implementation
