---
created: 2025-11-23
tags: [knowledge/technical/workspace, macos, productivity, ai]
---

# macOS Voice Input Setup with Spokenly and Eleven Labs

## Overview

Voice-activated productivity automation setup using Spokenly for detection and Eleven Labs for voice synthesis.

**Motivation**: Wrist discomfort from prolonged typing/mouse usage led to exploring voice-based interaction with AI coding agents. This setup enables hands-free coding productivity when experiencing RSI symptoms, reducing wrist strain while maintaining development workflow.

![Voice input setup](https://cdn.luohy15.com/voice-input-setup.png) 

## Setup Process

### Voice Detection
- **[Spokenly](https://spokenly.app/)** - Super lightweight macOS/iOS application, easy to use and connects to popular APIs like ElevenLabs

### Voice Synthesis
- **[Eleven Labs](https://elevenlabs.io/app/developers/api-keys)** - Excellent voice processing quality. Previously used their voice APIs for an AI role chat application.
- Transcribe model: **[scribe_v2](https://elevenlabs.io/docs/models#scribe-v2-realtime)** (non-real-time version, as of 2025-11-23 Spokenly doesn't support the real-time model yet)

## Workflow

1. Hit your shortcut (e.g., right command key) anywhere you want voice input
2. Works in any text input field - for me, most commonly used in Claude Code input area
3. Local storage: Original audio files and transcribed text with timestamps saved locally
   - Fun to write scripts analyzing your own voice patterns and word usage

