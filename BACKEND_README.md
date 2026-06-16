# AdSphere Backend

A multi-role advertising platform built with Spring Boot 3.2.0. Supports 4 user roles with JWT authentication, campaign management, ad placement, CPC revenue splitting, and analytics.

---

## Technology Stack

| Technology | Version | Purpose |
|---|---|---|
| Java | 17 | Language |
| Spring Boot | 3.2.0 | Framework |
| Spring Security | 6.x | Authentication & Authorization |
| Spring Data JPA | 3.x | ORM / Database layer |
| H2 Database | In-memory | Development database |
| JWT (jjwt) | 0.11.5 | Token-based auth |
| Lombok | Latest | Boilerplate reduction |
| Springdoc OpenAPI | 2.3.0 | Swagger UI |
| Maven | 3.x | Build tool |

---

## Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+

### Run the Application
```bash
cd C:\AdSphere
mvn clean install
mvn spring-boot:run
```

### Verify
| URL | Description |
|---|---|
| `http://localhost:8080` | API base |
| `http://localhost:8080/swagger-ui/index.html` | Swagger UI (all endpoints) |
| `http://localhost:8080/h2-console` | H2 database console |

### H2 Console Connection
```
JDBC URL:  jdbc:h2:mem:adsphere
Username:  sa
Password:  (leave empty)
```

---

## Project Structure

```
src/main/java/com/adsphere/
├── AdSphereApplication.java
├── config/
│   └── SecurityConfig.java          # JWT filter, role-based access rules
├── controller/
│   ├── AuthController.java          # /api/auth/**
│   ├── AdvertiserController.java    # /api/advertiser/**
│   ├── PublisherController.java     # /api/publisher/**
│   ├── NetworkAdminController.java  # /api/network/**
│   ├── SuperAdminController.java    # /api/admin/**
│   └── TrackingController.java      # /api/track/** (public)
├── service/
│   ├── AuthService.java
│   ├── CampaignService.java
│   ├── WebsiteService.java
│   ├── PlacementService.java
│   ├── RevenueService.java
│   ├── UpgradeService.java
│   ├── AnalyticsService.java
│   └── AdminService.java
├── model/
│   ├── User.java                    # Core user entity
│   ├── Website.java                 # Publisher websites
│   ├── Campaign.java                # Advertiser campaigns
│   ├── AdCreative.java              # Ad assets
│   ├── AdPlacement.java             # Campaign ↔ Website link
│   ├── Analytics.java               # Impressions/clicks per day
│   ├── RevenueTransaction.java      # CPC revenue records
│   ├── UpgradeRequest.java          # Role upgrade workflow
│   ├── Role.java                    # Enum: SUPER_ADMIN, NETWORK_ADMIN, PUBLISHER, ADVERTISER
│   ├── UserStatus.java              # Enum: ACTIVE, INACTIVE, SUSPENDED
│   ├── WebsiteStatus.java           # Enum: PENDING, APPROVED, REJECTED, SUSPENDED
│   ├── CampaignStatus.java          # Enum: DRAFT, PENDING_APPROVAL, ACTIVE, PAUSED, COMPLETED, REJECTED
│   └── UpgradeStatus.java           # Enum: PENDING, APPROVED, REJECTED
├── repository/                      # 8 JPA repositories
├── dto/                             # Request/Response DTOs (no entity exposure)
│   ├── auth/
│   ├── admin/
│   ├── analytics/
│   ├── campaign/
│   ├── placement/
│   ├── upgrade/
│   └── website/
├── security/
│   ├── JwtUtil.java                 # Token generation & validation
│   ├── JwtAuthFilter.java           # Request filter
│   └── UserDetailsServiceImpl.java  # Loads user by email
└── exception/
    └── GlobalExceptionHandler.java  # Maps exceptions to HTTP responses
```

---

## User Roles

| Role | Description | Access |
|---|---|---|
| `SUPER_ADMIN` | Platform owner | Full access — all endpoints |
| `NETWORK_ADMIN` | Ad network manager | Approves websites & campaigns, sees network data |
| `PUBLISHER` | Website owner | Manages websites, placements, earns revenue |
| `ADVERTISER` | Ad buyer | Manages campaigns, creatives, views spend |

### Default Role on Register
All new users register as `ADVERTISER`. To upgrade, submit an `UpgradeRequest` which `SUPER_ADMIN` reviews.

---

## Authentication

All protected endpoints require:
```
Authorization: Bearer <jwt_token>
```

### Endpoints
```
POST /api/auth/register   → { fullName, email, password }
POST /api/auth/login      → { email, password }
```

Both return:
```json
{ "token": "...", "email": "...", "role": "ADVERTISER" }
```

---

## API Endpoints

### Public
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| POST | `/api/track/impression/{placementId}` | Record ad impression |
| POST | `/api/track/click/{placementId}` | Record click + split revenue |

---

### Advertiser — `/api/advertiser/**`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/advertiser/campaigns` | List my campaigns |
| POST | `/api/advertiser/campaigns` | Create campaign |
| GET | `/api/advertiser/campaigns/{id}` | Get campaign |
| PUT | `/api/advertiser/campaigns/{id}` | Update campaign (DRAFT only) |
| DELETE | `/api/advertiser/campaigns/{id}` | Delete campaign (DRAFT only) |
| PUT | `/api/advertiser/campaigns/{id}/submit` | Submit for approval |
| PUT | `/api/advertiser/campaigns/{id}/pause` | Pause (ACTIVE only) |
| PUT | `/api/advertiser/campaigns/{id}/resume` | Resume (PAUSED only) |
| GET | `/api/advertiser/campaigns/{id}/creatives` | List creatives |
| POST | `/api/advertiser/campaigns/{id}/creatives` | Add creative |
| DELETE | `/api/advertiser/campaigns/{campaignId}/creatives/{creativeId}` | Delete creative |
| GET | `/api/advertiser/campaigns/{id}/placements` | View placements |
| GET | `/api/advertiser/campaigns/{id}/analytics` | Analytics summary |
| GET | `/api/advertiser/campaigns/{id}/analytics/daily` | Daily analytics |
| GET | `/api/advertiser/spend` | Total spend |
| GET | `/api/advertiser/transactions` | Revenue transactions |

