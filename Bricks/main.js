const SCALE = 5
const BOARD_WIDTH = 150 // 750 pixels
const BOARD_HEIGHT = 100 //500 pixels
const PADDLE_WIDTH = 16
const PADDLE_PADDING = 2
const PADDLE_HEIGHT = 1
const PADDLE_SPEED = 3
const BALL_SIZE = 1 // 5 scaled pixels

const BLOCK_TOP = 10
const BLOCK_GAP = 10

const NUM_BALLS_LEVEL = 3

const SCREENS = [
    [ //Level 1
        {
            color: 'red',
            blocks_in_line: 3,
            block_heigh: 2,
            block_width: 15,
            gapNext: 6
        },

        {
            color: 'yellow',
            blocks_in_line: 6,
            block_heigh: 2,
            block_width: 15,
            gapNext: 4
        },

        {
            color: 'magenta',
            blocks_in_line: 6,
            block_heigh: 1,
            block_width: 15,
            gapNext: 4
        },

        {
            color: 'blue',
            blocks_in_line: 6,
            block_heigh: 2,
            block_width: 10,
            gapNext: 4
        }
    ],
    [ //Level 2
        {
            color: 'pink',
            blocks_in_line: 8,
            block_heigh: 3,
            block_width: 5,
            gapNext: 4
        },

        {
            color: 'lightblue',
            blocks_in_line: 8,
            block_heigh: 3,
            block_width: 5,
            gapNext: 4
        },

        {
            color: 'brown',
            blocks_in_line: 8,
            block_heigh: 3,
            block_width: 5,
            gapNext: 4
        },

        {
            color: 'salmon',
            blocks_in_line: 8,
            block_heigh: 3,
            block_width: 5,
            gapNext: 4
        },

        {
            color: 'red',
            blocks_in_line: 10,
            block_heigh: 4,
            block_width: 3,
            gapNext: 4
        }
    ]
]

const PADDLE_HPOS = BOARD_HEIGHT - PADDLE_PADDING - PADDLE_HEIGHT
const canvas = document.getElementById("app")
const context = canvas.getContext("2d")
const ballsToLive = document.getElementById("balls")
const levelToPlay = document.getElementById("level")
const gameOverLogo = document.getElementById("GameOver")

canvas.width = BOARD_WIDTH * SCALE
canvas.height = BOARD_HEIGHT * SCALE
context.scale(SCALE, SCALE)
rebootBall = new Audio("./rebootClick.wav")
removedBlock = new Audio("./removedBlock.wav")
lostBall = new Audio("./lostBall.wav")
gameOver = new Audio("./gameOver.wav")


class Cell {
    value
    color
    constructor(val, col) {
        this.value = val
        this.color = col
    }
}

class Paddle {
    posX
    previousPosX
    width
    constructor(level) {
        this.width = PADDLE_WIDTH - level
        this.posX = BOARD_WIDTH / 2 - this.width / 2
        this.previousPosX = this.posX
    }

    moveLeft() {
        this.previousPosX = this.posX
        if (this.posX > 0) this.posX -= PADDLE_SPEED
    }

    moveRight() {
        this.previousPosX = this.posX
        if (this.posX < BOARD_WIDTH - this.width) this.posX += PADDLE_SPEED
    }

    updatePaddle() {
        //Borra la antigua paleta
        context.fillStyle = 'black'
        context.fillRect(this.previousPosX, PADDLE_HPOS, this.width, PADDLE_HEIGHT)
        //Dibuja la paleta
        context.fillStyle = 'lightsalmon'
        context.fillRect(this.posX, PADDLE_HPOS, this.width, PADDLE_HEIGHT)
    }
}

class Ball {
    position = {}
    previousP = {}
    direction = {}

    constructor() {
        this.position.x = Math.floor(Math.random() * (BOARD_WIDTH - BALL_SIZE))
        this.position.y = BOARD_HEIGHT - PADDLE_PADDING - PADDLE_HEIGHT
        this.direction.x = (Math.floor(Math.random()) == 0 ? -1 : 1) * BALL_SIZE
        this.direction.y = - BALL_SIZE //Hacia arriba
    }

    move(p, b) {
        this.previousP.x = this.position.x
        this.previousP.y = this.position.y
        this.position.x += this.direction.x
        this.position.y += this.direction.y
        return this.checkCollision(p, b)
    }

    checkCollision(p, b) {
        if (this.position.y <= 0) {
            this.position.y = 0
            this.direction.y = BALL_SIZE
            return true
        }
        if (this.position.x <= 0 || this.position.x >= BOARD_WIDTH) {
            this.position.x -= this.direction.x
            this.direction.x *= -1
            return true
        }
        if (b.board[this.position.y][this.position.x].value != 0) {
            b.removeBlock(this.position.y, this.position.x)
            b.initDrawBoard()
            p.updatePaddle()
            this.direction.y *= -1
            return true
        }
        if (this.position.y == PADDLE_HPOS)
            if (this.position.x >= p.posX && this.position.x <= p.posX + p.width) {
                this.direction.y = -BALL_SIZE
                if (this.position.x <= p.posX + p.width / 3 || this.position.x >= p.posX + 2 * p.width / 3)
                    this.direction.x *= -1
                rebootBall.play()
                return true
            } else {
                return false
            }
        return true
    }

    removePrevious() {
        //Borra la antigua posicion
        context.fillStyle = 'black'
        context.fillRect(this.previousP.x, this.previousP.y, BALL_SIZE, BALL_SIZE)
    }

