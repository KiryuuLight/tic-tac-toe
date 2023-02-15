/* Console version */

function GameBoard() {
    const rows = 3;
    const columns = 3;
    const board = [];

    // A simple way to create a board with rows and columns using arrays.

    for (let i = 0; i < rows; i += 1) {
        board[i] = [];
        for (let j = 0; j < columns; j += 1) {
            board[i][j] = createCell();
        }
    }

    const getBoard = () => board;

    const putPiece = (row, column, player) => {
        const availableCells = board.some(
            (cell, index) => cell[index].getValue() === ''
        );

        if (!availableCells) return;

        if (board[row][column] !== '') {
            board[row][column].addValue(player);
        }

        return board[1][1].getValue();
    };

    function printBoard() {
        const print = board.map((row) => row.map((value) => value.getValue()));
        console.log(print);
    }

    return {
        getBoard,
        putPiece,
        printBoard,
    };
}

// Token : 0 for [] , 1 for 'X' , 2 for 'O'
function createCell() {
    let value = '';
    const addValue = (token) => {
        value = token;
    };

    const getValue = () => value;
    return {
        getValue,
        addValue,
    };
}

function GameController(playerOne = 'Mario', playerTwo = 'Luigi') {
    const board = GameBoard();

    const players = [
        {
            name: playerOne,
            token: '❌',
        },
        {
            name: playerTwo,
            token: '⭕',
        },
    ];

    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn.`);
    };

    const playRound = (row, column) => {
        console.log(
            `Election made , inserting value in row [${row}] , column : [${column}]`
        );
        board.putPiece(row, column, getActivePlayer().token);

        switchPlayerTurn();
        printNewRound();
    };

    // GAME LOGIC

    // In our array we have elements positioned by [x][y] dimensions
    // So we are looking for these specific patterns
    // For row : All [x] values have to be the same , [y] values doesn't matter
    // Example : [0][_] [0][_] [0][_]

    // For column : All [y] values have to be the same , [x] values doesn't matter
    // Example : [_][2] [_][2] [_][2]

    // Three in a row pattern ! [Left]
    // [0][2] [1][1] [2][0]
    // Three in a row pattern ! [Right]
    // [0][0] [1][1] [2][2]

    printNewRound();

    return {
        playRound,
        getActivePlayer,
    };
}

const game = GameController();
