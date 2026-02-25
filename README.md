# Paragrein Logistics Management System

**Web-Based Logistics Management Platform**  
**Final Year Project (IT5106 - Software Development Project)**  
**Candidate:** Muhammadu Rafai Sajadh Ahamed (Index: 2323338)  
**Supervisor:** Mr. N.M. M. B. Nawarathna  
**Academic Year:** 2025-2026  

---

## Project Overview

**Paragrein** is a comprehensive **web-based logistics management system** designed to streamline order processing, delivery tracking, inventory management, and fleet operations. The system integrates multiple logistics functions into a centralized, role-based platform that improves operational efficiency, reduces manual errors, and enhances customer satisfaction.

### Problem Statement
Many logistics companies still rely on manual processes—handwritten records, scattered spreadsheets, and phone calls—leading to:
- Delivery delays and inaccurate information
- Inventory mismanagement and stockouts
- Poor communication between teams
- Low visibility into operations
- Increased operational costs

### Solution
A modern, integrated **Logistics Management System** that:
- ✅ Automates order-to-delivery workflows
- ✅ Provides real-time tracking and notifications
- ✅ Optimizes warehouse and driver operations
- ✅ Enables data-driven decision-making
- ✅ Scales with business growth

---

## Key Features

### 1. Order Management
- Create orders online, via phone, or in-person
- Real-time inventory availability checking
- Estimated delivery date calculation
- Order status tracking
- Cancellation and modification support

### 2. Warehouse Operations
- Pick, pack, and quality control workflows
- Real-time inventory tracking
- Low-stock alerts and reorder management
- Warehouse location management
- Inventory movement audit trail

### 3. Fleet Management
- Driver and vehicle registration
- Availability status tracking
- Driver performance metrics
- Vehicle maintenance scheduling

### 4. Intelligent Assignment
- Automatic driver-vehicle assignment
- Route optimization algorithm
- Distance-based warehouse selection
- Constraint-aware scheduling

### 5. Real-Time Delivery Tracking
- GPS-based live location tracking
- Delivery status timeline
- Route visualization on map
- Estimated arrival time
- Customer notifications

### 6. Returns & Refunds
- Customer return requests
- Return inspection workflow
- Refund processing
- Automated restocking

### 7. Reporting & Analytics
- KPI dashboards (on-time %, satisfaction, revenue)
- Delivery performance reports
- Inventory status reports
- Driver performance analytics
- Revenue analysis

### 8. Role-Based Access Control
- **Admin:** Full system management, worker onboarding
- **Customer:** Order creation, tracking, feedback
- **Driver:** Delivery execution, navigation
- **Warehouse:** Pick/pack operations, inventory management
- **Finance:** Payment and invoice management
- **Operations:** Assignment, escalation management

---

## Technology Stack

### Backend
- **Framework:** Spring Boot 4.0.2
- **Language:** Java 17
- **Database:** MySQL 8.0
- **ORM:** Spring Data JPA
- **Security:** JWT + Spring Security
- **Email:** Gmail SMTP
- **Testing:** JUnit 5, Mockito

### Frontend
- **Framework:** React 18+
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Charts:** Recharts or Chart.js
- **Mapping:** Leaflet or MapBox
- **Testing:** Jest + React Testing Library

### DevOps (Optional)
- **Version Control:** Git/GitHub
- **Containerization:** Docker
- **CI/CD:** GitHub Actions or GitLab CI
- **Deployment:** AWS/Azure/DigitalOcean

---

## Project Structure

```
System/
├── FrontendReact/
│   └── paragrein/
│       ├── src/
│       │   ├── components/
│       │   │   ├── layout/
│       │   │   │   ├── Topbar.jsx
│       │   │   │   └── SidebarTemp.jsx
│       │   │   └── dashboard/
│       │   │       ├── StatsCard.jsx
│       │   │       ├── FleetStatus.jsx
│       │   │       └── ActivityList.jsx
│       │   ├── pages/
│       │   │   ├── Login.jsx
│       │   │   ├── Register.jsx
│       │   │   ├── Dashboard.jsx (Admin)
│       │   │   ├── CustomerDashboard.jsx
│       │   │   ├── DriverDashboard.jsx
│       │   │   ├── WarehouseDashboard.jsx
│       │   │   ├── FinanceDashboard.jsx
│       │   │   └── OperationsDashboard.jsx
│       │   ├── routes/
│       │   │   └── AppRoutes.jsx
│       │   └── App.jsx
│       ├── package.json
│       └── vite.config.js
│
├── Paragrein-backend/
│   └── Paragrein-backend/
│       ├── src/
│       │   ├── main/
│       │   │   ├── java/com/paragrein/Paragrein_backend/
│       │   │   │   ├── entity/           # JPA Entities
│       │   │   │   ├── dto/              # Data Transfer Objects
│       │   │   │   ├── repository/       # JPA Repositories
│       │   │   │   ├── service/          # Business Logic
│       │   │   │   ├── controller/       # REST Endpoints
│       │   │   │   ├── security/         # JWT & Spring Security
│       │   │   │   └── util/             # Utilities & Constants
│       │   │   └── resources/
│       │   │       └── application.properties
│       │   └── test/
│       │       └── java/                 # Unit & Integration Tests
│       ├── pom.xml
│       └── target/
│
├── DATABASE_SCHEMA.sql        # Complete MySQL DDL & Views
├── BUSINESS_PROCESS_ANALYSIS.md  # Workflow documentation
├── IMPLEMENTATION_CHECKLIST.md # Week-by-week tasks
├── QUICK_START.md            # First 30 minutes
├── API_DOCUMENTATION.md      # REST API reference (auto-generated)
├── USER_MANUAL.md            # User guide with screenshots
├── DEPLOYMENT_GUIDE.md       # Production setup
├── FINAL_PROJECT_REPORT.md   # Academic report
└── README.md                 # This file
```

