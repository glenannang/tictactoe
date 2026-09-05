import { Button } from "../components/Button.js";
import { GameDetailsPage } from "./GameDetailsPage.js";
import { ReplayPage } from "./ReplayPage.js";
import { playerId } from "../state/playerState.js";
import { getPlayerGames,getGameDetails } from "../services/recordService.js";


export class PlayerHistoryPage {

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
        this.description = document.createElement("p");
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
            "player-history-back",
            "Back to Menu",
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
        this.description.className = "player-history-description";
        this.historySection.className = "player-game-history";
        this.historyTitle.className = "player-game-history-title";
        this.results.className = "player-history-results";
        this.table.className = "player-history-table";
        this.emptyState.className = "player-history-empty-state";

        this.title.textContent = "PLAYER HISTORY";
        this.avatar.src = "assets/images/avatar-placeholder.svg";
        this.avatar.alt = "Placeholder player avatar";
        this.playerIdLabel.textContent = "Player ID: ";
        this.playerId.textContent = playerId;
        this.description.textContent = "Review the recorded games associated with this player.";
        this.historyTitle.textContent = "Games Played";
        this.tableCaption.textContent = "Recorded games for the current player";
        this.emptyStateCell.colSpan = 3;
        this.emptyStateCell.textContent =
            "Your recorded games will appear here.";

        const headerRow = document.createElement("tr");
        ["Game ID", "Tile", "Actions"].forEach(headerText => {
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
        this.content.append(
            this.title,
            this.playerInfo,
            this.description,
            this.historySection
        );
        this.container.append(this.content, this.backButton.getElement());
    }

    addEventListeners() {
        this.backButton.onClick(() => {
            if (this.onBack) {
                this.onBack();
            }
        });
    }

    createGameRow(game) {
        const row = document.createElement("tr");
        const values = [game.id, game.tile];

        values.forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.append(cell);
        });

        const actionsCell = document.createElement("td");
        actionsCell.style.display = "flex";
        actionsCell.style.gap = "8px";
        actionsCell.style.alignItems = "center";

        const viewDetailsButton = new Button(
            `view-details-${game.id}`,
            "View Details",
            "game-button replay-button"
        );
        viewDetailsButton.getElement().setAttribute(
            "aria-label",
            `View details for game ${game.id}`
        );
        viewDetailsButton.getElement().dataset.gameId = game.id;

        viewDetailsButton.onClick(async () => {
            try {
                const data = await getGameDetails(game.id);
                
                const gameDetailsPage = new GameDetailsPage(
                    game.id,
                    data.list,
                    () => {
                        const playerHistoryPage = new PlayerHistoryPage(this.onBack);
                        playerHistoryPage.render("app");
                    }
                );

                gameDetailsPage.render("app");

            } catch (error) {
                // show UI message 
                console.error("Failed to retrieve game details:", error);
            }
        });

        const replayButton = new Button(
            `replay-${game.id}`,
            "Replay",
            "game-button replay-button"
        );
        replayButton.getElement().setAttribute(
            "aria-label",
            `Replay game ${game.id}`
        );
        replayButton.getElement().dataset.gameId = game.id;
        
        replayButton.onClick(async () => {
                try {
                    const data = await getGameDetails(game.id);

                    const replayPage = new ReplayPage(
                        game.id,
                        data.list,
                        playerId,
                        () => {
                            const playerHistoryPage = new PlayerHistoryPage(this.onBack);
                            playerHistoryPage.render("app");
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

    async loadPlayerGames() {
        try {
            const data = await getPlayerGames(playerId);

            this.tableBody.replaceChildren();

            if (!data.list || data.list.length === 0) {
                this.tableBody.append(this.emptyState);
                return;
            }

            data.list.forEach(game => {
                const row = this.createGameRow({
                    id: game.id,
                    tile: "-"
                });

                this.tableBody.append(row);
            });

        } catch (error) {
            this.tableBody.replaceChildren();

            if (error.message === "Record not found") {
                this.emptyStateCell.textContent = "No games played yet.";
            } else { 
                console.error("Failed to load player games:", error);

                this.emptyStateCell.textContent = "Failed to load recorded games.";
            }

            this.tableBody.append(this.emptyState);
            
        }
    }

    render(target) {
        const parent = document.getElementById(target);

        if (parent) {
            parent.replaceChildren(this.container);
            this.loadPlayerGames();
        }
    }
}
