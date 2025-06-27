export default class Battleship {
    constructor(playerBoard, opponentBoard) {
        this.player = { board: playerBoard, log: [] };
        this.opponent = { board: opponentBoard, log: [] };
        this.gameStatus = null;
        this.currentTurn = null;
        this.stats = { wins: 0, losses: 0 };
    }

    // Decide who goes first and update the game status
    startGame() {
        this.currentTurn =
            // eslint-disable-next-line @stylistic/no-mixed-operators
            Math.floor(Math.random() * 2 + 1) === 1 ? 'player' : 'opponent';

        this.gameStatus = 'ongoing';
    }

    playTurn(indexPair) {
        if (this.currentTurn === 'player') {
            this.opponent.board.markSquare(indexPair);
            this.currentTurn = 'opponent';
        } else {
            this.player.board.markSquare(indexPair);
            this.currentTurn = 'player';
        }
    }

    // Always executes this method AFTER running 'playTurn'
    logTurn(indexPair) {
        // Opponent played the last turn
        if (this.currentTurn === 'player') {
            if (this.player.board.grid[indexPair[0]][indexPair[1]] === 'miss') {
                this.opponent.log.push([indexPair, 'miss']);
            } else {
                this.opponent.log.push([indexPair, 'hit']);
                // What ship type was hit
                const [shipHit] =
                    this.player.board.grid[indexPair[0]][indexPair[1]];

                if (this.player.board.isShipDestroyed(shipHit)) {
                    this.opponent.log.push([
                        shipHit,
                        this.player.board.getDestroyedLocation(shipHit),
                    ]);
                }
            }
        } else {
            if (
                this.opponent.board.grid[indexPair[0]][indexPair[1]] === 'miss'
            ) {
                this.player.log.push([indexPair, 'miss']);
            } else {
                this.player.log.push([indexPair, 'hit']);
                // What ship type was hit
                const [shipHit] =
                    this.opponent.board.grid[indexPair[0]][indexPair[1]];

                if (this.opponent.board.isShipDestroyed(shipHit)) {
                    this.player.log.push([
                        shipHit,
                        this.opponent.board.getDestroyedLocation(shipHit),
                    ]);
                }
            }
        }
    }

    // Solely updates statistics
    // 'gameStatus' and 'currentTurn' are updated to indicate that the game is over
    endGame(winner) {
        if (winner === 'player') {
            this.gameStatus = 'win';
            this.currentTurn = null;
            this.stats.wins += 1;
        } else {
            this.gameStatus = 'loss';
            this.currentTurn = null;
            this.stats.losses += 1;
        }
    }

    // To be used right after the 'endGame' method
    resetGame(playerBoard, opponentBoard) {
        this.player.board = playerBoard;
        this.player.log = [];

        this.opponent.board = opponentBoard;
        this.opponent.log = [];
    }
}
