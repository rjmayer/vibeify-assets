# 00-mvp-ma-test-v2

## Project Name
**MoodMesh**

## Executive Summary
MoodMesh is a cross‑platform mobile app that helps users understand and regulate their emotional patterns using lightweight daily mood check‑ins and adaptive micro‑interventions. It blends behavioural psychology with effortless UI to gently nudge users toward better wellbeing.

## Problem Statement
Many people struggle with subtle emotional fluctuations that don’t warrant therapy but still impact daily life. Existing mood‑tracking apps are either too clinical, too complex, or too superficial. Users want something lightweight, private, and meaningful without feeling like they’re doing homework.

## Target Audience
- Adults (18–45) with busy lifestyles seeking simple wellbeing support
- Students managing stress and academic pressure
- Professionals looking for emotional pattern insights
- Users uninterested in traditional mental‑health apps but open to micro‑self‑improvement

## Core Features (MVP)
1. **10‑Second Mood Check‑In**  
   Emoji‑based quick capture of mood, energy, and stress level.
2. **Context Tags**  
   Users add small tags (e.g., Work, Social, Alone, Outdoors) to provide lightweight context.
3. **Adaptive Micro‑Tips**  
   Short bite‑sized actionable suggestions based on recent entries.
4. **Minimal Trends View**  
   A simple weekly graph showing mood variations.
5. **Local‑Only Storage**  
   Private by default; no account required.

## Technical Stack
- **Framework:** React Native (Expo)  
- **State Management:** Zustand or Jotai  
- **Database:** SQLite (via Expo SQLite)  
- **Charts:** Victory Native or Recharts‑Native  
- **Build:** EAS (Expo Application Services)

## User Flow
1. **Onboarding** → User selects theme + notification preference.  
2. **Home Screen** → Shows today’s mood tile + button to log mood.  
3. **Check‑In Flow** → Emoji selection → optional context tags → save.  
4. **Insights Screen** → Shows weekly graph + auto‑generated short tips.  
5. **Settings** → Theme, reminders, data export (future).

## Success Metrics
- Daily Active Users (DAU)  
- Percentage of users completing ≥3 check‑ins per week  
- Check‑in completion rate  
- Retention (7‑day and 14‑day)

## Development Timeline
**Phase 1 – Foundation (Project Setup & UI Skeleton)**  
Navigation, theme system, dummy screens.

**Phase 2 – Database + Check‑In Flow**  
Local storage, mood entry logic, context tagging.

**Phase 3 – Insights Engine**  
Trend calculations + micro‑tip recommendations.

**Phase 4 – Polish & Release Prep**  
Animations, accessibility, store metadata.

## Future Enhancements
- Account sync + optional cloud backup  
- Smart notifications triggered by mood patterns  
- AI‑generated long‑form emotional summaries

