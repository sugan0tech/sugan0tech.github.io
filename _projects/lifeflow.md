---
layout: project
title: LifeFlow
description: A comprehensive software assistant for Blood Banking processes, built as a well-orchestrated modular monolith application
tech_stack: [ASP.NET Core, React, TypeScript, Entity Framework, SQL Server]
github_link: https://github.com/sugan0tech/capstone
date: 2024-10-01
---

<p class="message">
  A comprehensive software assistant for Blood Banking processes, built as a well-orchestrated modular monolith application with clean architecture principles, 100% code coverage, and advanced security features.
</p>

## Overview

LifeFlow is a comprehensive software solution designed to streamline and enhance blood banking processes. Built as a modular monolith application, it combines the benefits of modularity with the simplicity of a monolithic deployment. The system provides end-to-end support for blood donation centers, from donor management to distribution logistics, with a focus on security, efficiency, and regulatory compliance.

## Technical Architecture

* **Backend**: ASP.NET Core 7 with clean architecture principles
  * **MediatR**: Implements mediator pattern for decoupling request handlers from controllers
  * **Quartz.NET**: For scheduling background jobs (notifications, expiry alerts)
  * **AutoMapper**: Object mapping between layers
  * **Entity Framework Core**: ORM with LINQ support
  * **SignalR**: Real-time communication for notifications
  * **WatchDog**: Comprehensive logging for monitoring and auditing
* **Frontend**: React 18 with TypeScript
  * **TypeScript**: Strong typing for improved code quality
  * **DaisyUI**: Utility-first CSS framework with Tailwind CSS
  * **Redux**: Global state management
  * **Context API**: Component-level state management
* **Database**: Microsoft SQL Server with Entity Framework Core
* **Authentication**: JWT-based with refresh token rotation and anomaly detection
* **Testing**: xUnit for backend, Jest and React Testing Library for frontend (100% code coverage)

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

## Domain Model

The application is built around a carefully designed domain model that captures all the entities and relationships in the blood banking domain:

