# Mobile Testing Workflow

## Quick Testing Methods

### 1. Browser DevTools (Fastest)
**Chrome/Edge:**
1. Press `F12` to open DevTools
2. Click the device toggle icon (or press `Ctrl+Shift+M`)
3. Select a mobile device from the dropdown (iPhone 12 Pro, Galaxy S20, etc.)
4. Test touch interactions by clicking (simulates touch)
5. Test different orientations (portrait/landscape)

**Recommended devices to test:**
- iPhone 12 Pro (390x844)
- iPhone SE (375x667)
- Samsung Galaxy S20 (360x800)
- iPad (768x1024)

### 2. Local Network Testing (Most Accurate)
**Setup:**
1. Start your dev server: `npm start`
2. Find your local IP address:
   - Windows: `ipconfig` (look for IPv4 Address)
   - Mac/Linux: `ifconfig` or `ip addr`
3. On your phone, connect to the same WiFi network
4. Open browser and navigate to: `http://YOUR_IP:3000`

**Example:** If your IP is `192.168.1.100`, visit `http://192.168.1.100:3000`

### 3. Netlify Deploy Previews (Production-like)
- Every push to GitHub automatically creates a deploy preview
- Check the Netlify dashboard for the preview URL
- Test on actual mobile devices using the preview URL

## Testing Checklist for Games

### Before Each Deploy:
- [ ] **2048 Game**
  - [ ] Board maintains square aspect ratio on all screen sizes
  - [ ] Swipe gestures work in all 4 directions
  - [ ] No page scrolling when touching the board
  - [ ] Tiles are readable on small screens

- [ ] **Snake Game**
  - [ ] Swipe gestures control snake direction
  - [ ] No page scrolling when touching the board
  - [ ] Game board is visible and playable on small screens
  - [ ] Food and snake are clearly visible

- [ ] **Tetris Game**
  - [ ] Top half touch rotates pieces (left=CCW, right=CW)
  - [ ] Bottom half touch moves pieces horizontally
  - [ ] No page scrolling when touching the board
  - [ ] Pieces are visible and distinguishable
  - [ ] Touch zone divider line is visible on mobile

- [ ] **Pong Game**
  - [ ] Paddle controls work on mobile
  - [ ] No page scrolling when touching the canvas
  - [ ] Canvas scales appropriately

### General Mobile Checks:
- [ ] All text is readable (minimum 14px font size)
- [ ] Buttons are large enough to tap (minimum 44x44px)
- [ ] No horizontal scrolling
- [ ] Navigation works on mobile
- [ ] Page loads quickly on mobile networks

## Browser DevTools Tips

### Throttling Network Speed:
1. Open DevTools Network tab
2. Click "No throttling" dropdown
3. Select "Fast 3G" or "Slow 3G" to simulate mobile networks

### Testing Touch Events:
- DevTools simulates touch events when in device mode
- Click and drag = swipe gesture
- Single click = tap

### Responsive Breakpoints to Test:
- **Mobile:** 320px - 480px
- **Tablet:** 481px - 768px
- **Desktop:** 769px+

## Common Mobile Issues to Watch For

1. **Touch target too small** - Buttons should be at least 44x44px
2. **Text too small** - Minimum 14px for body text
3. **Viewport not set** - Ensure `<meta name="viewport">` is in HTML
4. **Hover effects** - Don't rely on hover for critical functionality
5. **Fixed positioning** - Can cause issues with mobile keyboards
6. **Page scrolling** - Use `touch-action: none` on game elements

## Automated Testing (Future Enhancement)

Consider adding:
- Playwright for automated mobile testing
- Lighthouse CI for performance monitoring
- Visual regression testing with Percy or Chromatic

## Quick Command Reference

```bash
# Start dev server
npm start

# Build for production
npm run build

# Deploy to Netlify
git push origin main

# Find your local IP (Windows)
ipconfig

# Find your local IP (Mac/Linux)
ifconfig
```

## Resources

- [Chrome DevTools Device Mode](https://developer.chrome.com/docs/devtools/device-mode/)
- [MDN Touch Events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)
- [Web.dev Mobile Testing](https://web.dev/mobile/)
