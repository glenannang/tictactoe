# Proposed React Project Structure for Tic-Tac-Toe

## Overview

This repository contains the existing vanilla JavaScript Tic-Tac-Toe frontend. This document proposes how the same application responsibilities could be organized in a future React project. It is an architecture and project-tree proposal only: the existing application has **not** been converted to React, and the proposed files and folders have not been created here.

## Current Project Structure

The relevant structure of the existing application is:

```text
tictactoe/
├── index.html
├── playerId.test.mjs
├── assets/
│   ├── images/
│   │   ├── avatar-placeholder.svg
│   │   ├── bigscroll.png
│   │   ├── board.png
│   │   ├── howtoplaybackground.png
│   │   ├── lobby.png
│   │   ├── smallscroll.png
│   │   └── Title.png
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

Generated files, operating-system metadata, and Git internals are excluded because they do not affect the architecture.

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

The application already separates pure game rules and HTTP calls from some UI code. The main opportunity is to give the larger workflows clearer responsibility boundaries.

## Architectural Issues Identified

These issues concern responsibility separation, not whether the current application works.

### `gameController.js`

`gameController.js` is the clearest god-file candidate. It currently coordinates waiting-room polling, game-record creation, board synchronization, opponent detection, move validation, move submission, move recording, result detection, rematches, timers, shared state, modal selection, and `GamePage` rendering. These responsibilities change for different reasons: an endpoint change should not require changing UI orchestration, and a dialog change should not require changing the rematch protocol.

### `ReplayPage.js`

`ReplayPage.js` constructs the complete replay interface while also running the playback timer, rebuilding the board, calculating results, fetching later games, and sequencing every game in a room. Its single-game playback behavior and room-wide match-history orchestration are related, but distinct.

### `gameModals.js`

The modal module presents dialogs, but several dialog functions also reset server state, cancel timers, mutate global game state, and navigate away. A React modal should present the current situation and invoke supplied actions; the game-session logic should decide what those actions do.

### `CreateLobbyPage.js`

The create-lobby page builds its UI, generates room codes, copies codes, prevents duplicate requests, calls two services, starts waiting-room polling, cancels the room, clears timers, mutates shared state, and navigates. Form presentation and lobby-session behavior can be separated without splitting every event into its own file.

### History pages

`PlayerHistoryPage.js`, `RoomMatchHistoryPage.js`, and `RoomGamesPage.js` repeatedly construct similar tables, loading and empty states, action cells, and nested navigation. Their data sources and row actions differ, but a shared table component can remove the repeated presentation responsibility while each page retains its specific data-loading decisions.

## Chosen Architecture: Hybrid Structure

The proposed React project uses a **hybrid structure**. Code that belongs to a specific domain is grouped under `features/`:

- `lobby/` for creating, joining, and waiting in rooms
- `game/` for live play and its lifecycle
- `history/` for recorded games, details, and replay

Concerns genuinely used across features remain in shared folders:

- `components/` for generic UI elements
- `services/` for backend API boundaries
- `utils/` for framework-independent shared helpers
- `styles/` for global and shared styles
- `assets/` for images and video

A purely type-based structure would place all pages and hooks together, hiding the relationship between a feature's UI and behavior. That resembles the current organization and would make the game decomposition less visible. A completely feature-based structure would force shared buttons, modals, identity logic, and APIs into one feature or duplicate them.

React does not require a particular folder tree. This hybrid organization is an architectural choice based on the responsibilities that already exist in this application.

## Proposed React Project Structure

The following is the final approved, hypothetical tree. It is intended for a future, separate React project. These folders and files are not present in this repository.

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

The proposed structure distributes `gameController.js` by responsibility rather than moving all of it into one large hook.

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
- Exit, unmount, and active-game timer cleanup

`gameSessionService.js` owns multi-request domain workflows:

- X creating a game record while O waits for that record to appear
- The rematch protocol, including reset, rejoin, and opponent-status cases
- Returning meaningful results such as `rematch-ready`, `waiting-for-opponent`, or `game-already-started`

`gameApi.js` contains individual live-game HTTP operations such as create/join, status check, board retrieval, move, and reset. `recordApi.js` contains individual room, game, move-record, and history requests. Neither API module owns React state or UI behavior.

`gameRules.js` remains a pure domain module for determining the current turn, winner, and draw. It can be used by both live play and recorded-game features without depending on React.

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

Contains the existing images and menu video. The proposal uses consistent lowercase filenames to avoid case-sensitive path mismatches in the future project.

## Hooks and Lifecycle Responsibilities

The four proposed hooks exist because each owns stateful behavior tied to a clear React lifecycle.

### `useLobbySession`

Manages the period from requesting room entry until the game is ready or the user cancels. Its waiting timer must start and stop with that lobby session, making a hook an appropriate owner.

### `useGameSession`

Manages one active game from initialization through a result, rematch, exit, or opponent departure. It keeps the board and session state synchronized with the server and cleans up active polling when the screen is left.

### `useReplay`

Manages timed playback for one recorded game. Its move index, board state, timer, restart behavior, and cleanup belong together.

### `useMatchReplay`

Manages the higher-level sequence of games in a room. It loads each game and delegates the move-by-move work to `useReplay`.

The hooks are colocated with their features because they are not generic React utilities: `useGameSession` only makes sense for this game's live-play protocol, and `useMatchReplay` only makes sense for this history feature.

Smaller hooks such as `useMove`, `useTimer`, `useRematch`, and `useBoardPolling` are intentionally not proposed. Those behaviors are not independently reused in the current application. Extracting them would spread one cohesive lifecycle across callback-heavy hooks and make the design harder to follow. They can be reconsidered if their complexity or reuse grows in the future.

## Services and API Boundaries

The service boundaries have three levels:

1. `gameApi.js` represents individual HTTP operations against the live-game backend: create or join, check status, retrieve a board, submit a move, and reset.
2. `recordApi.js` represents individual HTTP operations against the persistence backend: create room/game records, save moves, and retrieve rooms, games, or details.
3. `gameSessionService.js` combines several API operations into domain workflows, specifically game-record coordination and rematch negotiation.

React hooks manage React state, effects, timer cleanup, and screen-facing actions. They call the service modules rather than embedding endpoint details. The API modules do not render UI, and `gameSessionService` does not import React or manipulate the DOM.

## Current-to-Proposed Mapping

| Current responsibility/file | Proposed React location | Reason |
|---|---|---|
| `app.js` startup | `main.jsx` | Keeps application mounting minimal. |
| Page construction and callback navigation | `App.jsx` and `app/navigation.js` | Gives screen selection one clear owner without requiring a router. |
| `Button.js`, `Modal.js`, `PlayerIdDisplay.js` | `components/` | These are reusable across several features. |
| `playerState.js` and `playerUtils.js` | `utils/playerId.js`, initialized by `App.jsx` | Player identity is session-level and framework-independent. |
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

The proposal uses these consistent conventions:

- React components and pages use `PascalCase.jsx`, such as `GameBoard.jsx`.
- Screen-level components use the `Page` suffix, such as `GamePage.jsx`.
- Custom hooks begin with `use`, such as `useGameSession.js`.
- API boundary modules use the `Api` suffix, such as `recordApi.js`.
- Utility and domain modules use descriptive camelCase names, such as `gameRules.js` and `roomCode.js`.
- Feature folder names are lowercase: `lobby/`, `game/`, and `history/`.
- Asset names use consistent lowercase kebab-case where multiple words are needed.

These are project conventions, not requirements imposed by React. Their purpose is to make the role of a file recognizable from its name.

## Design Decisions and Reasoning

### Hybrid organization

Lobby, game, and history each have enough related UI and behavior to justify feature folders. Buttons, modals, APIs, player identity, global styles, and assets cross feature boundaries, so they remain shared. This gives each responsibility a natural home without duplicating shared code.

### Page versus component

A page represents a complete application destination and coordinates its feature behavior. A component represents a focused, reusable, or independently understandable part of that page. For example, `GamePage` is a destination, while `GameBoard` displays cells and `GameStatus` displays metadata. Individual labels and table cells do not need separate components.

### Feature-specific versus shared components

`Button`, `Modal`, and `PlayerIdDisplay` appear across unrelated screens and belong in `components/`. `GameBoard`, `LobbyWaitingPanel`, and `HistoryTable` express feature-specific concepts and stay with their features. This prevents the shared component folder from becoming a collection of unrelated application pieces.

### Feature-colocated hooks

The proposed hooks describe application-specific lobby, game, and replay behavior. Keeping each beside the pages and components that use it makes ownership visible. A global `hooks/` folder would group files by implementation technique instead of application responsibility.

### No Redux or other global store

The current application has one active screen and one active game session. `App` can own navigation and selected identifiers, while feature hooks own their lifecycle state. A state-management library would add concepts without addressing a demonstrated need.

### No Context/provider architecture

The current data flow can be handled with `App`, feature hooks, and props. Context may become reasonable if the future implementation develops deeply nested shared state, but that problem does not exist in the current codebase.

### No WebSocket folder

The current application synchronizes using HTTP polling. A WebSocket layer would describe functionality that does not currently exist. The proposed structure preserves polling while placing its timer lifecycle in the relevant hooks.

### No generic hooks folder

All proposed hooks are feature-specific, and no genuinely reusable cross-feature hook was found. Colocation is clearer than a global folder containing unrelated lifecycle code.

### No required React Router

The existing application replaces `#app` and uses callbacks rather than URLs, deep links, or browser history. Simple screen state in `App` represents that behavior clearly. React Router would become justified if the future project requires shareable URLs or browser back/forward navigation.

