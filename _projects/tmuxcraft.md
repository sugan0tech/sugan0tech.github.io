---
layout: project
title: TmuxCraft
date: 2024-10-01
description: A modern Go-based alternative to tmuxifier with YAML configuration and cross-platform support
github_link: https://github.com/sugan0tech/tmuxcraft
tags: [go, cli, tmux, terminal-tools, open-source]
---

<p class="message">
  A modern Go-based CLI tool that replaces tmuxifier with enhanced session templating, YAML configuration, and cross-platform support for terminal power users.
</p>

## Overview

TmuxCraft is an open-source command-line tool that modernizes Tmux session management. Born from my experience as a long-time tmuxifier user, I created this alternative to address maintenance issues and outdated APIs in the original tool, while adding powerful new features for developers who rely on terminal-based workflows.

## Technical Implementation

* **Go Language**: Built entirely in Go for performance and cross-platform compatibility
* **YAML Configuration**: Human-readable session definitions replacing outdated formats
* **Cobra CLI Framework**: Structured command hierarchy with intuitive UX
* **Cross-Platform**: Supports Linux, macOS (Intel/ARM), and Windows

## Architecture

```
┌───────────────────┐        ┌───────────────────┐
│    CLI Interface  │◄──────▶│  Command Handlers │
└───────────┬───────┘        └─────────┬─────────┘
            │                          │
            ▼                          ▼
┌───────────────────┐        ┌───────────────────┐
│ Session Templates │◄──────▶│   Tmux Manager    │
└───────────┬───────┘        └─────────┬─────────┘
            │                          │
            ▼                          ▼
┌───────────────────┐        ┌───────────────────┐
│  Configuration    │        │  System Process   │
│  Manager          │        │  Interface        │
└───────────────────┘        └───────────────────┘
```

## Key Features

* **Template-Based Sessions**: Define complex layouts once, use them anywhere
* **Script Generation**: Export session configurations to shell scripts
* **Multi-Pane Management**: Create sophisticated window and pane arrangements
* **Project Presets**: Ready-made configurations for different development environments
* **Automatic Shell Completion**: Built-in completions for Bash, Zsh, and Fish

## Sample Configuration

```yaml
session_name: dev
path: ~/projects/current
windows:
  - name: editor
    command: nvim
    panes:
      - command: tty-clock -t
        split: h
        size: 20
      - command: bash
        size: 50
        split: v
  - name: server
    command: npm run dev
  - name: git
    command: lazygit
```

## Development Focus

As the project creator and maintainer, I've focused on:

* Building a robust CLI experience following modern best practices
* Ensuring compatibility across all major platforms including ARM processors
* Creating an intuitive configuration format that's easy to read and modify
* Implementing automated CI/CD with GitHub Actions for multi-platform builds

Currently in alpha phase 4, TmuxCraft demonstrates my ability to identify gaps in existing tools and create elegant, cross-platform solutions using Go's strengths in system programming and CLI development.

<div class="project-links">
  <a href="https://github.com/sugan0tech/tmuxcraft" class="github-link">View on GitHub</a>
</div>

<div class="project-meta">
  <span class="tech-badge">Go</span>
  <span class="tech-badge">CLI</span>
  <span class="tech-badge">Tmux</span>
  <span class="tech-badge">YAML</span>
  <span class="tech-badge">Cobra</span>
  <span class="date-badge">October 2024</span>
</div>
