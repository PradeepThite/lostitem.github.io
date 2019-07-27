let box = 32;
let snake = [{
    x: 15 * box,
    y: 15 * box
}, {
    x: 16 * box,
    y: 15 * box
}];

let fruit = {
    x: Math.floor(Math.random() * 17 + 1) * box,
    y: Math.floor(Math.random() * 15 + 3) * box
}

let score = 0;

const cvs = document.getElementById('canvas');
ctx = cvs.getContext('2d')

var ground = new Image();
var foodImage = new Image();
ground.src = "./ground.jpg";
foodImage.src = "./fruit.jpg";

ground.onload = function () {
    ctx.drawImage(ground, 0, 0);
    foodImage.onload = function () {
        ctx.drawImage(foodImage, fruit.x, fruit.y, box, box)
        draw();
    }
};

function draw() {
    console.log(new Date() + "-" + JSON.stringify(snake))
    ctx.drawImage(ground, 0, 0);
    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? 'green' : 'white';


        ctx.fillRect(snake[i].x, snake[i].y, box, box/2);
        ctx.strokeStyle = "green";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box/2);

        ctx.fillRect(snake[i].x, snake[i].y-(box/2), box, box/2);
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box/2);
    }
    ctx.drawImage(foodImage, fruit.x, fruit.y, box, box);

    ctx.fillStyle = "white";
    ctx.fillText(score, 2 * box, 1.6 * box);
    runSnake();
}

function runSnake() {
    let oldHead = snake[0];
    let newHead = {
        x: oldHead.x,
        y: oldHead.y
    }
    if (d == "UP") {
        newHead.y -= box;
    } else if (d == "DOWN") {
        newHead.y += box;
    } else if (d == "LEFT") {
        newHead.x -= box;
    } else if (d == "RIGHT") {
        newHead.x += box;
    }

    if (collisionCheck(newHead, snake)) {
        ctx.fillText(score + " Game Over", 2 * box, 1.6 * box);
        pause();
    }
    if (oldHead.x == fruit.x && oldHead.y == fruit.y) {
        score += 1;
        fruit = {
            x: Math.floor(Math.random() * 17 + 1) * box,
            y: Math.floor(Math.random() * 15 + 3) * box
        }
        snake.unshift(newHead);
    } else {
        snake.pop()
        snake.unshift(newHead);
    }
}

function collisionCheck(newHead, snake) {
    for (let i = 0; i < snake.length; i++) {
        const element = snake[i];
        if (element.x == newHead.x && element.y == newHead.y) {
            return true;
        }
    }
    if (newHead.x < box || newHead.y < (3 * box) || newHead.x > (17 * box) || newHead.y > (17 * box)) {
        return true
    }
    return false;
}

function play() {
    // audio.play();
    if (!game)
        game = setInterval(draw, 200);
}