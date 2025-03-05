---
layout: project
title: GatherSpace
description: A virtual collaborative workspace with proximity-based communication built using Spring Boot and React
tech_stack: [Spring Boot, React, WebRTC, MongoDB, MySql]
github_link: https://github.com/GatherSpace
date: 2025-01-01
---

<p class="message">
  A metaverse-inspired collaborative platform that combines virtual spaces with proximity-based communication, creating natural team interactions in a digital environment.
</p>

## Overview

GatherSpace is a virtual workspace platform that reimagines remote collaboration by simulating physical office environments. Currently in its initial development phase, this project serves as an open-source alternative to Gather.Town, focusing on enterprise use cases with enhanced security and customization options.

## Technical Implementation

* **Backend**: Spring Boot with WebSocket support for real-time interactions
* **Frontend**: React with WebGL for rendering interactive spaces
* **Real-time Communication**: WebRTC for voice and video capabilities
* **State Management**: Redux for application state and user movement tracking
* **Persistence**: MongoDB for user data and space configurations

## Architecture

```
┌───────────────────────────────────────────┐
│               Client Layer                │
│  ┌─────────┐  ┌────────┐  ┌───────────┐   │
│  │  React  │  │ WebGL  │  │  WebRTC   │   │
│  │   UI    │  │ Render │  │ Handlers  │   │
│  └─────────┘  └────────┘  └───────────┘   │
└─────────────────────┬─────────────────────┘
                      │
┌─────────────────────▼─────────────────────┐
│           Communication Layer             │
│  ┌─────────────┐     ┌─────────────────┐  │
│  │  WebSocket  │     │  REST API       │  │
│  │ Connection  │     │  Endpoints      │  │
│  └─────────────┘     └─────────────────┘  │
└─────────────────────┬─────────────────────┘
                      │
┌─────────────────────▼─────────────────────┐
│             Backend Services              │
│  ┌─────────┐ ┌─────────┐ ┌─────────────┐  │
│  │  Space  │ │  User   │ │ Interaction │  │
│  │ Service │ │ Service │ │  Service    │  │
│  └─────────┘ └─────────┘ └─────────────┘  │
└─────────────────────┬─────────────────────┘
                      │
┌─────────────────────▼─────────────────────┐
│                Database                   │
│  ┌─────────────────────────────────────┐  │
│  │              MongoDB                │  │
│  └─────────────────────────────────────┘  │
└───────────────────────────────────────────┘
```

## Key Features

* **Virtual Workspace Rooms**: Custom-designed spaces for different collaboration needs
* **Proximity-Based Communication**: Audio and video streams that activate based on virtual distance
* **Avatar Interaction**: Real-time movement and interaction between users
* **Customizable Environments**: Tools for creating and modifying virtual spaces
* **Organization-Level Management**: Administrative controls for enterprise environments

## Implementation Challenges

* **Real-time Movement Synchronization**: Ensuring smooth, low-latency user movement across clients
* **WebRTC Optimization**: Handling multiple simultaneous audio/video streams efficiently
* **Spatial Audio Implementation**: Creating realistic audio attenuation based on virtual distance
* **Collision Detection**: Implementing accurate collision systems for avatars and environment objects

## Current Development Focus

As this project is in its initial phase, development is currently centered on:

* Core movement and interaction mechanics
* Basic room creation and management
* Foundational WebRTC integration for proximity communication
* User authentication and basic administrative controls

GatherSpace demonstrates my ability to architect complex real-time applications with multiple technical components while focusing on creating intuitive, engaging user experiences that solve real business collaboration challenges.

<div class="project-links">
  <a href="https://github.com/sugan0tech/gatherspace" class="github-link">View on GitHub</a>
</div>

<div class="project-meta">
  <span class="tech-badge">Spring Boot</span>
  <span class="tech-badge">React</span>
  <span class="tech-badge">WebRTC</span>
  <span class="tech-badge">MongoDB</span>
  <span class="tech-badge">WebSockets</span>
  <span class="date-badge">November 2024</span>
</div>
