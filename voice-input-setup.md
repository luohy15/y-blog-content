---
created: 2025-11-23
tags: [knowledge/technical/workspace, macos, ios, productivity, ai]
---

# macOS & iOS Voice Input Setup with Spokenly and Eleven Labs

## Overview

Voice-to-text setup using Spokenly app with ElevenLabs transcription API.

> **Note**: This article was written using the voice input setup described here with Claude Code.

**Motivation**: Wrist discomfort from prolonged typing/mouse usage led to exploring voice-based interaction with AI coding agents. This setup enables hands-free coding productivity when experiencing RSI symptoms, reducing wrist strain while maintaining development workflow.


## Setup Process

### Application
- **[Spokenly](https://spokenly.app/)** - Lightweight macOS/iOS app that connects to transcription APIs

### Transcription API
- **[Eleven Labs](https://elevenlabs.io/app/developers/api-keys)** - Provides the speech-to-text transcription. Excellent voice processing quality.
- Transcription model: **[scribe_v2](https://elevenlabs.io/docs/models#scribe-v2-realtime)** (non-real-time version, as of 2025-11-23 Spokenly doesn't support real-time for this model)
- **Pricing**: Requires at least a Starter plan ($5/month) to use the latest transcription models

### Hardware (Optional)
- **External microphone** - Only needed for macOS clamshell mode (closed lid)
- macOS privacy feature disables built-in mic when lid is closed
- Built-in microphone works fine if using Mac with lid open or on iOS devices
- Wired earphones work great - tiny mic you can position anywhere on desk

## Workflow

1. Hit your shortcut (e.g., right command key) anywhere you want voice input
2. Works in any text input field - for me, most commonly used in Claude Code input area
3. Local storage: Original audio files and transcribed text with timestamps saved locally
   - Fun to write scripts analyzing your own voice patterns and word usage

### Use Cases by Frequency

**1. Most frequent - Default setup**
- Wired earphones mic positioned at comfortable spot on desktop
- Tiny, convenient, always ready
- Primary workflow

**2. Second - Night time**
- Hold microphone with hand
- Allows speaking quietly while keeping clarity
- When need to minimize noise

**3. Least frequent - Hand fatigue backup**
- Use bottle or other objects as mic stand
- Only when hands uncomfortable from holding
- Should rarely occur

![Voice input setup](https://cdn.luohy15.com/voice-input-setup.png)
