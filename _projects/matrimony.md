---
layout: project
title: Matrimony Platform
date: 2024-06-15
tags: [asp-dotnet-core, entity-framework, jwt-authentication]
---

<p class="message">
  A secure matrimonial platform built with ASP.NET Core featuring tiered membership, intelligent matchmaking, and robust authentication.
</p>

## Overview

Developed a comprehensive matrimonial platform that enables users to create and manage profiles, discover compatible matches, and communicate securely. The system implements a tiered subscription model with different access levels and features.

## Technical Highlights

* **Backend**: ASP.NET Core with clean architecture principles
* **Real-time Communication**: SignalR Hubs for WebSocket-based chat functionality
* **Database**: SQL Server with Entity Framework Core
* **Authentication**: JWT with refresh token rotation and account protection
* **Security**: Password hashing, input validation, account lockout after 5 failed attempts

## Key Features

* **Tiered Membership System**: Free, Basic ($5), and Premium ($15) plans with increasing access levels
* **Multi-Profile Management**: Users can manage profiles for family members or themselves
* **Intelligent Matchmaking**: Preference-based algorithm with compatibility scoring (1-7)
* **Secure Real-time Messaging**: WebSocket-based private chat using SignalR for premium members
* **Profile Analytics**: Track profile views and engagement metrics

## Architecture

```
┌─────────────────────────────────────────┐
│              Client Layer               │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│               API Layer                 │
│   ┌─────────┐  ┌──────┐  ┌──────────┐   │
│   │ Auth    │  │ Match │  │ Profile  │   │
│   │ Service │  │ API   │  │ API      │   │
│   └─────────┘  └──────┘  └──────────┘   │
│                                         │
│   ┌─────────────────────────────────┐   │
│   │      SignalR Chat Hub           │   │
│   └─────────────────────────────────┘   │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│           Application Layer             │
│   ┌───────────┐  ┌────────────────┐     │
│   │ Membership│  │ Matchmaking    │     │
│   │ Service   │  │ Algorithm      │     │
│   └───────────┘  └────────────────┘     │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│            Data Access Layer            │
│   ┌─────────────┐  ┌─────────────┐      │
│   │ Repositories │  │ EF Context  │      │
│   └─────────────┘  └─────────────┘      │
└───────────────────┬─────────────────────┘
                    │
┌───────────────────▼─────────────────────┐
│               Database                  │
└─────────────────────────────────────────┘
```

## Implementation Details

* **Clean Architecture**: Domain-driven design with proper separation of concerns
* **Custom Middleware**: Membership validation and request authentication
* **API Design**: RESTful endpoints with comprehensive validation
* **Scheduled Jobs**: Automated membership expiration handling

## Outcomes

Successfully implemented a secure, user-friendly matrimonial platform with complex business rules and relationship-based matching. The project demonstrates proficiency in authentication systems, domain modeling, and building subscription-based applications with ASP.NET Core.

<div class="project-links">
  <a href="https://github.com/sugan0tech/MiniProject/tree/main/Matrimony" class="github-link">View on GitHub</a>
</div>

<div class="project-meta">
  <span class="tech-badge">ASP.NET Core</span>
  <span class="tech-badge">Entity Framework</span>
  <span class="tech-badge">JWT Authentication</span>
  <span class="tech-badge">SQL Server</span>
  <span class="date-badge">November 2022</span>
</div>
