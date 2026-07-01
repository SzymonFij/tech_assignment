# 🎰 Slot Machine – Tech Assignment

Implementation of a 5x3 slot machine created as a technical assignment using **TypeScript**, **PixiJS**, and **GSAP**.

The project focuses on clean architecture, separation of responsibilities, and maintainable game logic.

---

## Preview

![Gameplay](readme/winning_animation.gif)

---

## Features

- 5x3 slot machine layout
- Animated reel spinning
- Configurable paylines / ways-to-win evaluation
- Win detection and presentation
- Symbol highlighting animations
- State-machine driven game flow
- Separation between game logic and presentation
- Object-oriented architecture

---

## Technologies

- **TypeScript**
- **PixiJS**
- **GSAP**
- **Parcel**

---

## Installation

Clone the repository:

```bash
git clone https://github.com/SzymonFij/tech_assignment.git
cd tech_assignment
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run serve
```

Build production version:

```bash
npm run build
```

---

## Project Structure

```
src/
├── config.ts              # Game configuration
├── types.ts               # Shared type definitions
├── Machine.ts             # Main game controller
├── Reel.ts                # Reel implementation
├── SlotSymbol.ts          # Symbol representation
├── SpinButton.ts          # UI spin button
├── InputController.ts     # Input handling
├── GameStateMachine.ts    # Game flow state machine
├── WinChecker.ts          # Win calculation logic
├── WinPresenter.ts        # Win animations/presentation
├── WinOdometer.ts         # Win counter animation
├── Outcome.ts             # Spin result definitions
└── Paytable.ts            # Paytable mockup configuration
```

---

## Architecture

The codebase is organized into independent components, each responsible for a single aspect of the application's behavior.

### Machine

Acts as the main coordinator of the game. It controls the reels, handles game flow, and communicates with other systems.

### GameStateMachine

Controls the slot lifecycle:

```
Idle
 ↓
Spinning
 ↓
Stopping
 ↓
Win
 ↓
Idle
```

### Reel

Responsible only for reel animation and symbol management.

### WinChecker

Contains all game logic related to preparing winning combinations.

### WinPresenter

Handles the visual presentation of wins independently from the game logic.

### InputController

Processes player interactions and forwards them to the game controller.

---

## Assumptions

- Winning combinations are evaluated from left to right.
- Symbols must appear consecutively to create a valid combination.
- Multiple winning combinations can occur during a single spin.
- Reel animations are independent of win evaluation.

---