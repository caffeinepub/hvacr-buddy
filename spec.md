# HVAC Mentor AI

## Current State
MentorChat routes all input as problem descriptions (diagnostic flows). No how-to instructional mode exists.

## Requested Changes (Diff)

### Add
- howToLogic.ts: how-to guides with tools needed, steps, tips per topic
- detectHowToQuery(): detects how-to intent from input
- HowToCard component to render step-by-step instructions inline

### Modify
- MentorChat processInput(): check for how-to queries first
- MentorStage type: add "howto" stage
- Placeholder text updated

### Remove
- Nothing

## Implementation Plan
1. Create howToLogic.ts with 10+ guides and detection function
2. Add HowToCard in MentorChat
3. Update processInput() to handle how-to before diagnostic flow
4. Add howto to MentorStage
5. Update placeholder text
