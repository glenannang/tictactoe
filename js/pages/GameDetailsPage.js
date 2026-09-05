import { Button } from "../components/Button.js";

export class GameDetailsPage {
    constructor(gameId, moves, onBack) {
        this.gameId = gameId;
        this.moves = Array.isArray(moves) ? moves : [];
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
        this.gameInfo = document.createElement("div");
        this.gameIdLabel = document.createElement("p");
        this.gameDateLabel = document.createElement("p");
        this.tableWrap = document.createElement("div");
        this.table = document.createElement("table");
        this.tableHead = document.createElement("thead");
        this.tableBody = document.createElement("tbody");

        this.backButton = new Button(
            "game-details-back",
            "Back to Player History",
            "game-details-back-button"
        );
    }

    setAttributes() {
        this.container.id = "gameDetailsPage";
        this.content.className = "game-details-content";
        this.title.className = "game-details-title";
        this.title.textContent = "GAME DETAILS";

        this.gameInfo.className = "game-details-info";

        const firstMove = this.moves[0] || {};
        const firstMoveDate = firstMove.date || firstMove.timestamp || firstMove.createdAt || firstMove.datesave || null;
        const gameDate = this.formatDate(firstMoveDate);

        this.gameIdLabel.className = "game-details-game-id";
        this.gameIdLabel.textContent = `Game: ${this.gameId || "-"}`;

        this.gameDateLabel.className = "game-details-date";
        this.gameDateLabel.textContent = `Date: ${gameDate}`;

        this.tableWrap.className = "game-details-table-wrap";
        this.table.className = "game-details-table";

        const headerRow = document.createElement("tr");
        ["Move", "Player ID", "Tile", "Grid Location", "Time"].forEach(headerText => {
            const headerCell = document.createElement("th");
            headerCell.scope = "col";
            headerCell.textContent = headerText;
            headerRow.append(headerCell);
        });
        this.tableHead.append(headerRow);

        this.moves.forEach((move, index) => {
            const row = document.createElement("tr");
            const moveDate = move.date || move.timestamp || move.createdAt || move.datesave || null;

            [
                String(index + 1),
                move.playerid || "-",
                move.symbol || "-",
                move.location ?? "-",
                this.formatTime(move.time || moveDate)
            ].forEach(value => {
                const cell = document.createElement("td");
                cell.textContent = value;
                row.append(cell);
            });

            this.tableBody.append(row);
        });
    }

    appendElements() {
        this.gameInfo.append(this.gameIdLabel, this.gameDateLabel);
        this.table.append(this.tableHead, this.tableBody);
        this.tableWrap.append(this.table);
        this.content.append(this.title, this.gameInfo, this.tableWrap);
        this.container.append(this.content, this.backButton.getElement());
    }

    addEventListeners() {
        this.backButton.onClick(() => {
            if (this.onBack) {
                this.onBack();
            }
        });
    }

    formatDate(value) {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        }).format(date);
    }

    formatTime(value) {
        if (!value) {
            return "-";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "-";
        }

        return new Intl.DateTimeFormat("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: true
        }).format(date);
    }

    render(target) {
        const parent = document.getElementById(target);

        if (parent) {
            parent.replaceChildren(this.container);
        }
    }
}
