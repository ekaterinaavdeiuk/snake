const canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let width = 800;
let height = 600;
let rectangleSize = 50;

const modalWindow = () => {
    document.querySelector('.modal-window').classList.remove('hidden');
};

document.querySelector('.modal-window').onclick = modalWindow;

const createRectangle = (xRectangle, yRectangle) => {
    ctx.beginPath();
    ctx.fillStyle = '#FFC0CB';
    ctx.strokeStyle = '#CD5C5C';
    ctx.lineWidth = 2;
    ctx.strokeRect(xRectangle, yRectangle, rectangleSize - 1, rectangleSize - 1);
    ctx.fillRect(xRectangle, yRectangle, rectangleSize - 1, rectangleSize - 1);
};

const renderRectangle = () => {
    let xRectangle = 0;
    let yRectangle = 0;
    for (let i = 0; i < height / rectangleSize; i++) {
        for (let j = 0; j < width / rectangleSize; j++) {
            createRectangle(xRectangle, yRectangle);
            xRectangle += rectangleSize;
        }
        xRectangle = 0;
        yRectangle += rectangleSize;
    }
};

let snake = [];
let directionMove = 1;
let foodX = Math.trunc((Math.random() * width) / 100) * 100;
let foodY = Math.trunc((Math.random() * height) / 100) * 100;

const createFood = () => {
    ctx.beginPath();
    ctx.fillStyle = '#EE82EE';
    ctx.fillRect(foodX, foodY, rectangleSize - 1, rectangleSize - 1);
};

const createSnake = () => {
    let snakeX = 600;
    let snakeY = 400;
    for (let i = 0; i < 3; i++) {
        snake.push({x: snakeX - i * rectangleSize, y: snakeY});
    }
};

createSnake();

const snakeDraw = () => {
    let color = ['#DDA0DD', '#FF00FF', '#9370DB', '#8A2BE2', '#8B008B', '#6A5ACD', '#FF69B4'];
    ctx.beginPath();
    ctx.fillStyle = `${color[Math.floor(Math.random() * color.length)]}`;
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x, snake[i].y, rectangleSize - 1, rectangleSize - 1);
    }
};

const moveSnake = () => {
    for (let i = snake.length - 1; i > 0; i--) {
        snake[i].x = snake[i - 1].x;
        snake[i].y = snake[i - 1].y;
    }
    if (directionMove === 1) {
        snake[0].x += rectangleSize;
    } else if (directionMove === 0) {
        snake[0].y -= rectangleSize;
    } else if (directionMove === 2) {
        snake[0].y += rectangleSize;
    } else if (directionMove === 3) {
        snake[0].x -= rectangleSize;
    }
    if (snake[0].x >= width) {
        snake[0].x = 0;
    } else if (snake[0].x < 0) {
        snake[0].x = width;
    }
    if (snake[0].y < 0) {
        snake[0].y = height;
    } else if (snake[0].y >= height) {
        snake[0].y = 0;
    }
};

let sumScore = [0];
let sumArr = [0];

const snakeEatsFood = () => {
    let score = document.querySelector('.score-text');
    if (snake[0].x === foodX && snake[0].y === foodY) {
        if (directionMove === 0 || directionMove === 2) {
            snake.push({x: foodX, y: foodY + rectangleSize});
            sumScore.push(10);
            foodX = Math.trunc((Math.random() * width) / 100) * 100;
            foodY = Math.trunc((Math.random() * height) / 100) * 100;
        } else if (directionMove === 1 || directionMove === 3) {
            snake.push({x: foodX + rectangleSize, y: foodY});
            sumScore.push(10);
            foodX = Math.trunc((Math.random() * width) / 100) * 100;
            foodY = Math.trunc((Math.random() * height) / 100) * 100;
        }
    }
    sumArr = sumScore.reduce((accumulator, currentValue) =>
        accumulator + currentValue, 0);
    score.innerText = `${sumArr}`;
};

const checkSnakeMove = () => {
    for(let i = 2; i < snake.length; ++i) {
        if(snake[0].x === snake[i].x && snake[0].y === snake[i].y) {
            modalWindow();
            clearInterval(interval);
        }
    }
};

let moveTop = true,
    moveRight = true,
    moveDown = true,
    moveLeft = false;

const keyDown = (event) => {
    if (event.keyCode === 38 && moveTop === true) {
        moveDown = false;
        directionMove = 0;
        moveLeft = true;
        moveRight = true;
    } else if (event.keyCode === 39 && moveRight === true) {
        moveLeft = false;
        directionMove = 1;
        moveDown = true;
        moveTop = true;
    } else if (event.keyCode === 40 && moveDown === true) {
        moveTop = false;
        directionMove = 2;
        moveLeft = true;
        moveRight = true;
    } else if (event.keyCode === 37 && moveLeft === true) {
        moveRight = false;
        directionMove = 3;
        moveTop = true;
        moveDown = true;
    }
};

const run = () => {
    renderRectangle();
    snakeDraw();
    moveSnake();
    document.onkeydown = keyDown;
    createFood();
    snakeEatsFood();
    checkSnakeMove();
};

run();

let interval = setInterval(run,200);


