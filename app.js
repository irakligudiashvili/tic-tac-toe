const Gameboard = (() => {
    let board = ["", "", "", "", "", "", "", "", ""];

    const getBoard = () => board;

    const makeMove = (index, marker) => {
        if (board[index] === "") {
            board[index] = marker;
            return true;
        }
        return false;
    };

    const resetBoard = () => {
        board = ["", "", "", "", "", "", "", "", ""];
    };

    return { getBoard, makeMove, resetBoard };
})();

const Player = (name, marker) => {
    return { name, marker };
};

const GameController = (() => {
    const player1 = Player("Player 1", "X");
    const player2 = Player("Player 2", "O");
    let currentPlayer = player1;
    let isGameOver = false;

    const switchTurn = () => {
        currentPlayer = currentPlayer === player1 ? player2 : player1;
    };

    const checkWin = () => {
        const board = Gameboard.getBoard();
        const winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (let condition of winConditions) {
            const [a, b, c] = condition;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                isGameOver = true;
                return currentPlayer.name;
            }
        }

        if (!board.includes("")) {
            isGameOver = true;
            return "Draw";
        }

        return null;
    };

    const makeMove = (index) => {
        if (isGameOver) return;

        if (Gameboard.makeMove(index, currentPlayer.marker)) {
            const winner = checkWin();
            if (winner) {
                console.log(`Game Over: ${winner}`);
            } else {
                switchTurn();
            }
        }
    };

    const resetGame = () => {
        Gameboard.resetBoard();
        currentPlayer = player1;
        isGameOver = false;
    };

    return { makeMove, resetGame, getCurrentPlayer: () => currentPlayer };
})();

const DisplayController = (() => {
    const cells = document.querySelectorAll(".cell");
    const resetButton = document.getElementById("reset");

    const updateBoard = () => {
        const board = Gameboard.getBoard();
        cells.forEach((cell, index) => {
            cell.textContent = board[index];
        });
    };

    const handleClick = (e) => {
        const index = e.target.dataset.index;
        GameController.makeMove(index);
        updateBoard();
    };

    const resetGame = () => {
        GameController.resetGame();
        updateBoard();
    };

    cells.forEach((cell) => {
        cell.addEventListener("click", handleClick);
    });

    resetButton.addEventListener("click", resetGame);

    return { updateBoard };
})();