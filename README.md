# Interactive Wall Calendar

A polished frontend-only React calendar inspired by a physical wall calendar design. The app focuses on interactive date-range planning, integrated notes, and responsive UI behavior.



## Challenge Goals Covered

- Wall calendar aesthetic with a hero image and structured month grid
- Day range selector with clear states for start, end, and in-between days
- Integrated notes system with client-side persistence
- Responsive layout for desktop and mobile usage
- No backend used, all persistence handled on the client via localStorage

## Implemented Features

### Core Features

- Month navigation with previous and next controls
- Date range selection workflow:
  - First click sets start date
  - Second click sets end date
  - Clicking again starts a new range
- Visual range states:
  - Start date highlight
  - End date highlight
  - Between-days highlight
- Notes tabs:
  - Month memo
  - Day memo
  - Range memo
- Clear range action
- Mobile-friendly responsive layout

### Extra Features

- Quick range actions: Today, This Week, Next 7 Days
- Physical page-flip month transition animation
- Plan Snapshot generator with one-click copy to clipboard
- Ruled-paper memo styling for notebook-like writing experience

## Tech Stack

- React 19
- Vite 8
- Tailwind CSS 4
- LocalStorage for persistence

## Local Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd calender
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run development server

```bash
npm run dev
```

### 4. Production build

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

## Node Version Note

Vite in this project expects Node 20.19+ or 22.12+.
If you are using Node 22.5.1, the app may still build with warnings. For best compatibility, use Node 22.12+.

## Project Structure

```text
src/
	App.jsx
	index.css
	main.jsx
	components/
		Calender.jsx
		Notes.jsx
		
	assets/
```

## Data Persistence

All notes are saved in browser localStorage under scoped keys:

- wall-calendar:month:<yyyy-mm>
- wall-calendar:day:<yyyy-mm-dd>
- wall-calendar:range:<start>\_\_<end>

## UX and Component Notes

- App.jsx holds shared state for current month and selected range
- Calender.jsx handles month rendering and interactions
- Notes.jsx handles memo tabs and persistence
- One-way data flow is used throughout the app via props and callbacks

## Future Improvements

- Keyboard navigation for calendar cells
- Holiday/event management panel
- Export plan snapshot to downloadable text or image
- Accessibility upgrades for ARIA and focus navigation

## Author

GOPAL CHAMY M
