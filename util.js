const log = function (data) {
    console.log(JSON.stringify(data))
}

let game;

function start() {
    alert();
}

// var audio/ = new Audio();

function startPlayer() {
    // audio.src = "./audio.mp3";
    // setTimeout(play, 1500)
}



function pause() {
    // audio.pause();
    clearInterval(game);
    game = undefined;
}

function stop() {
    // audio.stop();
    snake = [{
        x: 15 * box,
        y: 15 * box
    }, {
        x: 16 * box,
        y: 15 * box
    }];

    fruit = {
        x: Math.floor(Math.random() * 17 + 1) * box,
        y: Math.floor(Math.random() * 15 + 3) * box
    }

    score = 0;
    pause();
    draw();
}

let d = "LEFT";
document.addEventListener("keydown", function (event) {
    if (event.keyCode == "37" && d != "RIGHT") {
        d = "LEFT";
    } else if (event.keyCode == "38" && d != "DOWN") {
        d = "UP";
    } else if (event.keyCode == "39" && d != "LEFT") {
        d = "RIGHT";
    } else if (event.keyCode == "40" && d != "UP") {
        d = "DOWN";
    }
});