---

## Getting Started (Quick Start)

### Prerequisites
- Java Development Kit (JDK) 17 or higher
- MySQL 8.0 or higher
- Node.js 18+ and npm 9+
- Git (for version control)

### Installation

#### 1. Clone or Extract Project
```bash
cd System
```

#### 2. Database Setup
```bash
# Open MySQL Workbench or MySQL CLI
mysql -u root -p
# Enter password: 1234

# Run schema:
source DATABASE_SCHEMA.sql;
```

#### 3. Backend Setup
```bash
cd Paragrein-backend/Paragrein-backend

# Build project
mvn clean package -DskipTests

# Run backend
java -jar target/Paragrein-backend-0.0.1-SNAPSHOT.jar
# OR: mvn spring-boot:run
# OR: Right-click ParagreinBackendApplication.java → Run (in IDE)

# Expected: "Started ParagreinBackendApplication in X seconds"
# Backend available at: http://localhost:8080
```

#### 4. Frontend Setup
```bash
cd FrontendReact/paragrein

# Install dependencies
npm install

# Start development server
npm run dev

# Expected: "Local: http://localhost:5173"
```

#### 5. Access Application
- **Frontend:** http://localhost:5173
- **API Base:** http://localhost:8080/api
- **Default Admin Credentials:**
  - Email: `admin@gmail.com`
  - NIC: `ADMIN0001`
  - Password: `admin1234`

### First Steps
1. Read `QUICK_START.md` (30-minute guide)
2. Review `BUSINESS_PROCESS_ANALYSIS.md` (understand workflows)
3. Check `DATABASE_SCHEMA.sql` (understand data model)
4. Follow `IMPLEMENTATION_CHECKLIST.md` (execute week-by-week)

---

## API Endpoints Summary

### Authentication
```
POST   /api/auth/login              # User login
POST   /api/auth/register           # Customer registration
POST   /api/auth/forgot-password    # Password recovery
POST   /api/auth/reset-password     # Password reset
```

### Orders (Week 1-2)
```
POST   /api/orders/create           # Create new order
GET    /api/orders                  # List all orders
GET    /api/orders/{id}             # Get order details
PUT    /api/orders/{id}/status      # Update order status
DELETE /api/orders/{id}/cancel      # Cancel order
```

### Warehouse & Inventory (Week 3)
```
GET    /api/inventory/warehouse/{warehouseId}/stock
POST   /api/inventory/reserve       # Reserve stock for order
POST   /api/inventory/movements     # Log inventory movement
GET    /api/inventory/alerts        # Get low-stock alerts
```

### Assignments (Week 4)
```
POST   /api/assignments/auto-assign      # Auto-assign driver
POST   /api/assignments/{id}/assign-driver
GET    /api/assignments/pending          # List pending assignments
POST   /api/assignments/{id}/optimize-route
```

### Delivery & Tracking (Week 5)
```
POST   /api/deliveries/{order_id}/start
POST   /api/deliveries/{tracking_id}/location  # Update GPS
POST   /api/deliveries/{order_id}/mark-delivered
POST   /api/deliveries/{order_id}/mark-failed
GET    /api/deliveries/{order_id}/tracking
```

### Returns & Payments (Week 6)
```
POST   /api/returns/{order_id}/request
POST   /api/returns/{id}/inspect
POST   /api/payments/{order_id}/mark-collected
GET    /api/invoices/{order_id}
```

### Reporting (Week 6)
```
GET    /api/reports/delivery-performance
GET    /api/reports/customer-satisfaction
GET    /api/reports/revenue-analysis
GET    /api/reports/driver-performance
```

