# HVAC Mentor AI

## Current State
- App has Dashboard, Diagnose, Jobs, Learn, Tools, Videos pages
- Navigation is done via cards/buttons inside Dashboard (no persistent bottom tab bar)
- Buddy (MentorChat) is embedded as a component inside Dashboard and DiagnosePage — not a standalone full-screen page
- MentorChat.tsx is 1329 lines, has existing chat logic, intent detection, troubleshooting flows, how-to guides, identification mode, tool/part guidance
- No dedicated `/buddy` route exists

## Requested Changes (Diff)

### Add
- A persistent bottom tab bar with 4 tabs: [ Home ] [ Buddy ] [ Tools ] [ Videos ]
- A new `/buddy` route and `BuddyPage.tsx` — a dedicated full-screen Buddy chat interface
- BuddyPage layout:
  - Top: Buddy avatar (circular, with breathing glow), "Buddy ● Online" status with pulsing green dot, subtitle "Field Mentor • 15+ Years Experience"
  - Middle: Full-height scrollable chat area — large text, clear message spacing, visual hierarchy
  - Bottom: Full-width input bar (placeholder: "Describe the issue or ask a question...") + Send button
  - Below input: Quick mode buttons [ Diagnose Issue ] [ How-To ] [ Identify Part ]
- Mode buttons inject the correct intent into the chat (troubleshooting / instruction / identification mode)
- "Thinking..." animated indicator while Buddy processes
- Keyboard-safe layout (chat area scrolls above keyboard, messages not blocked)

### Modify
- App.tsx: add `/buddy` route pointing to BuddyPage
- Dashboard: bottom tab bar replaces or supplements the existing nav card grid (or bottom tab bar is a layout wrapper around all pages)
- The bottom tab bar should be visible on Home, Buddy, Tools, and Videos tabs
- BuddyPage reuses the existing MentorChat logic (or extracts it) for the actual chat engine

### Remove
- Nothing removed; Buddy card on Dashboard can remain as shortcut

## Implementation Plan
1. Create `src/frontend/src/pages/BuddyPage.tsx` — full-screen Buddy chat UI, reusing MentorChat component or its logic
2. Add `/buddy` route in App.tsx
3. Create a persistent `BottomTabBar` component with 4 tabs: Home (`/`), Buddy (`/buddy`), Tools (`/tools`), Videos (`/videos`) — shown at bottom of viewport
4. Wrap main app layout so the bottom tab bar appears on all relevant pages
5. BuddyPage: header with avatar + status + subtitle, full-height chat area (calc height minus header/input), input bar at bottom, quick mode buttons below input
6. Quick mode buttons prepend a hidden or visible intent prefix to direct Buddy into correct mode
7. Ensure smooth scrolling, message spacing >= 12px, font size >= 15px
