# Virtual Stream Deck

This project is a lightweight Electron application inspired by Elgato's Virtual Stream Deck. It uses React and Tailwind CSS in the renderer to provide a grid of configurable buttons for launching apps or scripts. The layout and behavior are defined in `config.json`.

## Features
- **Grid-based layout** that adapts to the window size.
- **Nested folders** via JSON configuration.
- **Launch commands** such as `.exe`, `.sh`, `.bat`, or `.ps1` files.
- **Custom icons** per button (use crisp 512x512 PNG/SVG or emoji).
- **Momentary hotkey** opens the window while held.
- **Simple JSON profiles** for easy editing.

## Getting Started
1. Install dependencies:
   ```bash
   npm install electron
   ```
2. Run the app:
   ```bash
   npm start
   ```

Edit `config.json` to customize the buttons, icons and hotkey. Provide 512x512 PNG or SVG images for the best looking icons. When a button has a `children` array, clicking it opens a subpage. Otherwise its `action` command is executed using the system shell.

The window has no title bar and hides automatically once you release the hotkey that summoned it, mimicking Elgato's overlay.

This repository does not bundle any binaries. Build Electron distributions with the tool of your choice once dependencies are installed.