For complete endpoint documentation, see `API_DOCUMENTATION.md`.

---

## Database Schema Overview

**20+ Tables organized by domain:**

| Domain | Tables |
|--------|--------|
| Authentication | users, roles, user_roles |
| Customers | customers, suppliers |
| Products | products, warehouses, warehouse_bins |
| Inventory | inventory, inventory_movements, inventory_alerts |
| Fleet | vehicles, drivers |
| Orders | orders, order_items, order_assignments |
| Warehouse Ops | warehouse_operations |
| Delivery | delivery_tracking, delivery_history, delivery_attempts, escalations |
| Post-Delivery | returns, return_inspections, customer_feedback |
| Finance | payments, invoices, invoice_items |
| Audit | audit_logs |

See `DATABASE_SCHEMA.sql` for complete definitions.

---

## Development Workflow

### Daily Workflow
```bash
# Start services
mysql -u root -p (MySQL)
java -jar target/...jar (Backend - Terminal 1)
npm run dev (Frontend - Terminal 2)

# Code changes
# - Backend: Auto-reloads (Spring DevTools)
# - Frontend: Hot-reload (Vite)
# - Refresh browser (F5) if needed

# Commit progress
git add .
git commit -m "Week 1: Create Order entity and APIs"
```

### Testing
```bash
# Backend Unit Tests
mvn test

# Backend Integration Tests
mvn verify

# Frontend Tests
npm test

# Manual Testing
# Use Postman for API endpoints
# Use browser DevTools for frontend debugging
```

### Building for Production
```bash
# Backend
mvn clean package

# Frontend (static files for deployment)
npm run build
# Creates dist/ folder for deployment
```

---

## Project Timeline

| Phase | Duration | Focus |
|-------|----------|-------|
| Week 1-2 | 28-35 hrs | Order Management (CRUD, validation) |
| Week 3 | 26-30 hrs | Warehouse & Inventory Tracking |
| Week 4 | 24-28 hrs | Driver Assignment & Route Optimization |
| Week 5 | 30-34 hrs | Real-Time Delivery Tracking |
| Week 6 | 26-30 hrs | Returns, Payments, Reporting |
| Week 7 | 20-22 hrs | Testing, Bug Fixes, Documentation |
| Week 8 | 16-20 hrs | Final Report, Demo, Submission |
| **TOTAL** | ~240 hrs | |

**Expected Delivery:** April 13, 2026

See `IMPLEMENTATION_CHECKLIST.md` for detailed weekly breakdown.

---

## Testing & Quality Assurance

### Test Coverage Goals
- Unit Tests: 70+ test methods, 90%+ pass rate
- Integration Tests: 15+ scenarios
- Code Coverage: 60%+
- Performance: Response times < 500ms
- Load Testing: 100+ concurrent users

### Test Approach
1. **Unit Tests:** Individual service methods (JUnit 5 + Mockito)
2. **Integration Tests:** Full workflow scenarios (Spring Boot Test)
3. **API Tests:** Endpoint testing (Postman/curl)
4. **UI Tests:** Component rendering (React Testing Library)
5. **Manual Testing:** User acceptance testing (UAT)
6. **Security Testing:** OWASP compliance, role-based access

See `IMPLEMENTATION_CHECKLIST.md` for Week 7 testing details.

---

## Documentation

### Project Documents
- **BUSINESS_PROCESS_ANALYSIS.md** - Workflow mapping (order → delivery)
- **DATABASE_SCHEMA.sql** - Complete database DDL
- **API_DOCUMENTATION.md** - REST API reference
- **QUICK_START.md** - First 30-minute setup
- **IMPLEMENTATION_CHECKLIST.md** - Week-by-week execution plan
- **USER_MANUAL.md** - Role-based user guides with screenshots
- **DEPLOYMENT_GUIDE.md** - Production setup instructions
- **FINAL_PROJECT_REPORT.md** - Academic report (25-30 pages)

### Code Documentation
- JavaDoc comments on all public classes/methods
- README files in each module
- Inline comments for complex logic
- ER diagrams and architecture drawings

---

## Security Measures

✅ **Authentication:** JWT-based stateless authentication  
✅ **Authorization:** Role-based access control (@PreAuthorize)  
✅ **Input Validation:** Bean validation annotations  
✅ **SQL Injection Prevention:** Parameterized queries (JPA)  
✅ **XSS Prevention:** Input sanitization  
✅ **CSRF:** JWT tokens instead of sessions  
✅ **Password Security:** BCrypt hashing  
✅ **Audit Logging:** All critical actions logged  
✅ **Data Privacy:** Sensitive fields encrypted  

