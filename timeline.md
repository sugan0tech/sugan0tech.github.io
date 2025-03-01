---
layout: page
title: My Journey
---

<div class="timeline-container">
  <p class="timeline-intro">
    A chronological overview of my professional and technical journey, from my early days with Linux to my current role as a Software Engineer.
  </p>

  <div class="timeline">
    {% assign events = site.data.timeline | sort: 'year' %}
    {% for event in events %}
      <div class="timeline-item">
        <div class="timeline-year">{{ event.year }}</div>
        <div class="timeline-content">
          <h3 class="timeline-title">{{ event.title }}</h3>
          <p class="timeline-description">{{ event.description }}</p>
        </div>
      </div>
    {% endfor %}
  </div>
</div>
