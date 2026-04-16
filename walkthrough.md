# Standalone Desktop App Upgrade (Tauri)

We have successfully wrapped our web-based graph editor in the Tauri framework, converting it into a true native Windows application.

## Changes Made

### 1. Tauri Backend Scaffolded
- Initialized the `src-tauri` directory which holds the Rust backend code that connects our UI to the Windows operating system.
- Hooked Tauri into our Vite development server so the native `.exe` window instantly updates whenever we save a React file.
- Added Tauri specific NPM scripts to `package.json`.

### 2. "Open Game Folder" Feature
- Updated the React UI `App.tsx` top navbar. You will notice a new **Open AGS Project** button.
- I imported the `@tauri-apps/plugin-dialog` API and wrote a function that asks the Windows OS to open a native file selection prompt when you click that button!
- *Note:* I added a safety check. If you click that button in your Google Chrome browser right now, it will politely alert you that you need to be running the native `.exe` version, because regular web browsers cannot arbitrarily open local folders for security reasons.

## How to Test the Magic

We are ready for the big moment! You can build the native application using the command below. 

> [!NOTE]
> The first time you run this command, it will take several minutes to compile because it has to download all the Rust core libraries from scratch. Feel free to grab a coffee!

Open your IDE Terminal and run:
```powershell
cd "d:\DEV\DESKTOP_PROJECTS\AGS(2024)\AGSVisualScript"
npm run tauri dev
```

Once it compiles, a beautiful separate native Windows application will pop open on your desktop. Click the **"Open AGS Project"** button in that app to test the native UI dialog!
