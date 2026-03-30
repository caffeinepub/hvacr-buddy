# HVAC Mentor AI

## Current State
The app is at Version 68. BuddyPage and MentorChat are implemented with full-screen layout, correct colors (#1E293B Buddy bubbles, #0EA5E9 user bubbles), breathing glow avatar, thinking state, quick mode buttons, and avatar consistency. The core structure is in place.

## Requested Changes (Diff)

### Add
- Larger text size in chat bubbles (text-base / 16px minimum) for field readability
- More generous vertical spacing between messages (gap-5 instead of gap-4)
- `identification` stage should show a "Start Over" button when done (same as `howto`/`diagnosis`)
- Input placeholder text color should be clearly readable (#94A3B8 instead of muted)
- Buddy 'thinking' dots should be sky blue (#38BDF8) to match brand

### Modify
- MentorChat fullscreen: increase message text to `text-base leading-relaxed` for readability
- BuddyPage header: ensure subtitle is `#94A3B8` (readable) not too faint
- MentorChat input: text color should be `#F8FAFC`, placeholder `#64748B`
- User bubble: ensure background is solid `#0EA5E9` with `#FFFFFF` text, no transparency issues
- Buddy bubble: `#1E293B` bg, `#F8FAFC` text - ensure no CSS variable overrides
- Quick reply buttons: ensure border is `rgba(56,189,248,0.3)` and text is `#F8FAFC`
- System/label text across app: ensure it reads as `#CBD5E1` not near-white on light or near-invisible on dark
- Remove `stage !== 'identification'` from Start Over condition so it shows for that stage too

### Remove
- Nothing

## Implementation Plan
1. In `MentorChat.tsx`:
   - Increase `text-sm` to `text-base` in `MentorBubble`, `UserBubble`, `ThinkingBubble` message text
   - Increase spacing in fullscreen message list from `space-y-4` to `space-y-5`
   - Add `identification` to the Start Over condition
   - Fix thinking dots to use `#38BDF8` color
   - Fix input placeholder color explicitly
2. In `BuddyPage.tsx`:
   - Ensure subtitle text has good readable contrast
   - Ensure quick mode buttons are clearly readable
3. Cross-check all text colors for contrast compliance on dark `#0F172A` background
