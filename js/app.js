/* Console version */

const gameBoard = (function () {
    const rows = 3;
    const columns = 3;
    const board = [];
    const valueFill = '[]';

    // A simple way to create a board with rows and columns using arrays.

    for (let i = 0; i < rows; i += 1) {
        board[i] = [];
        for (let j = 0; j < columns; j += 1) {
            board[i][j] = valueFill;
        }
    }

    const getBoard = () => board;

    return {
        getBoard,
    };
})();

const fillCell = (row, column, player) => {
    let value;
    player === 'One' ? (value = 'X') : (value = 'O');

    const board = gameBoard.getBoard();
    console.log(board.length);
    const fillWithValue = () => {
        if (row || column > board.length - 1) return;
        board[row][column] = value;
        console.log(board);
    };
    return {
        fillWithValue,
    };
};

const displayController = (function () {})();

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