### Plain CSS retained

The existing application already has page-scoped plain CSS and responsive rules. Keeping plain CSS avoids adding an unrelated styling system. Styles are reorganized only enough to distinguish global, shared, page-specific, and feature-specific ownership.

### Balanced decomposition

The design separates code when responsibilities already differ in the existing implementation: lobby versus active game, HTTP requests versus multi-request protocols, single-game replay versus room replay, and UI versus lifecycle behavior. It intentionally avoids one hook per operation or one component per DOM element. This prevents the god-file problem without replacing it with dozens of tiny files and complicated coordination.

## Alternatives Considered

- **React Router versus App-level navigation:** A router would be reasonable for URL-based navigation, but simple `App` state better matches the current behavior.
- **API module location:** APIs could be placed inside features, but shared `services/` is clearer because multiple features use each backend.
- **`RoomHistoryPage` naming:** Keeping `RoomMatchHistoryPage` would also be valid. The shorter name reflects that the screen first lists rooms.
- **One history table versus separate tables:** Separate player, room, and room-games tables could be used if their layouts diverge. The current repeated structure supports one configurable `HistoryTable`.
- **CSS organization:** Each component could have its own stylesheet or CSS module. Feature-level plain CSS is simpler and remains close to the current styling approach.

These are architectural conventions and tradeoffs, not correctness rules imposed by React.

## Conclusion

The proposed hybrid structure makes the application's existing lobby, live-game, history, and replay responsibilities easier to identify. It decomposes the current controller and replay god-file responsibilities across UI, lifecycle hooks, domain workflows, API boundaries, and pure rules without introducing a global store, router, WebSocket layer, or unnecessary small abstractions. It remains a proposal for a separate React project; the working vanilla JavaScript application in this repository has not been migrated.
