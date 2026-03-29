# HVAC Mentor AI — Buddy UI Full Upgrade

## Current State
- BuddyPage exists at `/pages/BuddyPage.tsx` with a dedicated tab layout
- MentorChat is the main chat engine, used inside BuddyPage via `flex-1 min-h-0` container
- MentorChat internally uses `ScrollArea` with fixed height `h-72` (non-compact) — does NOT fill parent
- Buddy bubbles: `#1E293B` bg, `#F8FAFC` text — correct
- User bubbles: oklch teal (~`#0EA5E9`) — needs exact `#0EA5E9` bg, `#FFFFFF` text
- System/muted text: uses `oklch(var(--muted-foreground))` — needs to render as `#CBD5E1` on dark surfaces
- Thinking state already exists with animated dots
- Mode buttons (Diagnose/How-To/Identify Part) already exist in BuddyPage below input
- BottomTabBar already exists with [Home][Buddy][Tools][Videos]

## Requested Changes (Diff)

### Add
- `fullscreen` prop to MentorChat that makes it fill parent height (flex col, ScrollArea becomes flex-1)

### Modify
- MentorChat: accept `fullscreen?: boolean` prop; when true, root becomes `h-full flex flex-col`, progress/input sections are `flex-none`, ScrollArea becomes `flex-1 min-h-0` with `h-full`
- MentorChat: UserBubble color → exact `#0EA5E9` background, `#FFFFFF` text
- MentorChat: all `color: 'oklch(var(--muted-foreground)...'` labels on dark surfaces → use literal `#CBD5E1` or `#94A3B8` for readability on dark backgrounds
- BuddyPage: pass `fullscreen={true}` to MentorChat
- BuddyPage: remove the hardcoded quick-mode buttons section below chat (since they overlap with BottomTabBar) — keep them ABOVE the input inside MentorChat OR keep in the dedicated area but ensure no double padding causing overlap. Currently there's `pb-[calc(0.5rem+56px)]` which accounts for the tab bar — keep that
- Ensure the input area in BuddyPage full-screen mode doesn't get blocked by keyboard — use `env(safe-area-inset-bottom)` and ensure scroll area adjusts

### Remove
- Nothing removed structurally

## Implementation Plan
1. Add `fullscreen` prop to MentorChat interface
2. When `fullscreen=true`: wrap entire component in `h-full flex flex-col` div; make the chat ScrollArea section `flex-1 min-h-0` (height fills remaining space)
3. Fix UserBubble: background `#0EA5E9`, text `#FFFFFF`
4. Fix all muted label text in dark contexts (inside MentorChat): use `#94A3B8` explicitly instead of oklch CSS vars that may resolve to light-theme colors
5. Thinking state text: ensure it uses `#CBD5E1` readable color
6. BuddyPage: pass `fullscreen={true}` to MentorChat
7. Validate build passes