![LifeFlow ER Diagram](https://raw.githubusercontent.com/sugan0tech/capstone/main/Architecture/ER%20V1%20.png)

Main entities include:
- **User**: Core user entity with roles (Donor, HospitalAdmin, Admin, PharmaAdmin)
- **Order**: Manages blood requisitions with various order types
- **BloodGroup**: Tracks blood types, antigen types, and rare blood indicators
- **UnitBag**: Represents a unit of donated blood with tracking metadata
- **BloodBank**: Manages inventory and capacity at various locations
- **DonationSlot**: Handles the scheduling of blood donations
- **Notification**: System-generated alerts with various notification types

## Key Features

### Donor Management
* Comprehensive donor records with medical history
* Appointment scheduling using geospatial center lookup
* Eligibility screening with rule-based validation
* Digital consent forms and documentation
* Donor notifications for health conditions detected during testing

### Blood Inventory
* Real-time inventory tracking with FIFO/FEFO support
* Automatic expiration alerts using Quartz.NET scheduled jobs
* Barcode/QR code integration for unit tracking
* Component separation and processing workflows

### Testing & Compatibility
* Blood typing and cross-matching
* Infectious disease marker testing integration
* Electronic compatibility checking
* Quality control and testing audit trails

### Distribution & Logistics
* Hospital requisition management with priority-based ordering
* Advanced allocation algorithms for emergency vs. routine needs
* Transportation tracking and chain of custody
* Emergency request fast-tracking

### Reporting & Analytics
* Regulatory compliance reporting
* Operational dashboards with KPIs
* Donor retention and recruitment analytics
* Inventory forecasting and trend analysis

## Implementation Highlights

### Modular Architecture

The application follows a feature-based modular architecture with distinct modules:
- Address
- BloodCenter
- Client
- DonationSlot
- Donor
- GeoCoding
- Notification
- Orders
- Payment
- UnitBag
- User
- UserSession

Each module contains all related services, controllers, models, and repositories, promoting separation of concerns and maintainability.

### Advanced Order Processing

The OrderService implements sophisticated business logic for different order types:

* **Emergency Orders**: High-priority requests limited to 5 units, prioritizing nearest centers
* **Recurring Transfusion Orders**: Regular orders for patients requiring ongoing treatment
* **Hospital Stock Update Orders**: Bulk orders for hospital inventory maintenance
* **Recurring API Orders**: Orders specifically for plasma units

Order pricing follows government regulations:

| Blood Component     | Non-profit/Govt | Private | Pharma     |
|---------------------|-----------------|---------|------------|
| Whole Blood         | ₹1100           | ₹1500   |            |
| RBC                 | ₹1100           | ₹1500   |            |
| Frozen Plasma       | ₹300            | ₹400    | As per org |
| Platelet Concentrate| ₹300            | ₹400    |            |

### Geospatial Features

The application uses geospatial queries to locate the nearest blood centers for donations and deliveries:

```
acos(sin(lat1)*sin(lat2)+cos(lat1)*cos(lat2)*cos(lon2-lon1))*6371
```

This formula calculates the distance in kilometers between two points on Earth using their latitude and longitude coordinates.

### Advanced Security Implementation

* JWT-based authentication with refresh token rotation
* Session tracking and anomaly detection for unauthorized access attempts
* Role-based access control with fine-grained permissions
* Multi-factor authentication for administrative accounts
* Comprehensive audit logging of all security-relevant events

### Clean Architecture Implementation

The application follows a layered architecture with:

* **Domain Layer**: Core entities and business logic
* **Application Layer**: Use cases and application services using CQRS pattern
* **Infrastructure Layer**: External concerns like persistence and UI
* **Presentation Layer**: API controllers and React components

## Design Patterns Applied

* **Mediator Pattern (MediatR)**: Decouples request handling from controllers
* **CQRS Pattern**: Separates read and write operations for improved performance
* **Repository Pattern**: Abstracts data access logic
* **Unit of Work**: Manages transaction boundaries
* **Factory Pattern**: Creates complex objects with specific configurations
* **Observer Pattern**: Implements notification system

## Development Approach

The development of LifeFlow followed a rigorous approach focused on quality:

* **Test-Driven Development**: Achieved 100% code coverage
* **Continuous Integration**: Automated tests and builds
* **Code Reviews**: Strict pull request process with quality gates
* **Documentation**: Comprehensive API documentation with Swagger/OpenAPI
* **Performance Testing**: Load testing of critical workflows

## Architectural Decisions

* **Modular Monolith**: Initially planned as microservices but adopted a modular monolith approach for simpler authentication and deployment while maintaining separation of concerns.
* **Message Queue**: Considered Kafka for event streaming but deferred implementation as the monolith architecture with MediatR was sufficient for current needs.
* **Real-time Notifications**: Implemented SignalR with fallback to email for user inactivity.

## Outcomes & Lessons

This project demonstrates my ability to:

* Design and implement a complex domain model with multiple bounded contexts
* Balance architectural purity with practical development concerns
* Implement security best practices for sensitive healthcare data
* Create intuitive interfaces for specialized medical workflows
* Optimize for both performance and regulatory compliance

The modular monolith approach with MediatR provided an optimal balance between separation of concerns and deployment simplicity, proving to be an effective architecture for domain-specific applications like blood banking systems.

<div class="project-links">
  <a href="https://github.com/sugan0tech/capstone" class="github-link">View on GitHub</a>
</div>

<div class="project-meta">
  <span class="tech-badge">ASP.NET Core</span>
  <span class="tech-badge">React</span>
  <span class="tech-badge">TypeScript</span>
  <span class="tech-badge">Entity Framework</span>
  <span class="tech-badge">SQL Server</span>
  <span class="tech-badge">Clean Architecture</span>
  <span class="tech-badge">MediatR</span>
  <span class="tech-badge">Quartz.NET</span>
  <span class="date-badge">October 2024</span>
</div>
