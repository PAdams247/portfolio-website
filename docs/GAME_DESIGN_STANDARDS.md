# Game Design Standards

## Arcade-Style Game Layout Guidelines

This document defines the standard layout and design patterns for all arcade-style games on the portfolio website. Following these standards ensures a consistent, professional "arcade experience" across all games.

---

## Layout Structure

### Standard Two-Column Layout

```
┌─────────────────────────────────────────────────────────┐
│                    GAME PAGE                            │
├──────────────────────────┬──────────────────────────────┤
│                          │                              │
│    GAME BOARD            │    SIDEBAR                   │
│    (Left Column)         │    (Right Column)            │
│                          │                              │
│    - Larger              │    - Game Title              │
│    - Centered            │    - Score Display           │
│    - Visual Focus        │    - High Scores             │
│                          │    - Controls Info           │
│                          │    - Action Buttons          │
│                          │                              │
└──────────────────────────┴──────────────────────────────┘
│                                                          │
│    MOBILE CONTROLS (Hidden on Desktop)                  │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## Component Breakdown

### 1. Game Board (Left Column)
**Purpose:** Primary gameplay area - the star of the show

**Requirements:**
- Positioned on the LEFT side
- Larger than sidebar (minimum 300px width)
- Dark background with glowing border
- Border color: `rgba(0, 212, 255, 0.3)`
- Background: `rgba(0, 0, 0, 0.5)` with `backdrop-filter: blur(10px)`
- Border radius: `8px`
- Contains game overlay for pause/game over states

**CSS Classes:**
- `.game-board-container` - Wrapper with relative positioning
- `.game-board` - The actual game grid/canvas

---

### 2. Sidebar (Right Column)
**Purpose:** Game information, controls, and actions

**Structure (Top to Bottom):**

#### A. Game Info Panel
- **Game Title** (h2)
  - Font: `'Orbitron', monospace`
  - Size: `1.8rem`
  - Gradient text: `linear-gradient(45deg, #00d4ff, #ff6b6b)`
  - Centered

- **Stats** (Score, High Score, Level, etc.)
  - Each stat in its own row
  - Label on left, value on right
  - Border-bottom separator between stats
  - Value font: `'Orbitron', monospace`
  - Value color: `#00d4ff`

#### B. Controls Panel
- **Title:** "Controls" (h3)
- **Control List:**
  - Each control on separate line
  - Format: `[Key] [Action]` (e.g., "← → Move")
  - Font: `'Roboto Mono', monospace`
  - Color: `#a0a0a0`

#### C. Game Buttons
- **Pause Button** (if applicable)
- **New Game Button**
- Stacked vertically
- Gradient background: `linear-gradient(45deg, #ff6b6b, #ff4757)`
- Hover effect: Lift up 2px with enhanced shadow

**CSS Classes:**
- `.game-sidebar` - Main sidebar container
- `.game-info` - Info panel wrapper
- `.stat` - Individual stat row
- `.controls` - Controls panel wrapper
- `.game-buttons` - Button container

---

### 3. Mobile Controls (Bottom)
**Purpose:** Touch controls for mobile devices

**Requirements:**
- Hidden on desktop (`display: none`)
- Shown on mobile (`@media (max-width: 768px)`)
- Centered below game
- Button style:
  - Background: `rgba(0, 212, 255, 0.2)`
  - Border: `2px solid rgba(0, 212, 255, 0.4)`
  - Size: `60px × 60px`
  - Font size: `1.5rem`

**CSS Classes:**
- `.mobile-controls` - Container
- `.control-row` - Row of buttons
- `.control-btn` - Individual button

---

## Color Palette

### Primary Colors
- **Cyan/Blue:** `#00d4ff` - Primary accent, scores, borders
- **Red/Pink:** `#ff6b6b`, `#ff4757` - Buttons, warnings
- **Purple:** `#667eea`, `#764ba2` - Gradients, tiles

### Background Colors
- **Panel Background:** `rgba(255, 255, 255, 0.05)`
- **Panel Border:** `rgba(255, 255, 255, 0.1)`
- **Game Board Background:** `rgba(0, 0, 0, 0.5)`
- **Overlay:** `rgba(0, 0, 0, 0.85)`

### Text Colors
- **Primary Text:** `#ffffff`
- **Secondary Text:** `#a0a0a0`
- **Accent Text:** `#00d4ff`

---

## Typography

### Fonts
1. **'Orbitron', monospace** - Titles, scores, game values
2. **'Roboto Mono', monospace** - Controls, descriptions, buttons

### Font Sizes
- **Game Title (h2):** `1.8rem`
- **Section Title (h3):** `1.2rem`
- **Score Value:** `1.5rem`
- **Stat Label:** `0.9rem`
- **Control Text:** `0.9rem`
- **Button Text:** `1rem`

---

## Spacing & Sizing

### Container Dimensions
- **Max Width:** `800px` (game + sidebar combined)
- **Gap Between Columns:** `2rem`
- **Sidebar Min Width:** `250px`
- **Game Board Min Width:** `300px`

### Padding
- **Page Padding:** `2rem`
- **Panel Padding:** `1.5rem`
- **Stat Padding:** `0.5rem 0`
- **Button Padding:** `1rem 1.5rem`

### Gaps
- **Sidebar Sections:** `2rem`
- **Control List Items:** `0.5rem`
- **Button Stack:** `0.8rem`

---

## Interactive Elements

### Buttons
**Standard Button:**
```css
background: linear-gradient(45deg, #ff6b6b, #ff4757);
border: none;
border-radius: 12px;
padding: 1rem 1.5rem;
box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
transition: all 0.3s ease;
```

**Hover State:**
```css
transform: translateY(-2px);
box-shadow: 0 6px 20px rgba(255, 107, 107, 0.4);
```

**Disabled State:**
```css
opacity: 0.5;
cursor: not-allowed;
```

### Overlays
**Game Over / Pause:**
- Full coverage of game board
- Background: `rgba(0, 0, 0, 0.85)` with `backdrop-filter: blur(10px)`
- Centered message
- Large title with gradient
- Action button below

---

## Responsive Design

### Desktop (> 768px)
- Side-by-side layout
- Mobile controls hidden
- Full-size game board

### Mobile (≤ 768px)
- Stacked layout (game on top, sidebar below)
- Mobile controls visible
- Sidebar full width (max 400px)
- Smaller game board (adjust per game)

---

## Animation Standards

### Page Load
```css
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```
Duration: `0.6s ease-out`

### Button Interactions
- Hover: `transform: translateY(-2px)` in `0.3s`
- Active: `transform: scale(0.95)` in `0.2s`

### Score Updates
- Highlight animation when score changes
- Scale pulse: `1 → 1.05 → 1` over `1s`

---

## File Structure

### For Each New Game:
```
src/
├── pages/
│   └── YourGame.tsx          # Main game component
├── styles/
│   └── YourGame.css          # Game-specific styles
└── templates/
    ├── GameTemplate.tsx      # Reference template
    └── GameTemplate.css      # Reference styles
```

### Template Usage:
1. Copy `GameTemplate.tsx` and `GameTemplate.css`
2. Rename to your game name
3. Replace placeholder content with game logic
4. Maintain the layout structure
5. Customize colors/tiles as needed

---

## Future Enhancements

### Phase 3: Leaderboard System
**Database Integration:**
- Backend: Firebase, Supabase, or MongoDB
- Store: Player name/initials, score, timestamp, game ID
- Display: Top 10 scores per game
- UI: Leaderboard panel in sidebar

**Implementation:**
```typescript
interface LeaderboardEntry {
  id: string;
  playerName: string;
  score: number;
  timestamp: Date;
  gameId: string;
}
```

### Phase 4: Feature Request System
**User Feedback:**
- Comment form below game
- Store: Feature requests, game suggestions
- Admin panel to review requests
- Upvote system for popular requests

**Implementation:**
```typescript
interface FeatureRequest {
  id: string;
  gameId: string;
  playerName: string;
  request: string;
  upvotes: number;
  timestamp: Date;
  status: 'pending' | 'approved' | 'implemented';
}
```

---

## Checklist for New Games

Before adding a new game, ensure:

- [ ] Game board is on the LEFT
- [ ] Sidebar is on the RIGHT with all required sections
- [ ] Title uses Orbitron font with gradient
- [ ] Score displays prominently in sidebar
- [ ] Controls section lists all keyboard inputs
- [ ] New Game button is present
- [ ] Pause functionality (if applicable)
- [ ] Game over overlay implemented
- [ ] Mobile controls added and hidden on desktop
- [ ] Responsive layout tested (desktop + mobile)
- [ ] Color palette matches standards
- [ ] Animations are smooth (0.3s transitions)
- [ ] Backdrop blur effects applied
- [ ] Border glows use cyan accent color

---

## Examples

### Reference Games:
1. **Tetris** (`/tetris`) - Perfect implementation
2. **2048** (`/2048`) - Updated to match standards

### Key Differences to Avoid:
❌ **Don't:**
- Put title outside the sidebar
- Make scoreboard dominate the layout
- Stack everything vertically on desktop
- Use inconsistent fonts or colors
- Hide controls in plain text at bottom

✅ **Do:**
- Keep game board as visual focus (left side)
- Integrate all info into cohesive sidebar (right side)
- Use consistent spacing and alignment
- Apply standard color palette
- Make controls visually clear in sidebar

---

## Questions?

For implementation help or clarification:
1. Reference `GameTemplate.tsx` and `GameTemplate.css`
2. Compare with Tetris and 2048 implementations
3. Follow this document's guidelines
4. Test on both desktop and mobile before deploying

---

**Last Updated:** 2024
**Version:** 1.0
**Maintained By:** Parker Adams
