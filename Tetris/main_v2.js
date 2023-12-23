
const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')
const $score = document.querySelector('span')
const $button = document.querySelector('button')

const BLOCK_SIZE = 20
const BOARD_WIDTH = 14
const BOARD_HEIGHT = 30

canvas.width = BLOCK_SIZE * BOARD_WIDTH
canvas.height = BLOCK_SIZE * BOARD_HEIGHT

context.scale(BLOCK_SIZE, BLOCK_SIZE)

const PIECES = [
    {
        shape: [
            [1, 1, 1, 1]
        ],
        color: 'grey'
    },
    {
        shape:
            [
                [1, 0, 0],
                [1, 1, 1]
            ],
        color: 'lightblue'
    },
    {
        shape: [
            [0, 0, 1],
            [1, 1, 1]
        ],
        color: 'lightgreen'
    },
    {
        shape:
            [
                [1, 1],
                [1, 1]
            ],
        color: 'orange'
    },
    {
        shape:
            [
                [0, 1, 1],
                [1, 1, 0]
            ],
        color: 'blue'
    },
    {
        shape:
            [
                [0, 1, 0],
                [1, 1, 1]
            ],
        color: 'yellow'
    },
    {
        shape:
            [
                [1, 1, 0],
                [0, 1, 1]
            ],
        color: 'lime'
    }
]

let dropCounter = 0
let lastTime = 0
let gamePaused = true

let speed
let score
let piece
let board

context.fillStyle = '#000'
context.fillRect(0, 0, canvas.width, canvas.height)

function startGame() {
    speed = 800
    score = 0
    piece = getRandomPiece()
    board = createBoard()
    $score.innerText = score
    draw()
    gamePaused = false
    update()
}

function gameOver() {
    window.alert("Game Over !!!")
    gamePaused = true
    update()
    $button.innerText = "Nuevo Juego"
}

function createBoard() {
    ret = []
    for (y = 0; y < BOARD_HEIGHT; y++) {
        row = []
        for (x = 0; x < BOARD_WIDTH; x++) {
            row[x] = new Object({ value: 0, color: '' })
        }
        ret.push(row)
    }
    return ret
}

function getRandomPiece() {
    ret = { shape: [], color: '', position: { x: 0, y: 0 } }
    var index = Math.floor(Math.random() * PIECES.length)
    ret.shape = PIECES[index].shape
    ret.color = PIECES[index].color
    ret.position.x = Math.floor(Math.random() * (BOARD_WIDTH - ret.shape[0].length))
    ret.position.y = 0
    score += 5
    return ret
}

function update(time = 0) {
    if (gamePaused) return
    const deltaTime = time - lastTime
    lastTime = time

    dropCounter += deltaTime

    if (dropCounter > speed) {
        piece.position.y++

        if (checkCollision()) {
            piece.position.y--
            solidifyPiece()
            removeRows()
        }
        dropCounter = 0
    }

    draw()
    window.requestAnimationFrame(update)
}

function draw() {
    context.fillStyle = '#000'
    context.fillRect(0, 0, canvas.width, canvas.height)

    board.forEach((row, y) => {
        row.forEach((cell, x) => {
            if (cell.value === 1) {
                context.fillStyle = cell.color
                context.fillRect(x, y, 1, 1)
                context.lineWidth = 0.1
                context.strokeStyle = "MediumPurple";
                context.strokeRect(x, y, 1, 1)
            }
        })
    })

    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value === 1) {
                context.fillStyle = piece.color
                context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
                context.lineWidth = 0.1
                context.strokeStyle = "MediumPurple";
                context.strokeRect(x + piece.position.x, y + piece.position.y, 1, 1);
            }
        })
    })
}


function checkCollision() {
    return piece.shape.find((row, y) => {
        return row.find((val, x) => {
            if (val == 0) return false
            else if (y + piece.position.y >= BOARD_HEIGHT || (x + piece.position.x >= BOARD_WIDTH) || (x + piece.position.x < 0)) return true
            else if (board[y + piece.position.y][x + piece.position.x].value != 0) return true
            else return false
        })
    })
}


function solidifyPiece() {
    piece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value == 1) {
                board[y + piece.position.y][x + piece.position.x].value = 1
                board[y + piece.position.y][x + piece.position.x].color = piece.color
            }
        })
    })

    //Get random new piece
    piece = getRandomPiece()

    if (checkCollision()) gameOver()
}

function removeRows() {
    const rowsToRemove = []

    board.forEach((row, y) => {
        if (row.every(cell => cell.value == 1)) {
            rowsToRemove.push(y)
        }
    })

    score += 100 * (rowsToRemove.length ** 2)
    $score.innerText = score
    speed -= (rowsToRemove.length > 0 ? 50 : 0)

    rowsToRemove.forEach(y => {
        board.splice(y, 1)
        newRow = []
        for (x = 0; x < BOARD_WIDTH; x++) {
            newRow[x] = new Object({ value: 0, color: '' })
        }
        board.unshift(newRow)
    })
}

$button.addEventListener('click', function () {
    if ($button.innerText === "Continuar") {  // Continuamos una partida ya comenzada
        $button.innerText = "Pausar"
        gamePaused = false;
        update()
    } else if ($button.innerText === "Nuevo Juego") { //Comenzamos una partida desde cero
        $button.innerText = "Pausar"
        startGame()
    } else if ($button.innerText === "Pausar") {//Pausamos una partida en juego
        $button.innerText = "Continuar"
        gamePaused = true
        update()
    }
}, false)

document.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') {
        piece.position.x--
        if (checkCollision()) piece.position.x++
    }
    if (event.key === 'ArrowRight') {
        piece.position.x++
        if (checkCollision()) piece.position.x--
    }
    if (event.key === 'ArrowDown') {
        piece.position.y++
        if (checkCollision()) {
            piece.position.y--
            solidifyPiece()
            removeRows()
        }
    }

    if (event.key === 'ArrowUp') {

        const rotated = []

        for (i = 0; i < piece.shape[0].length; i++) {
            const row = []
            for (j = piece.shape.length - 1; j >= 0; j--) {
                row.push(piece.shape[j][i])
            }
            rotated.push(row)
        }
        const previousShape = piece.shape
        piece.shape = rotated
        if (checkCollision()) {
            piece.shape = previousShape
        }
    }
})