    updateBall() {
        this.removePrevious()
        //Dibuja la nueva posición de la  pelotita
        context.fillStyle = 'white'
        context.fillRect(this.position.x, this.position.y, BALL_SIZE, BALL_SIZE)
    }

}

class Board {

    board = []
    numBlocks = 0

    constructor(level) {
        let numRows = 0
        for (let i = 0; i < BLOCK_TOP; i++) {
            let row = []
            for (let j = 0; j < BOARD_WIDTH; j++) {
                row[j] = new Cell(0, 'black')
            }
            numRows++
            this.board.push(row)
        }

        SCREENS[level - 1].forEach((i) => {
            this.numBlocks += i.blocks_in_line
            let row = []
            let gap = Math.floor((BOARD_WIDTH - (i.block_width * i.blocks_in_line)) / (i.blocks_in_line + 1))
            for (let k = 0; k < i.block_heigh; k++) {

                //Fill of blank cells
                for (let j = 0; j < BOARD_WIDTH; j++) {
                    row[j] = new Cell(0, 'black')
                }

                let idx = gap

                for (let l = 0; l < i.blocks_in_line; l++) {
                    //Block
                    for (let j = 0; (j < i.block_width) && (idx < BOARD_WIDTH); j++) {
                        row[idx] = new Cell(1, i.color)
                        idx++
                    }//Gap: jump "gap" positions
                    for (let j = 0; (j < gap) && (idx < BOARD_WIDTH); j++) {
                        idx++
                    }
                }

                numRows++
                this.board.push(row)
            }
            //Gap vertical entre bloques
            for (let k = 0; k < i.gapNext; k++) {
                let row = []
                for (let j = 0; j < BOARD_WIDTH; j++) {
                    row[j] = new Cell(0, 'black')
                }
                numRows++
                this.board.push(row)
            }
        })

        for (let i = numRows; i < BOARD_HEIGHT; i++) {
            let row = []
            for (let j = 0; j < BOARD_WIDTH; j++) {
                row[j] = new Cell(0, 'black')
            }
            numRows++
            this.board.push(row)
        }
    }

    removeBlock(r, c) {
        this.numBlocks -= 1
        removedBlock.play()
        let rr = r
        //Current Line
        this.removeRow(r, c)
        //Lines above
        while (this.board[rr - 1][c].value != 0) {
            this.removeRow(rr - 1, c)
            --rr
        }
        rr = r
        //Remove lines below
        while (this.board[rr + 1][c].value != 0) {
            this.removeRow(rr, c)
            ++rr
        }
    }

    removeRow(row, cell) {
        let x = cell
        while (this.board[row][x].value != 0) {
            this.board[row][x].value = 0
            this.board[row][x].color = 'black'
            x++
        }
        x = cell - 1
        while (this.board[row][x].value != 0) {
            this.board[row][x].value = 0
            this.board[row][x].color = 'black'
            x--
        }
    }

    initDrawBoard() {
        for (let y = 0; y < BOARD_HEIGHT; y++) {
            for (let x = 0; x < BOARD_WIDTH; x++) {
                context.fillStyle = this.board[y][x].color
                context.fillRect(x, y, 1, 1)
            }
        }
    }

}

class Game {

    numBalls
    level
    paddle
    ball
    board

    constructor() {
        this.level = 1
        this.numBalls = NUM_BALLS_LEVEL
        ballsToLive.innerText = "Vidas : " + this.numBalls
        levelToPlay.innerText = "Nivel : " + this.level
        this.paddle = new Paddle(this.level)
        this.ball = new Ball()
        this.board = new Board(this.level)
    }

    play() {

        this.board.initDrawBoard()
        this.paddle.updatePaddle()

        document.addEventListener('keydown', event => {
            if (event.key === 'ArrowLeft') {
                this.paddle.moveLeft()
                this.paddle.updatePaddle()
            }
            if (event.key === 'ArrowRight') {
                this.paddle.moveRight()
                this.paddle.updatePaddle()
            }
        })

        playLevel(this.board, this.paddle, this.ball, (ret) => {

            if (ret == "newBall") {
                this.numBalls--
                if (this.numBalls >= 0) {
                    ballsToLive.innerText = "Vidas : " + this.numBalls
                    this.ball = new Ball()
                    this.play()
                } else {
                    gameOverLogo.style.display = "inline-block"
                    gameOver.play()
                    //gameOver.onended = function () {window.alert("Game Over ... No more balls")}
                }

            } else if (ret == "newLevel") {
                this.level++
                if (this.level > SCREENS.length) {
                    gameOverLogo.innerText = "Game Ended"
                    gameOverLogo.style.display = "inline-block"
                    gameOver.play()
                    window.alert("End of game. No more levels to play")
                } else {
                    this.board = new Board(this.level)
                    this.paddle = new Paddle(this.level)
                    this.ball = new Ball()
                    this.play()
                }
            }
        })
    }
}

function playLevel(board, paddle, ball, callback) {

    let dropCounter = 0
    let lastTime = 0
    let speed = 20
    let score = 0

    update()

    async function update(time = 0) {
        const deltaTime = time - lastTime
        let ret
        lastTime = time

        dropCounter += deltaTime

        if (dropCounter > speed) {
            dropCounter = 0

            if (!ball.move(paddle, board)) { //Bola al agujero
                lostBall.play()
                await new Promise(r => setTimeout(r, 2000))
                callback("newBall")
            }

            ball.updateBall()
            if (ball.previousP.y == PADDLE_HPOS)
                paddle.updatePaddle()

            if (board.numBlocks == 0) {
                callback("newLevel")
            }
        }
        window.requestAnimationFrame(update)
    }
}

let game = new Game()
game.play()


