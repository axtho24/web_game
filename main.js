var Container = PIXI.Container,
    autoDetectRenderer = PIXI.autoDetectRenderer,
    loader = PIXI.loader,
    resources = PIXI.loader.resources,
    Sprite = PIXI.Sprite,
    TextureCache = PIXI.utils.TextureCache;

var renderer = autoDetectRenderer(800, 600);
document.body.appendChild(renderer.view);
renderer.view.style.border = "1px solid black";
renderer.backgroundColor = 0x33AFFF;
renderer.autoResize = true;

var stage = new Container()
renderer.render(stage);


loader
    .add("images/darksouls.json")
    .load(setup);

var sunbro, room, enemies, safe, state;


function setup() {
    game = new Container();
    stage.addChild(game);

    id = resources["images/darksouls.json"].textures;

    room = new Sprite(id["room.png"]);
    game.addChild(room);

    sunbro = new Sprite(id["sunbrostanding.png"]);
    sunbro.scale.set(.7, .7)
    sunbro.position.set(50, 50)
    sunbro.vx = 0
    sunbro.vy = 0
    game.addChild(sunbro);

    safe = new Sprite(id["safe.png"]);
    safe.scale.set(.7, .7)
    safe.position.set(660, 460)
    game.addChild(safe);

    var numberofEnemies = 7,
        spacing = 70,
        xOffset = 150,
        speed = 2,
        direction = 1;

    enemies = []

    for (var i = 0; i < numberofEnemies; i++) {
        var enemy = new Sprite(id["demon3.png"]);
        var x = spacing * i + xOffset;
        var y = randomInt(0, stage.height - enemy.height);
        enemy.x = x;
        enemy.y = y;
        enemy.vx = speed;
        enemy.vy = speed * direction;
        direction *= -1;
        enemies.push(enemy);
        game.addChild(enemy);
    }

    var left = keyboard(37),
        up = keyboard(38),
        right = keyboard(39),
        down = keyboard(40);

    left.press = function() {
        sunbro.vx = -5;
        sunbro.vy = 0;
    };
    left.release = function() {
        if (!right.isDown && sunbro.vy === 0) {
            sunbro.vx = 0;
        }
    };

    up.press = function() {
        sunbro.vy = -5;
        sunbro.vx = 0;
    };
    up.release = function() {
        if (!down.isDown && sunbro.vx === 0) {
            sunbro.vy = 0;
        }
    };

    right.press = function() {
        sunbro.vx = 5;
        sunbro.vy = 0;
    };
    right.release = function() {
        if (!left.isDown && sunbro.vy === 0) {
            sunbro.vx = 0;
        }
    };

    down.press = function() {
        sunbro.vy = 5;
        sunbro.vx = 0;
    };
    down.release = function() {
        if (!up.isDown && sunbro.vx === 0) {
            sunbro.vy = 0;
        }
    };

    state = play
    gameLoop();
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function gameLoop() {
    requestAnimationFrame(gameLoop);
    state();
    renderer.render(stage);
}

function play() {

    sunbro.x += sunbro.vx;
    sunbro.y += sunbro.vy;

    contain(sunbro, {
        x: 28,
        y: 10,
        width: 770,
        height: 565
    });

    enemies.forEach(function(enemy) {
        enemy.x += enemy.vx;
        enemy.y += enemy.vy;
        var enemyHitsWall = contain(enemy, {
            x: 28,
            y: 10,
            width: 770,
            height: 565
        });
        if (enemyHitsWall === "top" || enemyHitsWall === "bottom" ||
            enemyHitsWall === "right" || enemyHitsWall === "left") {
            enemy.vx *= -1;
            enemy.vy *= -1;
        }
    })
}

function contain(sprite, container) {
    var collision = undefined;
    //If hitting the Left wall
    if (sprite.x < container.x) {
        sprite.x = container.x;
        collision = "left";
    }
    //If hittin the Top wall
    if (sprite.y < container.y) {
        sprite.y = container.y;
        collision = "top";
    }
    //If hitting the Right wall
    if (sprite.x + sprite.width > container.width) {
        sprite.x = container.width - sprite.width;
        collision = "right";
    }
    //If hitting the Bottom wall
    if (sprite.y + sprite.height > container.height) {
        sprite.y = container.height - sprite.height;
        collision = "bottom";
    }
    return collision;
}

function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    key.downHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
        }
        event.preventDefault();
    };
    key.upHandler = function(event) {
        if (event.keyCode === key.code) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
        }
        event.preventDefault();
    };
    window.addEventListener(
        "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
        "keyup", key.upHandler.bind(key), false
    );
    return key;
}
