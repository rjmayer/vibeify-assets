---
name: Weather client + caching
about: Implement weather lookup client with offline caching/backfill
title: Weather client + caching/backfill
labels: area:weather, priority:medium
assignees: 
---

## Goal
Add a small weather client (Open-Meteo / OpenWeatherMap) that can fetch current conditions, cache results locally, and backfill queued requests when online.

## Tasks
- Implement fetcher module (`src/weather/` or similar) with a simple adapter pattern.
- Cache responses (per-location + timestamp) locally; use a TTL.
- Queue weather lookups when offline and process queue on connectivity restore.
- Add tests for caching logic and an interface for injecting a mock network layer.

## Acceptance criteria
- Weather autofill works when adding a catch online and uses cached data when offline.
- Queue backfill runs after simulated offline period.
