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
            token: 'close',
        },
        {
            name: playerTwo,
            token: 'circle',
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

        const player = getActivePlayer().token;

        const isWinner = handleWin(player);

        console.log(isWinner);

        if (
            isWinner.calcX.winner ||
            isWinner.calcY.winner ||
            isWinner.calcCL.winner ||
            isWinner.calcCR.winner
        ) {
            const objValue = Object.values(isWinner).find(
                (obj) => obj.winner === true
            );
            console.log(objValue);
            return objValue;
        }

        switchPlayerTurn();
        printNewRound();

        return [];
    };

    // GAME LOGIC

    const handleWin = (token) => {
        // In our array we have elements positioned by [x][y] dimensions
        // So we are looking for these specific patterns
        // For row : All [x] values have to be the same , [y] values doesn't matter
        // Example : [0][_] [0][_] [0][_]

        const axisX = board.getBoard().map((row, index) => {
            let result = '';
            const value = [0, 1, 2];
            if (
                row[value[0]].getValue() === token &&
                row[value[1]].getValue() === token &&
                row[value[2]].getValue() === token
            ) {
                result = [
                    [index, 0],
                    [index, 1],
                    [index, 2],
                ];
            }

            return result;
        });

        // For column : All [y] values have to be the same , [x] values doesn't matter
        // Example : [_][2] [_][2] [_][2]

        const axisY = board.getBoard().map((el, index) => {
            let result = '';
            const column = board.getBoard().map((row) => row[index].getValue());
            if (column.every((value) => value === token)) {
                result = [
                    [0, index],
                    [1, index],
                    [2, index],
                ];
            }
            return result;
        });

        // Three in a row pattern ! [Left]
        // [0][2] [1][1] [2][0]
        // Three in a row pattern ! [Right]
        // [0][0] [1][1] [2][2]

        const condition = [0, 1, 2];
        const conditionReverse = [2, 1, 0];

        const cross = (value) => {
            const mapValue = board.getBoard().map((row, index) => {
                let result = '';
                if (row[value[index]].getValue() === token) {
                    result = [index, value[index]];
                }

                return result;
            });
            return mapValue;
        };

        // In this function we flat the array to one level --> [[[]]] = [[]]

        const filterFlat = (b) =>
            b.filter((value) => value !== '').flatMap((value) => value);

        const winner = (arr) => {
            console.log(arr);
            if (arr.length === 0) {
                return false;
            }
            return arr.every((value) => value !== '');
        };

        return {
            calcX: {
                axisX: filterFlat(axisX),
                winner: winner(filterFlat(axisX)),
                typeOfLine: 'x-line',
            },
            calcY: {
                axisY: filterFlat(axisY),
                winner: winner(filterFlat(axisY)),
                typeOfLine: 'y-line',
            },
            calcCL: {
                crossL: cross(conditionReverse),
                winner: winner(cross(conditionReverse)),
                typeOfLine: 'cl-line',
            },
            calcCR: {
                crossR: cross(condition),
                winner: winner(cross(condition)),
                typeOfLine: 'cr-line',
            },
        };
    };

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
    };
}

const handleDOM = (() => {
    const information = document.getElementById('information');
    const boardHTML = document.getElementById('boardHTML');
    const modal = document.getElementById('dialog');
    const form = document.getElementById('form');

    const btnStart = document.getElementById('start');

    btnStart.addEventListener('click', () => {
        modal.showModal();
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const players = [
            document.getElementById('playerOne').value,
            document.getElementById('playerTwo').value,
        ];

        modal.close();
        btnStart.textContent = '';

        return ScreenController(players);
    });

    const ScreenController = (players) => {
        const game = GameController(players[0], players[1]);

        const updateScreen = () => {
            boardHTML.textContent = '';

            const board = game.getBoard();
            const activePlayer = game.getActivePlayer();
            console.log(activePlayer);
            information.textContent = `${activePlayer.name} turn!`;

            // Render Board

            let counter = 0;
            board.forEach((row, x) => {
                row.forEach((cell, y) => {
                    counter += 1;
                    const value = document.createElement('button');
                    value.classList.add('btnPick');
                    value.innerHTML = `<img src="img/${cell.getValue()}.svg" alt="" srcset="">`;
                    value.setAttribute('data-x', `${x}`);
                    value.setAttribute('data-y', `${y}`);
                    value.setAttribute('data-move', `${counter}`);

                    boardHTML.appendChild(value);
                });
            });
        };

        function clickHandlerBoard(e) {
            const row = e.target.dataset.x;
            const column = e.target.dataset.y;

            if (!row || !column) return;

            const isWinner = Object.values(game.playRound(row, column));
            console.log(isWinner);
            // Check the second property of the object
            if (isWinner[1]) return winner([isWinner[0], isWinner[2]]);

            updateScreen();
        }

        function drawLines(arr) {
            const [position, type] = arr;
            console.log(position);
            console.log(type);
            const listItems = boardHTML.children;
            const listArray = [...listItems];
            console.log(listArray);
            listArray.forEach((element) => {
                position.forEach((value) => {
                    const [row, column] = value;

                    console.log(value);
                    console.log(row);
                    console.log(column);

                    if (
                        parseInt(element.dataset.x) === row &&
                        parseInt(element.dataset.y) === column
                    ) {
                        const line = document.createElement('img');
                        line.classList.add('child');
                        line.src = `img/${type}.svg`;
                        element.appendChild(line);
                    }
                });
            });
        }

        function winner(arr) {
            updateScreen();
            drawLines(arr);
            information.textContent = `${
                game.getActivePlayer().name
            } WINS THE ROUND!`;
        }

        boardHTML.addEventListener('click', clickHandlerBoard);

        updateScreen();
    };
})();
