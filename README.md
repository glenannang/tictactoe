# Proposed React Project Structure for Tic-Tac-Toe

## Overview

This repository contains the existing vanilla JavaScript Tic-Tac-Toe frontend. This document presents a proposed React project structure based on the application's existing features and responsibilities, with a focus on logical decomposition, clear responsibility boundaries, and consistent naming conventions.

## Current Project Structure

The relevant structure of the existing application is:

```text
tictactoe/
├── index.html
├── assets/
│   ├── images/
│   │   ├── avatar-placeholder.svg
│   │   ├── bigscroll.png
│   │   ├── board.png
│   │   ├── howtoplaybackground.png
│   │   ├── lobby.png
│   │   ├── smallscroll.png
│   │   └── title.png
│   └── videos/
│       └── main-menu-background.mp4
├── css/
│   ├── createLobby.css
│   ├── gameDetails.css
│   ├── gamePage.css
│   ├── history.css
│   ├── howToPlay.css
│   ├── joinLobby.css
│   ├── mainMenu.css
│   ├── modal.css
│   ├── playerHistory.css
│   └── replay.css
└── js/
    ├── app.js
    ├── components/
    │   ├── Button.js
    │   ├── Modal.js
    │   └── PlayerIdDisplay.js
    ├── game/
    │   ├── gameController.js
    │   └── gameRules.js
    ├── pages/
    │   ├── CreateLobbyPage.js
    │   ├── GameDetailsPage.js
    │   ├── GamePage.js
    │   ├── HistoryPage.js
    │   ├── HowToPlayPage.js
    │   ├── JoinLobbyPage.js
    │   ├── MainPage.js
    │   ├── PlayerHistoryPage.js
    │   ├── ReplayPage.js
    │   ├── RoomGamesPage.js
    │   └── RoomMatchHistoryPage.js
    ├── services/
    │   ├── gameService.js
    │   └── recordService.js
    ├── state/
    │   ├── gameState.js
    │   └── playerState.js
    ├── ui/
    │   └── gameModals.js
    └── utils/
        ├── gameUtils.js
        └── playerUtils.js
```

## Current Architecture

The current frontend is a single-page vanilla JavaScript application. `index.html` provides an `#app` element, and each page class constructs its screen with DOM APIs such as `document.createElement()`. Navigation happens by replacing the contents of `#app`; pages create other page classes and pass callbacks to return to earlier screens.

The current code is organized mainly by technical type:

- `pages/` contains the main menu, lobby, live game, instructions, history, game-details, and replay screens.
- `components/` contains reusable DOM-based buttons, modals, and the player-ID display.
- `game/` contains Tic-Tac-Toe rules and the multiplayer game controller.
- `services/` contains calls to the live-game server and the separate records API.
- `state/` contains shared mutable game state and the session-scoped player ID.
- `ui/` contains game-specific modal construction and behavior.
- `utils/` contains player-ID and room-code generation as well as direct game-display updates.
- `css/` and `assets/` contain the visual styling and media used by the screens.

The application already separates game rules, API calls, and some UI responsibilities. However, several larger files still handle multiple responsibilities, which makes the current structure harder to maintain.

## Architectural Issues Identified

### `gameController.js`

`gameController.js` currently handles several responsibilities, including waiting-room polling, game-record creation, board synchronization, opponent detection, move handling, result detection, rematches, timers, shared state, modals, and `GamePage` rendering. Separating these responsibilities makes the game flow easier to organize and prevents unrelated logic, such as UI handling and server communication, from being managed in one file.

### `ReplayPage.js`

`ReplayPage.js` handles both the replay interface and replay logic, including the playback timer, board reconstruction, result calculation, game fetching, and sequencing multiple games in a room. These responsibilities can be separated into the replay UI, single-game playback, and room replay handling.

### `gameModals.js`

`gameModals.js` handles the display of game dialogs, but some dialog functions also reset the game, clear timers, update game state, and handle navigation. These responsibilities can be separated so that the modal handles the UI while the game-session logic handles actions such as reset, rematch, and exit.

### `CreateLobbyPage.js`

`CreateLobbyPage.js` currently handles both the lobby UI and room-related logic, including room-code generation, waiting-room polling, cancellation, timer cleanup, shared state updates, and navigation. Separating the UI from the lobby-session logic gives these responsibilities clearer boundaries.

### History pages

`PlayerHistoryPage.js`, `RoomMatchHistoryPage.js`, and `RoomGamesPage.js` contain similar table structures, loading and empty states, and action elements. A shared table component can handle these repeated UI elements, while each page remains responsible for loading and displaying its own data.

