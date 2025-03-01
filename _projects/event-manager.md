---
layout: project
title: Event-Manager
date: 2023-01-19
description: A suite of backend services for managing university events with comprehensive APIs and security features. Implements an innovative approach to hierarchy-based access control. Primary service written in Spring Boot and secondary export service written in Go for enhanced concurrency.
github_link: https://github.com/sugan0tech/event-manager
tags: [springboot, clean-architecture, event-manager, api-design, java]
---
<p class="message">
  A suite of backend services for managing university events with comprehensive APIs and security features. Implements an innovative approach to hierarchy-based access control. Primary service written in Spring Boot and secondary export service written in Go for enhanced concurrency.
</p>

## Overview
Event-Manager is a robust service designed to streamline the management of university events and associated paperwork. Built with Spring Boot, Go, and Flutter, the application provides a comprehensive API for event creation, attendance tracking, and resource management. This project demonstrates my capabilities in both technical implementation and team leadership (led a team of 5 developers to accomplish this).

## Leadership & Team Experience
* Led a cross-functional team of 5 developers through the full development lifecycle
* Established Git workflow with branch protection and pull request reviews
* Implemented CI/CD pipeline for automated testing and deployment
* Mentored junior developers on Spring ecosystem best practices

## Technical Implementation
### Core Architecture
* **Spring Boot**: Built on Spring Boot 2.7 for rapid development and production-ready features
* **Storage Optimization**: Uses an elegant approach to store frequent data such as hourly attendance, trading computation for significant storage savings
* **Hibernate/JPA**: Implemented robust ORM layer with optimized queries
* **Security**: Addition of an innovative role-based system integrated with existing class codes
* **Validation**: Custom validators with comprehensive error responses
* **Go**: Built on Go 1.21 to implement the attendance export feature with superior concurrency

### Code Quality & Testing
* Comprehensive unit tests using JUnit 5 and Mockito
* Prominently using Java Streams, Optional APIs to improve code quality and readability
* Sonar analysis for code quality enforcement
* Structured logging with correlation IDs
* Using Vertical Slice architectural pattern for future expansion into microservices

## Key Features
* **Event Management**: CRUD operations with filtering, sorting, and pagination
* **User Administration**: Role-based access control for different stakeholder types, using a novel ClassCode authorization approach
* **Resource Allocation**: Smart allocation of venues and equipment
* **Notification System**: Email and in-app notifications
* **Reporting**: Attendance analytics and event participation metrics
* **Audit Trail**: Comprehensive activity logging for compliance

## Domain Model
The following entity relationships were extracted from the class diagram:
* **User** (Admin, Organizer, Attendee) - Manages authentication and role-based access
* **Event** - Core entity representing a scheduled event with details like name, description, date, and location
* **Venue** - Represents locations where events are held, linked to multiple events
* **Registration** - Tracks which attendees are registered for which events
* **Feedback** - Allows attendees to submit reviews and ratings for events
* **Notification** - System-generated alerts for users regarding event updates
* **Resource** - Manages event-related assets like equipment or rooms

## Innovative Authorization: ClassCode-Based Access Control
Instead of typical role-based access, I implemented a more flexible system using staff members' ClassCode as an authorization parameter. This allows for granular permission control based on department, year, and section hierarchies.

The `ClassCodeService` implements comparison logic to determine if a user has access to specific resources:

```java
@Service
@Slf4j
public class ClassCodeService {
    private List<String> departments;
    private List<String> years;
    private List<String> sections;
    
    public ClassCodeService(){
        this.departments = new ArrayList<>(Arrays.asList("CSE", "ECE", "EEE", "AIDS"));
        this.years = new ArrayList<>(Arrays.asList("I", "II", "III", "IV", "V"));
        this.sections = new ArrayList<>(Arrays.asList("A", "B", "C"));
    }
    
    public boolean compareCodes(String target, String given){
        if(target.length() < given.length())
            return false;
        if(given.charAt(0) == 'I' && target.charAt(0) == 'I'){
            String[] targetArray = target.split(" ");
            StringBuilder targetWithoutYear = new StringBuilder();
            String[] givenArray = given.split(" ");
            StringBuilder givenWithoutYear = new StringBuilder();
            
            if(!targetArray[0].equals(givenArray[0]))
                return false;
                
            for(int i = 1; i < targetArray.length; i++)
                targetWithoutYear.append(targetArray[i]);
            for(int i = 1; i < givenArray.length; i++)
                givenWithoutYear.append(givenArray[i]);
                
            return targetWithoutYear.toString().contains(givenWithoutYear.toString());
        }
        return target.contains(given);
    }
}
```

## Optimized Storage: Bit Manipulation for Attendance Tracking
For attendance tracking across 7 periods per day, I implemented a bit manipulation approach instead of storing 7 separate boolean values. This significantly reduces storage requirements while maintaining all functionality.

```java
@Getter
@Slf4j
public class PeriodSet {
    private static final int BINARY_SIZE = 7; // 7 bits
    private static final int SIZE = 127; // 7 bits
    private int value;
    
    // Implementation methods
    // ...
}
```

### Storage Optimization Calculation:
**Traditional approach:** 8 bytes × 7 periods × 4,000 students × 250 days = 56,000,000 bytes (≈ 56 MB)  
**Optimized approach:** 1 byte × 7 periods × 4,000 students × 250 days = 7,000,000 bytes (≈ 7 MB)

This optimization represents a 87.5% reduction in storage requirements for attendance data, while maintaining all functionality and offering better performance.

## Effective Use of Java Streams and Modern Java Practices
The codebase leverages modern Java features like Streams and Optional APIs for cleaner, more maintainable code:

```java
public Set<Teacher> findByClassCode(String classCode){
    List<Teacher> teacherSet = teacherRepository.findAll();
    return teacherSet.stream()
        .filter(teacher -> classCodeService.compareCodes(teacher.getClassCode(), classCode))
        .collect(Collectors.toSet());
}

public List<Event> findEvents(String teacherId){
    String teacherClassCode = teacherRepository.findById(teacherId)
        .orElse(new Teacher())
        .getClassCode();
        
    return eventService.findAll().stream()
        .filter(event -> 
            classCodeService.compareCodes(event.getClassCode(), teacherClassCode) && 
            (event.getEndDate().compareTo(new Date()) >= 0)
        )
        .collect(Collectors.toList());
}
```

## Outcomes
This application solved a real-world problem I faced during my university years. Many paper-based and redundant processes could be easily automated, so I took the initiative to create this solution. The application was in active use at the university for several months, significantly reducing administrative overhead and improving event organization efficiency. Eventually, the university transitioned to a third-party solution when the core development team (including myself) became unavailable for further maintenance and assistance.

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
  <span class="tech-badge">Go</span>
  <span class="date-badge">March 2023</span>
</div>
