---
layout: project
title: LifeFlow
description: A comprehensive software assistant for Blood Banking processes, built as a well-orchestrated modular monolith application
tech_stack: [ASP.NET, React, Entity Framework, SQL Server]
github_link: https://github.com/sugan0tech/capstone
date: 2024-10-01
---

<p class="message">
  A comprehensive software assistant for Blood Banking processes, built as a well-orchestrated modular monolith application with clean architecture principles.
</p>

## Overview

LifeFlow is a comprehensive software solution designed to streamline and enhance blood banking processes. Built as a modular monolith application, it combines the benefits of modularity with the simplicity of a monolithic deployment. The system provides end-to-end support for blood donation centers, from donor management to distribution logistics.

## Technical Architecture

* **Backend**: ASP.NET Core 7 with clean architecture principles
* **Frontend**: React 18 with functional components and hooks
* **Database**: Microsoft SQL Server with Entity Framework Core for ORM
* **Authentication**: JWT-based authentication with refresh token rotation
* **State Management**: Redux for global state, Context API for component trees
* **Testing**: xUnit for backend, Jest and React Testing Library for frontend

## System Design

```
┌─────────────────────────────────────────────────┐
│                  Presentation                    │
│   ┌─────────────┐  ┌─────────────┐  ┌────────┐  │
│   │ React Views │  │  API Layer  │  │ Auth   │  │
│   └─────────────┘  └─────────────┘  └────────┘  │
├─────────────────────────────────────────────────┤
│             Application Modules                  │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌─────────┐  │
│  │ Donor  │ │ Blood  │ │Testing │ │Reporting│  │
│  │ Module │ │ Module │ │ Module │ │ Module  │  │
│  └────────┘ └────────┘ └────────┘ └─────────┘  │
├─────────────────────────────────────────────────┤
│              Core & Infrastructure              │
│   ┌─────────┐ ┌──────────┐ ┌────────────────┐  │
│   │ Domain  │ │ Services │ │ Data Access    │  │
│   │ Objects │ │          │ │ & Repositories │  │
│   └─────────┘ └──────────┘ └────────────────┘  │
├─────────────────────────────────────────────────┤
│                    Database                      │
└─────────────────────────────────────────────────┘
```

## Key Features

### Donor Management
* Comprehensive donor records with medical history
* Appointment scheduling and management
* Eligibility screening with rule-based validation
* Digital consent forms and documentation

### Blood Inventory
* Real-time inventory tracking with FIFO/FEFO support
* Automatic expiration alerts and notifications
* Barcode/QR code integration for unit tracking
* Component separation and processing workflows

### Testing & Compatibility
* Blood typing and cross-matching
* Infectious disease marker testing integration
* Electronic compatibility checking
* Quality control and testing audit trails

### Distribution & Logistics
* Hospital requisition management
* Priority-based allocation algorithms
* Transportation tracking and chain of custody
* Emergency request fast-tracking

### Reporting & Analytics
* Regulatory compliance reporting
* Operational dashboards with KPIs
* Donor retention and recruitment analytics
* Inventory forecasting and trend analysis

## Implementation Highlights

### Clean Architecture Implementation

The application follows a layered architecture with:

* **Domain Layer**: Core entities and business logic
* **Application Layer**: Use cases and application services
* **Infrastructure Layer**: External concerns like persistence and UI
* **Presentation Layer**: API controllers and React components

### Entity Framework Approach

* Code-first development with migration support
* Fluent API for entity configuration
* Optimized query performance with proper indexing
* Transaction management across bounded contexts

### API Design

* RESTful resource naming conventions
* Proper HTTP status code usage
* Pagination, sorting, and filtering for collections
* Comprehensive API documentation with Swagger/OpenAPI

### Frontend Architecture

* Component-based UI design with reusability focus
* Custom hook library for common operations
* Responsive design with mobile-first approach
* Accessibility compliance (WCAG 2.1 standards)

## Outcomes & Lessons

This project represents a significant milestone in my portfolio, demonstrating my ability to:

* Design and implement a complex domain model with multiple bounded contexts
* Balance architectural purity with practical development concerns
* Implement security best practices for sensitive healthcare data
* Create intuitive interfaces for specialized medical workflows

The modular monolith approach provided an optimal balance between separation of concerns and deployment simplicity, proving to be an effective architecture for domain-specific applications like blood banking systems.

<div class="project-links">
  <a href="https://github.com/sugan0tech/capstone" class="github-link">View on GitHub</a>
</div>

<div class="project-meta">
  <span class="tech-badge">ASP.NET Core</span>
  <span class="tech-badge">React</span>
  <span class="tech-badge">Entity Framework</span>
  <span class="tech-badge">SQL Server</span>
  <span class="tech-badge">Clean Architecture</span>
  <span class="date-badge">October 2024</span>
</div>