## Project Organization Approach

The structure combines feature-based and shared/type-based organization. Code that belongs to a specific domain is grouped under `features/`:

- `lobby/` for creating, joining, and waiting in rooms
- `game/` for live play and its lifecycle
- `history/` for recorded games, details, and replay

Concerns genuinely used across features remain in shared folders:

- `components/` for generic UI elements
- `services/` for backend API boundaries
- `utils/` for framework-independent shared helpers
- `styles/` for global and shared styles
- `assets/` for images and video

The structure keeps feature-specific UI and logic together while giving code used across multiple features a clear shared location.

## Proposed React Project Structure

The following project tree shows the proposed React structure for the Tic-Tac-Toe application.

```text
src/
├── main.jsx
├── App.jsx
├── app/
│   └── navigation.js
├── components/
│   ├── Button.jsx
│   ├── Modal.jsx
│   └── PlayerIdDisplay.jsx
├── pages/
│   ├── MainMenuPage.jsx
│   ├── MainMenuPage.css
│   ├── HowToPlayPage.jsx
│   └── HowToPlayPage.css
├── features/
│   ├── lobby/
│   │   ├── CreateLobbyPage.jsx
│   │   ├── JoinLobbyPage.jsx
│   │   ├── LobbyWaitingPanel.jsx
│   │   ├── useLobbySession.js
│   │   ├── roomCode.js
│   │   └── lobby.css
│   ├── game/
│   │   ├── GamePage.jsx
│   │   ├── GameBoard.jsx
│   │   ├── GameStatus.jsx
│   │   ├── GameDialog.jsx
│   │   ├── useGameSession.js
│   │   ├── gameSessionService.js
│   │   ├── gameRules.js
│   │   └── game.css
│   └── history/
│       ├── HistoryPage.jsx
│       ├── PlayerHistoryPage.jsx
│       ├── RoomHistoryPage.jsx
│       ├── RoomGamesPage.jsx
│       ├── GameDetailsPage.jsx
│       ├── ReplayPage.jsx
│       ├── HistoryTable.jsx
│       ├── ReplayBoard.jsx
│       ├── useReplay.js
│       ├── useMatchReplay.js
│       ├── historyUtils.js
│       ├── history.css
│       └── replay.css
├── services/
│   ├── gameApi.js
│   └── recordApi.js
├── utils/
│   └── playerId.js
├── styles/
│   ├── global.css
│   └── modal.css
└── assets/
    ├── images/
    │   ├── avatar-placeholder.svg
    │   ├── bigscroll.png
    │   ├── board.png
    │   ├── how-to-play-background.png
    │   ├── lobby.png
    │   ├── smallscroll.png
    │   └── title.png
    └── videos/
        └── main-menu-background.mp4
```

## Logical Decomposition

### Decomposing `gameController.js`

The structure distributes `gameController.js` by responsibility rather than moving all of it into one large hook.

`useLobbySession.js` owns the pre-game lifecycle:

- Creating or joining a room
- Interpreting live-game server responses
- Creating the room record
- Waiting for a second player
- Reporting loading, waiting, and error states
- Cancelling waiting and cleaning up its timer
- Returning the established room information to the application

`useGameSession.js` owns React state and lifecycle for an active game:

- Current room code, game ID, symbol, and board
- Board synchronization polling
- Turn, result, and opponent-departure state
- Move-in-progress and rematch-in-progress guards
- Move validation, submission, and successful move persistence
- Starting a rematch and applying its semantic result
- Handling game exit and cleaning up active-game timers

`gameSessionService.js` owns multi-request domain workflows:

- X creating a game record while O waits for that record to appear
- The rematch protocol, including reset, rejoin, and opponent-status cases
- Returning meaningful results such as `rematch-ready`, `waiting-for-opponent`, or `game-already-started`

`gameApi.js` contains individual live-game HTTP operations such as create/join, status check, board retrieval, move, and reset. `recordApi.js` contains individual room, game, move-record, and history requests. Neither API module owns React state or UI behavior.

`gameRules.js` contains the game rules for determining the current turn, winner, and draw. Since this logic does not depend on React, it can be reused for both live games and recorded games.

The visual responsibilities are also separated:

- `GamePage.jsx` composes the complete live-game screen and connects it to session state.
- `GameBoard.jsx` displays nine cells and reports a selected cell without making requests.
- `GameStatus.jsx` displays the player symbol, player ID, game ID, room code, and turn message.
- `GameDialog.jsx` selects the appropriate game dialog and invokes callbacks for rematch or exit. It does not reset the server itself.

