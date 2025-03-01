---
layout: page
title: Projects
permalink: /projects/
---

<div class="projects-container">
  <p class="projects-intro">
    Here are some of my key projects that demonstrate my technical skills and approach to software development. Each project represents different aspects of my expertise in backend development, architecture, and cloud solutions.
  </p>

  <div class="projects-list">
    {% assign sorted_projects = site.projects | sort: 'date' | reverse %}
    {% for project in sorted_projects %}
      <div class="project-card">
        <h2 class="project-title"><a href="{{ project.url }}">{{ project.title }}</a></h2>
        <p class="project-description">{{ project.description }}</p>
        
        <div class="project-meta">
          <div class="tech-stack">
            {% for tech in project.tech_stack %}
              <span class="tech-tag">{{ tech }}</span>
            {% endfor %}
          </div>
          
          {% if project.github_link %}
          <div class="project-links">
            <a href="{{ project.github_link }}" target="_blank" class="github-link">
              <span class="icon-text">GitHub</span>
            </a>
          </div>
          {% endif %}
        </div>
      </div>
    {% endfor %}
  </div>
</div>
