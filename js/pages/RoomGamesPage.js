import { Button } from "../components/Button.js";
import { GameDetailsPage } from "./GameDetailsPage.js";
import { ReplayPage } from "./ReplayPage.js";
import { getGameDetails } from "../services/recordService.js";

export class RoomGamesPage {
    constructor(room, onBack) {
        this.room = room || { roomCode: "", gameIds: [] };
        this.onBack = onBack;

        this.initializeElements();
        this.setAttributes();
        this.appendElements();
        this.addEventListeners();
    }

    initializeElements() {
        this.container = document.createElement("main");
        this.content = document.createElement("div");
        this.title = document.createElement("h1");
        this.roomInfo = document.createElement("section");
        this.avatar = document.createElement("img");
        this.roomCodeLabel = document.createElement("span");
        this.roomCode = document.createElement("strong");
        this.historySection = document.createElement("section");
        this.historyTitle = document.createElement("h2");
        this.results = document.createElement("div");
        this.table = document.createElement("table");
        this.tableCaption = document.createElement("caption");
        this.tableHead = document.createElement("thead");
        this.tableBody = document.createElement("tbody");
        this.emptyState = document.createElement("tr");
        this.emptyStateCell = document.createElement("td");

        this.backButton = new Button(
            "room-games-back",
            "Back",
            "game-button player-history-back-button"
        );
    }

    setAttributes() {
        this.container.id = "playerHistoryPage";
        this.content.className = "player-history-content";
        this.title.className = "player-history-title";
        this.roomInfo.className = "player-info";
        this.avatar.className = "player-avatar";
        this.roomCodeLabel.className = "player-id-label";
        this.historySection.className = "player-game-history";
        this.historyTitle.className = "player-game-history-title";
        this.results.className = "player-history-results";
        this.table.className = "player-history-table";
        this.emptyState.className = "player-history-empty-state";

        this.title.textContent = "ROOM GAMES";
        this.avatar.src = "assets/images/avatar-placeholder.svg";
        this.avatar.alt = "Placeholder player avatar";
        this.roomCodeLabel.textContent = "Room Code: ";
        this.roomCode.textContent = this.room.roomCode || "-";
        this.historyTitle.textContent = "Games Played";
        this.tableCaption.textContent = "Games in the selected room";
        this.emptyStateCell.colSpan = 3;
        this.emptyStateCell.textContent = "";

        const headerRow = document.createElement("tr");
        ["No.", "Game ID", "Actions"].forEach(headerText => {
            const headerCell = document.createElement("th");
            headerCell.scope = "col";
            headerCell.textContent = headerText;
            headerRow.append(headerCell);
        });
        this.tableHead.append(headerRow);
    }

    appendElements() {
        this.roomCodeLabel.append(this.roomCode);
        this.roomInfo.append(this.avatar, this.roomCodeLabel);
        this.emptyState.append(this.emptyStateCell);
        this.tableBody.append(this.emptyState);
        this.table.append(this.tableCaption, this.tableHead, this.tableBody);
        this.results.append(this.table);
        this.historySection.append(this.historyTitle, this.results);
        this.content.append(this.title, this.roomInfo, this.historySection);
        this.container.append(this.content, this.backButton.getElement());
    }

    addEventListeners() {
        this.backButton.onClick(() => {
            if (this.onBack) {
                this.onBack();
            }
        });
    }

    showTableMessage(message) {
        this.tableBody.replaceChildren();
        this.emptyStateCell.textContent = message;
        this.emptyState.replaceChildren(this.emptyStateCell);
        this.tableBody.append(this.emptyState);
    }

    createGameRow(gameId, index) {
        const row = document.createElement("tr");

        const noCell = document.createElement("td");
        noCell.textContent = index + 1;
        row.append(noCell);

        const gameIdCell = document.createElement("td");
        gameIdCell.textContent = gameId;
        row.append(gameIdCell);

        const actionsCell = document.createElement("td");
        actionsCell.className = "player-history-actions-cell";
        actionsCell.style.display = "flex";
        actionsCell.style.gap = "8px";
        actionsCell.style.alignItems = "center";

        const viewDetailsButton = new Button(
            `room-game-view-details-${gameId}`,
            "View Details",
            "game-button replay-button"
        );
        viewDetailsButton.getElement().setAttribute(
            "aria-label",
            `View details for game ${gameId}`
        );
        viewDetailsButton.onClick(async () => {
            try {
                const data = await getGameDetails(gameId);

                const gameDetailsPage = new GameDetailsPage(
                    gameId,
                    data.list,
                    () => {
                        const roomGamesPage = new RoomGamesPage(this.room, this.onBack);
                        roomGamesPage.render("app");
                    }
                );

                gameDetailsPage.render("app");
            } catch (error) {
                console.error("Failed to retrieve game details:", error);
            }
        });

        const replayButton = new Button(
            `room-game-replay-${gameId}`,
            "Replay",
            "game-button replay-button"
        );
        replayButton.getElement().setAttribute(
            "aria-label",
            `Replay game ${gameId}`
        );
        replayButton.onClick(async () => {
            try {
                const data = await getGameDetails(gameId);

                const replayPage = new ReplayPage(
                    gameId,
                    data.list,
                    this.room.playerId || "",
                    () => {
                        const roomGamesPage = new RoomGamesPage(this.room, this.onBack);
                        roomGamesPage.render("app");
                    }
                );

                replayPage.render("app");
            } catch (error) {
                console.error("Failed to retrieve game replay:", error);
            }
        });

        actionsCell.append(
            viewDetailsButton.getElement(),
            replayButton.getElement()
        );
        row.append(actionsCell);

        return row;
    }

    render(target) {
        const parent = document.getElementById(target);

        if (parent) {
            parent.replaceChildren(this.container);

            const gameIds = Array.isArray(this.room.gameIds) ? this.room.gameIds : [];
            this.tableBody.replaceChildren();

            if (gameIds.length === 0) {
                this.showTableMessage("No games played in this room yet.");
                return;
            }

            gameIds.forEach((gameId, index) => {
                this.tableBody.append(this.createGameRow(gameId, index));
            });
        }
    }
}
