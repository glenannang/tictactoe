import { Button } from "../components/Button.js";
import { playerId } from "../state/playerState.js";
import { getPlayerRooms } from "../services/recordService.js";
import { RoomGamesPage } from "./RoomGamesPage.js";
import { ReplayPage } from "./ReplayPage.js";

export class RoomMatchHistoryPage {
    constructor(onBack) {
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
        this.playerInfo = document.createElement("section");
        this.avatar = document.createElement("img");
        this.playerIdLabel = document.createElement("span");
        this.playerId = document.createElement("strong");
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
            "room-match-history-back",
            "Back",
            "game-button player-history-back-button"
        );
    }

    setAttributes() {
        this.container.id = "playerHistoryPage";
        this.content.className = "player-history-content";
        this.title.className = "player-history-title";
        this.playerInfo.className = "player-info";
        this.avatar.className = "player-avatar";
        this.playerIdLabel.className = "player-id-label";
        this.historySection.className = "player-game-history";
        this.historyTitle.className = "player-game-history-title";
        this.results.className = "player-history-results";
        this.table.className = "player-history-table";
        this.emptyState.className = "player-history-empty-state";

        this.title.textContent = "ROOM MATCH HISTORY";
        this.avatar.src = "assets/images/avatar-placeholder.svg";
        this.avatar.alt = "Placeholder player avatar";
        this.playerIdLabel.textContent = "Your Player ID: ";
        this.playerId.textContent = playerId;
        this.historyTitle.textContent = "Rooms Joined";
        this.tableCaption.textContent = "Recorded rooms for the current player";
        this.emptyStateCell.colSpan = 4;
        this.emptyStateCell.textContent = "";

        const headerRow = document.createElement("tr");
        ["No.", "Room Code", "Games", "Actions"].forEach(headerText => {
            const headerCell = document.createElement("th");
            headerCell.scope = "col";
            headerCell.textContent = headerText;
            headerRow.append(headerCell);
        });
        this.tableHead.append(headerRow);
    }

    appendElements() {
        this.playerIdLabel.append(this.playerId);
        this.playerInfo.append(this.avatar, this.playerIdLabel);
        this.emptyState.append(this.emptyStateCell);
        this.tableBody.append(this.emptyState);
        this.table.append(this.tableCaption, this.tableHead, this.tableBody);
        this.results.append(this.table);
        this.historySection.append(this.historyTitle, this.results);
        this.content.append(this.title, this.playerInfo, this.historySection);
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

    createRoomRow(room, index) {
        const row = document.createElement("tr");
        const values = [index + 1, room.roomCode, (room.gameIds || []).length];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.append(cell);
        });

        const actionsCell = document.createElement("td");
        actionsCell.className = "player-history-actions-cell";
        actionsCell.style.display = "flex";
        actionsCell.style.gap = "8px";
        actionsCell.style.alignItems = "center";

        const viewGamesButton = new Button(
            `view-games-${room.roomCode}`,
            "View Games",
            "game-button replay-button"
        );
        viewGamesButton.getElement().setAttribute(
            "aria-label",
            `View games for room ${room.roomCode}`
        );
        viewGamesButton.onClick(() => {
            const roomGamesPage = new RoomGamesPage(room, () => {
                const roomMatchHistoryPage = new RoomMatchHistoryPage(this.onBack);
                roomMatchHistoryPage.render("app");
            });

            roomGamesPage.render("app");
        });

        const replayHistoryButton = new Button(
            `replay-room-history-${room.roomCode}`,
            "Replay Match History",
            "game-button replay-button"
        );
        replayHistoryButton.getElement().setAttribute(
            "aria-label",
            `Replay match history for room ${room.roomCode}`
        );
        replayHistoryButton.onClick(() => {
            const replayPage = new ReplayPage(
                room.gameIds && room.gameIds[0],
                [],
                playerId,
                () => {
                    const roomGamesPage = new RoomGamesPage(room, this.onBack);
                    roomGamesPage.render("app");
                },
                {
                    mode: "match-history",
                    roomCode: room.roomCode,
                    roomGameIds: room.gameIds || [],
                    currentRoomGameIndex: 0
                }
            );

            replayPage.render("app");
        });

        actionsCell.append(
            viewGamesButton.getElement(),
            replayHistoryButton.getElement()
        );
        row.append(actionsCell);

        return row;
    }

    async loadRooms() {
        this.showTableMessage("Loading rooms...");

        try {
            const data = await getPlayerRooms(playerId);

            this.tableBody.replaceChildren();

            if (!data.list || data.list.length === 0) {
                this.showTableMessage("No rooms joined yet.");
                return;
            }

            data.list.forEach((room, index) => {
                this.tableBody.append(this.createRoomRow(room, index));
            });

        } catch (error) {
            console.error("Failed to load player rooms:", error);
            this.showTableMessage("Failed to load rooms.");
        }
    }

    render(target) {
        const parent = document.getElementById(target);

        if (parent) {
            parent.replaceChildren(this.container);
            this.loadRooms();
        }
    }
}
