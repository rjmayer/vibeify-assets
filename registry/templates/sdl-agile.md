# **Typical Software Development Lifecycle (Agile/Scrum)**

# **1. Concept & Initiation**

### **Purpose**

Define the idea, business goals, and feasibility.

### **Roles**

Product Owner, Stakeholders, CTO/Architect (high-level only)

### **Main Artifacts**

* **Product Vision Statement**
* **High-level Feature List**
* **Business Case** (optional)
* **Initial Risk Assessment**
* **Initial Architecture Sketch** (very rough)
* **Initial Budget/Timeline Estimate**

---

# **2. Requirements Analysis**

### **Purpose**

Translate the idea into structured requirements and a backlog.

### **Roles**

Product Owner, Business Analyst, Architect, Lead Developer

### **Main Artifacts**

* **Product Backlog**

  * **Epics**
  * **User Stories**
* **Acceptance Criteria** (per user story)
* **Non-Functional Requirements** (security, performance, compliance)
* **System Requirements Spec** (SRS — optional in strict agile, common in real life)
* **Use Case Diagrams / Flowcharts** (optional)

---

# **3. Architecture & Technical Design**

### **Purpose**

Establish the system’s technical blueprint.

### **Roles**

CTO/Architect, Lead Developer, DevOps

### **Main Artifacts**

* **Architecture Document**

  * System components
  * Data flow diagrams
  * Integration points
  * Sequence diagrams
* **Technology Stack Decision**
* **API Specifications** (OpenAPI/Swagger)
* **Database Schema / ERD**
* **Security Model**
* **DevOps / CI/CD Pipeline Plan**

---

# **4. Sprint Planning**

### **Purpose**

Prepare a focused plan for the upcoming sprint.

### **Roles**

Product Owner, Scrum Team, Scrum Master (process facilitator)

### **Main Artifacts**

* **Sprint Backlog**

  * Selected user stories
  * **Tasks** (breakdown of each story)
* **Definition of Done** (team standard)
* **Capacity Plan**

---

# **5. Development (Implementation)**

### **Purpose**

Write, integrate, and document the code.

### **Roles**

Developers, Tech Lead

### **Main Artifacts**

* **Source Code**
* **Unit Tests**
* **Integration Tests**
* **Code Review Feedback / PR Comments**
* **Updated API Documentation**
* **Updated System Documentation**
* **Developer Notes / ADRs** (Architecture Decision Records)

---

# **6. Testing & Quality Assurance**

### **Purpose**

Validate that the system works and meets requirements.

### **Roles**

QA Engineers, Testers, Developers

### **Main Artifacts**

* **Test Plan**
* **Test Cases**
* **Test Scripts** (if automated)
* **Test Reports**
* **Bug Reports / Defect Tickets**
* **Regression Test Suite**
* **Performance Test Results**

---

# **7. Integration & Pre-Release**

### **Purpose**

Prepare the software for release.

### **Roles**

DevOps, QA, Developers

### **Main Artifacts**

* **Integration Build(s)**
* **Release Candidate**
* **Deployment Checklist**
* **Configuration Files**
* **Infrastructure Definitions** (IaC: Terraform, Ansible, Helm charts)
* **Release Notes (Draft)**

---

# **8. Deployment / Release**

### **Purpose**

Publish the application to production (or app stores).

### **Roles**

DevOps, Release Manager, (optionally) Product Owner

### **Main Artifacts**

* **Production Build**
* **Deployment Scripts / CI-CD Pipelines**
* **App Store Metadata** (icons, descriptions, screenshots)
* **Release Notes (Final)**
* **Rollback Plan**
* **Post-Deployment Verification Checklist**

---

# **9. Maintenance & Support**

### **Purpose**

Monitor, fix, and iteratively improve the system.

### **Roles**

Developers, QA, DevOps, Support Team

### **Main Artifacts**

* **Bug Reports**
* **Hotfix Branches**
* **Patch Releases**
* **Monitoring Dashboards**
* **Operational Logs**
* **Performance Reports**
* **New Feature Requests**

---

# **10. Retrospective & Continuous Improvement**

### **Purpose**

Reflect on the process and improve.

### **Roles**

Scrum Team (everyone)

### **Main Artifacts**

* **Retrospective Notes**
* **Process Improvement Items**
* **Updated Team Agreements / Workflows**

---

# **Summary of All Key Artifacts**

### **Planning**

* Vision, Feature List, Business Case

### **Requirements**

* Backlog (Epics, User Stories, Acceptance Criteria)
* SRS
* NFRs
* Flowcharts / Use Cases

### **Design**

* Architecture Doc
* API Specs
* ERD
* Security Model
* CI/CD Design

### **Implementation**

* Code
* Tests
* ADRs
* Documentation

### **Quality**

* Test Plans & Cases
* Bug Reports
* QA Reports

### **Release**

* Release Build
* Deployment Scripts
* App Store Assets
* Release Notes

### **Operations**

* Monitoring
* Fixes
* Patch Notes
