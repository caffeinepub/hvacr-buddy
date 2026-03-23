# HVAC Mentor AI

## Current State
App has a Videos tab (Version 59/60) with 17 videos across 5 categories (Electrical, Refrigerant, Airflow, Troubleshooting, Tools). Videos use YouTube embed URLs and open in an in-app player.

## Requested Changes (Diff)

### Add
- New curated video library with 20 verified videos across 5 new categories: EPA 608, Tools, Refrigerant, Airflow, Troubleshooting
- Fallback "Watch in browser" button if embed fails to load

### Modify
- Replace current video data with the new curated set:
  - EPA 608: 5 videos (Core Prep Part 1 & 2, Type 1, Type 2, Type 3)
  - Tools: 4 videos (Multimeter 101, Relays/Contactors/Transformers, Refrigerant Gauges, Basic Tools)
  - Refrigerant: 3 videos (Evacuate AC System, Refrigerant Recovery, Superheat & Subcooling)
  - Airflow: 4 videos (Impact on Performance, Symptoms of Low Airflow, 20 Causes, Coil Freeze)
  - Troubleshooting: 4 videos (AC Not Turning On, Outdoor Unit Not Running, Air Handler Not Working, AC Not Cooling)
- All embed URLs are pre-converted to https://www.youtube.com/embed/{id} format
- Each video card shows title, category, and description
- Embedded player uses iframe with allow attributes for autoplay/fullscreen
- On iframe error or load failure, show fallback "Watch in browser" button linking to youtube.com/watch?v={id}

### Remove
- Old video data (Electrical category and previous video set)

## Implementation Plan
1. Update the video data array in the Videos tab component with all 20 curated videos and correct embed URLs
2. Rename categories to match: EPA 608, Tools, Refrigerant, Airflow, Troubleshooting
3. Add iframe error handling with fallback button
4. Ensure search filters across all 5 new categories
