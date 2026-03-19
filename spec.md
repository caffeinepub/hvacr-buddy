# HVACR Buddy

## Current State
The HVAC Mentor chat (MentorChat.tsx + mentorLogic.ts) already runs a step-by-step troubleshooting flow with acknowledgment, follow-up questions, and a diagnosis card. The tone and language, however, are somewhat generic and don't fully embody the "Buddy" persona.

## Requested Changes (Diff)

### Add
- "Buddy" branding: avatar/name label in the mentor chat header shows "Buddy" with a field-tech persona description
- Safety banners integrated inline in the conversation flow (not just at diagnosis) when electrical, capacitor, refrigerant, or high-pressure topics come up
- Diagnosis message uses Buddy's DIAGNOSIS MODE format: "Based on what you've told me, the most likely issue is: [problem]. Next step: [action to confirm or fix]"

### Modify
- All acknowledgment strings in `mentorLogic.ts` updated to Buddy's voice: calm, confident, practical (e.g., "Alright, let's check this real quick.", "Good — that helps narrow it down.")
- Follow-up question text updated to match Buddy's one-at-a-time, field-tech tone
- Quick answer buttons display as [ Yes ] [ No ] [ Not Sure ] where appropriate
- Diagnosis card header changed from "Likely Causes" to Buddy's format: "Based on what you've told me, the most likely issue is:" with the top cause featured prominently, then "Next step:" for the check
- The "Okay, I have enough to go on. Here's my read:" transition message updated to Buddy's voice
- MentorChat placeholder text and reset button updated to Buddy's tone
- Dashboard mentor card identifies the assistant as "Buddy" with the tagline "Your HVAC Field Mentor"

### Remove
- Nothing removed

## Implementation Plan
1. Update `mentorLogic.ts`: rewrite all acknowledgment strings, follow-up question texts, and quick answer labels to match Buddy's voice and structure
2. Update `MentorChat.tsx`: update transition messages, avatar label to show "Buddy", diagnosis card layout to use Buddy's format, and reset button text
3. Update `Dashboard.tsx`: update the mentor card title/subtitle to show "Buddy — Your HVAC Field Mentor"
