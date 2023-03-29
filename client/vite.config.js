import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


// TODOS:
// - Get server working: forward the XHR requests across.
// - - Instead of generating endpoints, just hardcode them on the frontend. It won't take that long.
// - - Magic is harder to debug than anything else and not worth the time.
// - - Declare an environment variable somehow? Is there a better way of running the backend through nextjs?
// make the mouse change when moving over buttons, to appear as if they are clickable (the pointy cursor).

// Mondrianesque generative tiling on the front screen.
// - Align the title and home page buttons such that they fit in boxes; one to left, one to right, etc.
// - Generate those animated mondrian div/s around them to fill the page with subdivided boxes.

// Start getting the game to work!
// - Make an interface with a tile pool and a personal score set of tiles.
// - Implement game functionality for shuffling, generating, dealing, taking tiles, etc...

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
})
