const canvas = document.querySelector("canvas")
const ctx = canvas.getContext("2d")

const score = document.querySelector(".score-value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const btnPlay = document.querySelector(".btn-play")

const size = 30
let snake = [{ x: 270, y: 240 }]
const eatSound = new Audio("./audio/pikmin.mp3")

const addScore = () => {
    score.innerText = +score.innerText + 10
}

const randomNumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}

const randomPosition = () => {
    const number = randomNumber(0, canvas.width - 30)
    return Math.round(number/30) * 30

}

const randomColor = () => {
    const r = randomNumber(0, 255)
    const g = randomNumber(0, 255)
    const b = randomNumber(0, 255)

    return `rgb(${r}, ${g}, ${b})`
}

let food = {x: randomPosition(), y: randomPosition(), color: randomColor()}

const drawSnake = () => {
    ctx.fillStyle = "#ddd"
    
    snake.forEach((elemento, index) => {

        if (index == snake.lenght - 1){
            ctx.fillStyle = "white"
        }

        ctx.fillRect(elemento.x, elemento.y, size, size)
    })
}

let direction, loopId

const drawFood = () => {

    // const {x, y, color} = food

    ctx.shadowColor = food.color
    ctx.shadowBlur = 7
    ctx.fillStyle = food.color
    ctx.fillRect(food.x, food.y, size, size)
    ctx.shadowBlur = 0
}

const moveSnake = () => {
    const head = snake.at(-1) /* pega o ultimo elemento do array */ /* snake[snake.lenght -1] equivalente */

    if (!direction) return

    if(direction == "right"){
        snake.push({x: head.x + size, y: head.y})
    }

    if(direction == "left"){
        snake.push({x: head.x - size, y: head.y})
    }

    if(direction == "up"){
        snake.push({x: head.x, y: head.y - size})
    }

    if(direction == "down"){
        snake.push({x: head.x, y: head.y + size})
    }

    snake.shift()
}

const checkEat = () => {
    const head = snake.at(-1)

    if(head.x == food.x && head.y == food.y){
        addScore()
        snake.push(head)
        eatSound.play()


        let x = randomPosition()
        let y = randomPosition() 
        food.color = randomColor()

        while(snake.find((position) => position.x == x && position.y == y)){
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
    }
}

const GameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(2px)"
}


const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - 30
    const bodyIndex = snake.length - 2

    const wallCollision = head.x < 0 || head.x > 570 || head.y < 0 || head.y > 570

    const selfCollision = snake.find((position, index) => {
        return index < bodyIndex && position.x == head.x && position.y == head.y
    })

    if(wallCollision || selfCollision){
        //alert("Game Over")
        GameOver()
    }
}

const drawBackground = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "#191919"

    for (let i = 30; i < canvas.width; i += 30){

    ctx.beginPath() // evita que as linhas fiquem em "zigue-zague"
    ctx.lineTo(i, 0)
    ctx.lineTo(i, 600)
    ctx.stroke()

    ctx.beginPath() 
    ctx.lineTo(0, i)
    ctx.lineTo(600, i)
    ctx.stroke()
    }
}

const GameLoop = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)
    drawBackground()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    loopId = setTimeout(() => {
        GameLoop()
    }, 300)
}

GameLoop()

document.addEventListener("keydown", ({key}) => {
    if(key == "ArrowRight" && direction != "left"){
        direction = "right"
    }

    if(key == "ArrowLeft" && direction != "right"){
        direction = "left"
    }

    if(key == "ArrowUp" && direction != "down"){
        direction = "up"
    }

    if(key == "ArrowDown" && direction != "up"){
        direction = "down"
    }
})

btnPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [{ x: 270, y: 240 }]
    food = {x: randomPosition(), y: randomPosition(), color: randomColor()}

})