---

### Publisher — `/api/publisher/**`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/publisher/websites` | List my websites |
| POST | `/api/publisher/websites` | Register website |
| GET | `/api/publisher/websites/{id}` | Get website |
| PUT | `/api/publisher/websites/{id}` | Update website |
| DELETE | `/api/publisher/websites/{id}` | Delete website |
| GET | `/api/publisher/websites/{id}/analytics` | Website analytics summary |
| GET | `/api/publisher/websites/{id}/analytics/daily` | Daily analytics |
| GET | `/api/publisher/websites/{websiteId}/placements` | List placements |
| POST | `/api/publisher/placements` | Create placement |
| PUT | `/api/publisher/placements/{id}/toggle` | Toggle placement active/inactive |
| GET | `/api/publisher/earnings` | Total earnings |
| GET | `/api/publisher/transactions` | Revenue transactions |
| POST | `/api/publisher/upgrade-requests` | Submit upgrade request |
| GET | `/api/publisher/upgrade-requests` | List my upgrade requests |

---

### Network Admin — `/api/network/**`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/network/websites/pending` | List pending websites |
| PUT | `/api/network/websites/{id}/approve` | Approve website |
| PUT | `/api/network/websites/{id}/reject` | Reject website |
| GET | `/api/network/campaigns/pending` | List pending campaigns |
| PUT | `/api/network/campaigns/{id}/approve` | Approve campaign |
| PUT | `/api/network/campaigns/{id}/reject` | Reject campaign |

---

### Super Admin — `/api/admin/**`
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | Platform-wide stats |
| GET | `/api/admin/users` | All users |
| GET | `/api/admin/users/role/{role}` | Filter users by role |
| PUT | `/api/admin/users/{id}/suspend` | Suspend user |
| PUT | `/api/admin/users/{id}/activate` | Activate user |
| GET | `/api/admin/upgrade-requests/pending` | Pending upgrade requests |
| PUT | `/api/admin/upgrade-requests/{id}/review` | Approve or reject upgrade |

---

## Revenue Model (CPC)

Every click on an ad triggers an automatic revenue split:

```
CPC Bid Amount
├── Publisher:     70%
├── Network Admin: 20%
└── Platform:      10%
```

- Revenue is recorded as a `RevenueTransaction` per click
- Campaign budget is decremented on each click
- Campaign auto-transitions to `COMPLETED` when budget reaches zero

---

## Campaign Status Flow

```
DRAFT
  └─[submit]──► PENDING_APPROVAL
                  ├─[approve]──► ACTIVE ──[pause]──► PAUSED
                  │                │                    │
                  │                └──────[resume]──────┘
                  │                └─[budget=0]──► COMPLETED
                  └─[reject]──► REJECTED
```

---

## Database Schema (10 Tables)

| Table | Entity | Description |
|---|---|---|
| `users` | User | All platform users |
| `websites` | Website | Publisher-owned websites |
| `campaigns` | Campaign | Advertiser campaigns |
| `ad_creatives` | AdCreative | Ad assets per campaign |
| `ad_placements` | AdPlacement | Campaign ↔ Website links |
| `analytics` | Analytics | Daily impressions/clicks per placement |
| `revenue_transactions` | RevenueTransaction | Click revenue records |
| `upgrade_requests` | UpgradeRequest | Role upgrade workflow |

Tables are auto-created by Hibernate on startup (`ddl-auto=create-drop`).

---

## Error Responses

All errors return JSON:
```json
{ "error": "message" }
```

Validation errors return field-level map:
```json
{ "fieldName": "validation message" }
```

| Status | Meaning |
|---|---|
| 400 | Bad request / validation failed |
| 401 | Missing or invalid JWT |
| 403 | Insufficient role |
| 409 | Conflict (duplicate, invalid state) |
| 500 | Unexpected server error |

---

## Configuration

`src/main/resources/application.properties`

```properties
# Database
spring.datasource.url=jdbc:h2:mem:adsphere
spring.jpa.hibernate.ddl-auto=create-drop
spring.h2.console.enabled=true

# JWT
jwt.secret=<64-char secret>
jwt.expiration=86400000   # 24 hours in ms

# Server
server.port=8080
```

---

## Development Phases Completed

| Phase | Description | Status |
|---|---|---|
| 1 | Project skeleton, H2, Security placeholder | ✓ |
| 2 | All 8 entity models + repositories | ✓ |
| 3 | JWT Auth system (register/login) | ✓ |
| 4 | Publisher module — website CRUD + approval | ✓ |
| 5 | Upgrade request flow | ✓ |
| 6 | Campaign management + ad creatives | ✓ |
| 7 | Ad placement + CPC revenue engine | ✓ |
| 8 | Analytics dashboards + admin panel | ✓ |
| Gap fixes | Exception handler, DTO security, budget deduction | ✓ |

---

## Next Steps

- [ ] Frontend (React) — see `FRONTEND_PROMPT.md`
- [ ] Switch to PostgreSQL for production
- [ ] Externalize JWT secret to environment variable
- [ ] Add rate limiting on `/api/track/**`
- [ ] Add refresh token support