This avoids a new god hook because lobby entry, active-game lifecycle, multi-request server workflows, individual HTTP operations, pure rules, and presentation have separate owners. `useGameSession` remains substantial, but all of its responsibilities concern one active game lifecycle.

### Decomposing `ReplayPage.js`

The current replay page is separated as follows:

- `ReplayPage.jsx` composes replay metadata, controls, board, progress, and result presentation.
- `ReplayBoard.jsx` renders a read-only nine-cell board from supplied board state.
- `useReplay.js` runs the timed moves for one game, including start, restart, stop, completion, and timer cleanup.
- `useMatchReplay.js` loads and sequences the games in one room, tracks “Game N of M,” and uses `useReplay` for each individual game.
- `historyUtils.js` reconstructs boards, finds the player's symbol, determines player-relative results, and formats recorded dates and times.
- `recordApi.js` retrieves recorded game details without owning playback state.

The split follows two modes that already exist in the current code: replaying one supplied game and fetching/sequencing an entire room history. It does not invent unrelated functionality.

## Folder and File Responsibilities

### `app/`

Contains small application-level configuration. `navigation.js` defines the available screen identifiers so navigation values are not scattered as string literals.

At the root of `src/`, `main.jsx` mounts React. `App.jsx` owns the current screen, stable application-level information such as the player ID, and the selected room or game needed when moving between screens.

### `components/`

Contains reusable UI that crosses feature boundaries:

- `Button.jsx` is the common button primitive.
- `Modal.jsx` is a generic dialog shell that receives its content and actions through props.
- `PlayerIdDisplay.jsx` consistently displays a player ID supplied through props.

These components do not know about game APIs or navigation rules.

### `pages/`

Contains standalone screens that do not need full feature modules:

- `MainMenuPage.jsx` presents the video, title, player ID, and menu choices.
- `HowToPlayPage.jsx` presents the existing instructions and back action.

Their CSS remains beside them because it applies specifically to those screens.

### `features/lobby/`

Contains the pre-game room workflow:

- `CreateLobbyPage.jsx` manages the displayed room code and creation form.
- `JoinLobbyPage.jsx` manages room-code input and page-level validation messages.
- `LobbyWaitingPanel.jsx` displays the room code, copy action, waiting message, and cancel action.
- `useLobbySession.js` manages room entry, waiting, cancellation, and waiting-timer cleanup.
- `roomCode.js` generates the short room code.
- `lobby.css` contains styles shared by the related lobby screens.

### `features/game/`

Contains live play:

- `GamePage.jsx` composes the live-game destination.
- `GameBoard.jsx` renders and reports interaction with the board.
- `GameStatus.jsx` displays current session information.
- `GameDialog.jsx` presents game-over, waiting, opponent-left, and already-started states.
- `useGameSession.js` manages the active game's React state and lifecycle.
- `gameSessionService.js` implements record-coordination and rematch protocols involving several API calls.
- `gameRules.js` contains framework-independent Tic-Tac-Toe rules.
- `game.css` contains live-game styles.

### `features/history/`

Contains recorded-game browsing and replay:

- `HistoryPage.jsx` presents the choice between player and room history.
- `PlayerHistoryPage.jsx` loads the current player's games.
- `RoomHistoryPage.jsx` loads rooms associated with the current player.
- `RoomGamesPage.jsx` displays the games recorded in a selected room.
- `GameDetailsPage.jsx` presents game metadata and its move table.
- `ReplayPage.jsx` composes a replay screen.
- `HistoryTable.jsx` provides the repeated table, caption, and status-message structure used by the history lists.
- `ReplayBoard.jsx` displays a read-only replay board.
- `useReplay.js` controls one game's timed playback.
- `useMatchReplay.js` coordinates playback across all games in a room.
- `historyUtils.js` contains pure recorded-game calculations and formatting.
- `history.css` and `replay.css` style their respective parts of the feature.

### `services/`

Contains shared backend boundaries. `gameApi.js` calls the live-game backend, while `recordApi.js` calls the separate records backend. Keeping them shared reflects that lobby and game both need live-game operations, while game and history both use recorded data.

### `utils/`

Contains the framework-independent `playerId.js`, which generates, stores, and retrieves the session player ID. `App.jsx` can obtain this value once and pass it to pages and components.

### `styles/`

Contains `global.css` for application-wide base styles and `modal.css` for the generic shared modal. Feature-specific styles stay with their features.

### `assets/`

Contains the existing images and menu video. Consistent lowercase filenames avoid case-sensitive path mismatches.

## Current-to-Proposed Mapping