---

## Performance Optimization

- **Database Indexes:** Strategic indexes on frequently queried columns
- **Caching:** In-memory caching for user roles, products (Spring Cache)
- **Lazy Loading:** Relationships loaded on demand
- **Pagination:** Large result sets paginated (50 records/page)
- **Async Processing:** Email/SMS sent asynchronously
- **CDN:** Static assets served from CDN (in production)
- **Load Balancing:** Horizontal scaling ready (stateless backend)

---

## Known Limitations & Future Work

### Current Limitations
- GPS tracking simulated in development (uses mock coordinates)
- SMS notifications mocked (email implemented)
- Single-warehouse support (multi-warehouse in Phase 2)
- Simple route optimization (distance-based, no time windows)
- COD payment only (online payments in Phase 2)

### Future Enhancements
- Advanced route optimization (using Google Maps API)
- Mobile app (iOS/Android native)
- SMS/Push notifications (real integration)
- Multi-currency & multi-language support
- AI-based demand forecasting
- Blockchain for supply chain transparency
- GraphQL API alternative
- Real-time WebSocket updates

---

## Troubleshooting

### Backend Won't Start
```bash
# MySQL not running
mysql -u root -p  # Test connection

# Port 8080 in use
lsof -i :8080
kill -9 <PID>

# Build errors
mvn clean
mvn compile
```

### Frontend Issues
```bash
# Dependencies not installed
rm -rf node_modules
npm install

# Port 5173 in use
lsof -i :5173
kill -9 <PID>

# Clear cache
npm cache clean --force
```

### Database Issues
```bash
# Schema not created
source DATABASE_SCHEMA.sql;

# Verify tables
SELECT * FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'Paragrein';
```

See `QUICK_START.md` for more troubleshooting.

---

## Support & Contact

**Supervisor:** Mr. N.M. M. B. Nawarathna  
**Email:** mahesh.nawarathna@ifs.com  
**Phone:** 071 9352 561  

**Candidate:** Muhammadu Rafai Sajadh Ahamed  
**Email:** rafaisajadhahamed@gmail.com  
**Contact:** 078 9143 352  

---

## License & Academic Integrity

This project is submitted as part of **IT5106 - Software Development Project** for academic evaluation. Use and distribution are restricted to educational purposes only.

**Plagiarism Policy:** All code is original work. Referenced libraries and frameworks are properly attributed.

---

## Contributing Guidelines

For future enhancements or modifications:

1. Create new branch: `git checkout -b feature/your-feature`
2. Follow Java naming conventions (camelCase for variables, PascalCase for classes)
3. Follow React naming conventions (PascalCase for components)
4. Write unit tests for new features
5. Update documentation
6. Create pull request with clear description

---

## Commit History

```
Week 1: Create Order entity and repository
Week 1: Implement OrderService and DTOs
Week 1: Build OrderController with CRUD APIs
Week 1: Create order creation form in React
Week 1: Add order list and detail pages

Week 3: Create Warehouse and Inventory entities
Week 3: Implement inventory reservation logic
Week 3: Build warehouse dashboard

... (continues per IMPLEMENTATION_CHECKLIST.md)
```

---

## Quick Links

📖 **Documentation**
- [Business Process Analysis](./BUSINESS_PROCESS_ANALYSIS.md)
- [Implementation Checklist](./IMPLEMENTATION_CHECKLIST.md)
- [Quick Start Guide](./QUICK_START.md)
- [API Documentation](./API_DOCUMENTATION.md)
- [Database Schema](./DATABASE_SCHEMA.sql)

🔗 **External Resources**
- [Spring Boot Docs](https://spring.io/projects/spring-boot)
- [React Docs](https://react.dev)
- [MySQL Docs](https://dev.mysql.com/doc/)
- [JWT.io](https://jwt.io)

🛠️ **Tools**
- IDE: IntelliJ IDEA / VS Code
- Database: MySQL Workbench
- API Testing: Postman
- Version Control: Git/GitHub

---

## Final Notes

This project demonstrates:
- ✅ Full-stack web application development
- ✅ Microservices-oriented architecture
- ✅ Database design and optimization
- ✅ REST API design principles
- ✅ Role-based access control
- ✅ Real-time tracking systems
- ✅ Business process automation
- ✅ Comprehensive testing & documentation

**Estimated Project Value:** 8 weeks × 30+ hours/week = 240+ development hours

---

**Ready to build? Start with `QUICK_START.md` and follow `IMPLEMENTATION_CHECKLIST.md` week by week!** 🚀

---

*Last Updated: February 23, 2026*  
*Project Status: Ready for Implementation*  
*Next Milestone: Week 1 Completion (Order Management APIs)*
