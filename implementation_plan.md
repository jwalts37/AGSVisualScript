# Goal Description

The goal is to wrap our existing Vite + React web application in the **Tauri** framework. This will convert our project from a simple website into a native Windows Desktop application (`.exe`). Doing this will give our Node Editor the crucial ability to read and write directly to the user's local AGS project directories (to parse XML, scripts, and backgrounds).

## User Review Required

> [!WARNING]
> Because Tauri creates real native Windows applications (via a Rust backend), **it requires the Rust compiler and Microsoft C++ Build Tools installed on your computer.**
> If you have never run Rust or C++ programs before, you may need to install them. I cannot automatically install MSVC tools for you. 
> 
> *   Do you already have the Rust toolchain installed, or do you have a way to install it (e.g., rustup)? Does this limitation work for you right now?

## Proposed Changes

### 1. Tauri Dependencies
We will install the Tauri core toolchain and the JS APIs required to talk to the operating system.
- `npm install -D @tauri-apps/cli`
- `npm install @tauri-apps/api @tauri-apps/plugin-dialog` (The plugin-dialog is specifically for popping open the Windows File Explorer window).

### 2. Scaffold Tauri Backend
I will run the Tauri setup command in non-interactive mode targeting our existing Vite environment.
#### [NEW] src-tauri/*
- This directory will be automatically generated. It contains the Rust backend configurations (`tauri.conf.json`) and the main Window logic.
- I will configure `tauri.conf.json` to tell the `.exe` to look for our Vite Dev Server at `http://localhost:5173` during development.

### 3. Application Layout Update
#### [MODIFY] src/App.tsx
- Add a new "Open Project" button next to "Export Game".
- We will wire this button up to Tauri's `open()` dialog API, ensuring it falls back gracefully if we are still testing in a browser instead of the `.exe`.

## Open Questions

- Given the Rust prerequisite, are you comfortable proceeding with the installation steps? If Tauri fails to build because of missing C++ tools on your system, we can still develop the UI in the browser and mock the file data for now!

## Verification Plan

### Automated Tests
- Run `npx tauri dev`. This should compile the native Windows application shell and open our existing React UI inside of a standalone window on your desktop (not inside Chrome edge).

### Manual Verification
- We will verify that clicking the new "Open Project" button actually spawns a real Windows OS File Browser dialog.
