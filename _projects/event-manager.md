---
layout: post
title: Event-Manager
date: 2023-06-17
tags: [springboot, clean-architecture, event-manager, api-design, java]
---

<p class="message">
  A Spring Boot backend service for managing university student group events with comprehensive APIs and security features.
</p>

## Overview

Event-Manager is a robust backend service designed to streamline the management of university student group events. Built on Spring Boot, the application provides a comprehensive API for event creation, attendance tracking, and resource management. This project demonstrates my capabilities in both technical implementation and team leadership.

## Leadership & Team Experience

* Led a cross-functional team of 5 developers through the full development lifecycle
* Established Git workflow with branch protection and pull request reviews
* Implemented CI/CD pipeline for automated testing and deployment
* Conducted daily stand-ups and bi-weekly sprint planning/retrospectives
* Mentored junior developers on Spring ecosystem best practices

## Technical Implementation

### Core Architecture

* **Spring Boot**: Built on Spring Boot 2.7 for rapid development and production-ready features
* **REST APIs**: Designed RESTful endpoints following HATEOAS principles
* **Hibernate/JPA**: Implemented robust ORM layer with optimized queries
* **Security**: OAuth2 integration with role-based access control
* **Validation**: Custom validators with comprehensive error responses

### Code Quality & Testing

* 85%+ test coverage using JUnit 5 and Mockito
* Integration tests with TestContainers for database testing
* Sonar analysis for code quality enforcement
* Structured logging with correlation IDs

## Key Features

* **Event Management**: CRUD operations with filtering, sorting, and pagination
* **User Administration**: Role-based access control for different stakeholder types
* **Resource Allocation**: Smart allocation of venues and equipment
* **Notification System**: Email and in-app notifications with templating
* **Reporting**: Attendance analytics and event participation metrics
* **Audit Trail**: Comprehensive activity logging for compliance

## System Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│ Controllers │─────▶│  Services   │─────▶│ Repositories│
└─────────────┘      └─────────────┘      └─────────────┘
       │                    │                    │
       ▼                    ▼                    ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   DTOs      │      │Domain Models│      │  Database   │
└─────────────┘      └─────────────┘      └─────────────┘
```

## Learning Outcomes

This project provided invaluable experience in:

* Designing scalable backend architectures for real-world applications
* Implementing comprehensive security measures including OAuth2
* Managing database relationships and optimizing query performance
* Leading development teams and establishing effective workflows
* Balancing technical debt with feature delivery

<div class="project-links">
  <a href="https://github.com/sugan0tech/Event-Manager" class="github-link">View on GitHub</a>
</div>

<div class="project-meta">
  <span class="tech-badge">Spring Boot</span>
  <span class="tech-badge">REST APIs</span>
  <span class="tech-badge">Hibernate</span>
  <span class="tech-badge">Java</span>
  <span class="tech-badge">MySQL</span>
  <span class="tech-badge">OAuth2</span>
  <span class="date-badge">March 2023</span>
</div>