| Current responsibility/file | Proposed React location | Reason |
|---|---|---|
| `app.js` startup | `main.jsx` | Keeps application mounting minimal. |
| Page construction and callback navigation | `App.jsx` and `app/navigation.js` | Gives screen selection one clear owner without requiring a router. |
| `Button.js`, `Modal.js`, `PlayerIdDisplay.js` | `components/` | These are reusable across several features. |
| `playerState.js` and `playerUtils.js` | `utils/playerId.js`, initialized by `App.jsx` | The player ID is shared across different parts of the application and does not depend on React. |
| Initial room creation, join, and waiting logic | `features/lobby/useLobbySession.js` | Separates the pre-game lifecycle from active play. |
| Lobby forms and waiting presentation | Lobby pages and `LobbyWaitingPanel.jsx` | Keeps rendering separate from server synchronization. |
| Active-game state, polling, moves, and cleanup in `gameController.js` | `features/game/useGameSession.js` | These responsibilities belong to one active game lifecycle. |
| Multi-request record and rematch workflows in `gameController.js` | `features/game/gameSessionService.js` | Separates backend protocol coordination from React state. |
| Individual calls in `gameService.js` | `services/gameApi.js` | Provides the live-game HTTP boundary. |
| Individual calls in `recordService.js` | `services/recordApi.js` | Provides the persistence/history HTTP boundary. |
| `gameRules.js` | `features/game/gameRules.js` | Preserves pure, testable domain rules. |
| Direct DOM updates in `gameUtils.js` | React state rendered by `GameBoard.jsx` and `GameStatus.jsx` | React should derive UI from state instead of querying and mutating DOM elements. |
| Live board and metadata in `GamePage.js` | `GamePage.jsx`, `GameBoard.jsx`, and `GameStatus.jsx` | Separates page composition from focused visual responsibilities. |
| Behavior-heavy game dialogs | `GameDialog.jsx` and shared `Modal.jsx` | Dialogs present state while session code owns reset, rematch, and exit actions. |
| Repeated history tables | `features/history/HistoryTable.jsx` | Shares an existing repeated presentation pattern without abstracting every row. |
| Result and date calculations in history pages | `features/history/historyUtils.js` | Keeps pure data transformations out of page rendering. |
| Single-game timing in `ReplayPage.js` | `features/history/useReplay.js` | Gives one-game playback and cleanup a cohesive owner. |
| Room-wide replay sequence in `ReplayPage.js` | `features/history/useMatchReplay.js` | Separates game loading/sequencing from individual move playback. |
| Replay board construction | `features/history/ReplayBoard.jsx` | Makes the read-only board a focused presentational component. |

## Naming Conventions

The structure uses these consistent conventions:

- React components and pages use `PascalCase.jsx`, such as `GameBoard.jsx`.
- Screen-level components use the `Page` suffix, such as `GamePage.jsx`.
- Custom hooks begin with `use`, such as `useGameSession.js`.
- API boundary modules use the `Api` suffix, such as `recordApi.js`.
- Utility and domain modules use descriptive camelCase names, such as `gameRules.js` and `roomCode.js`.
- Feature folder names are lowercase: `lobby/`, `game/`, and `history/`.
- Asset names use consistent lowercase kebab-case where multiple words are needed.

These conventions make each file's role easier to identify.

## Design Decisions and Reasoning

### Pages and components

Pages represent complete screens, while components handle smaller parts of a
screen. For example, `GamePage` represents the live-game screen, while
`GameBoard` displays the board and `GameStatus` displays game information.

### Shared and feature-specific components

`Button`, `Modal`, and `PlayerIdDisplay` are shared because they can be used by
different parts of the application. Components such as `GameBoard`,
`LobbyWaitingPanel`, and `HistoryTable` remain inside their respective features
because they are specific to those features.

### Feature-specific hooks

Hooks such as `useLobbySession`, `useGameSession`, and the replay hooks remain
inside their feature folders because they manage behavior specific to those
features.

### State management

Application-level information such as navigation and selected game or room
identifiers is handled by `App`, while feature-specific state is handled within
the corresponding feature. A separate global state-management library is not
needed for the current application.

### Existing communication and styling

The proposed structure keeps the application's existing HTTP polling approach
and plain CSS. Polling behavior is handled by the feature that uses it, while
global and feature-specific styles are kept separate.

## Conclusion

The proposed structure gives the application's lobby, live-game, history, and
replay responsibilities clear locations. It separates UI, lifecycle behavior,
API communication, game rules, and shared utilities while addressing the larger
responsibilities currently combined in files such as `gameController.js` and
`ReplayPage.js`.
