/**
 * Created by lykolettem on 28.11.2016.
 */

// Main game function
function Game() {
    this.init = () => {
        this.bgCanvas = document.getElementById('background');
        this.shipCanvas = document.getElementById('ship');
        this.mainCanvas = document.getElementById('main');

        this.bgContext = this.bgCanvas.getContext('2d');
        this.shipContext = this.shipCanvas.getContext('2d');
        this.mainContext = this.mainCanvas.getContext('2d');

        // Initialize objects to contain their context and canvas information
        Background.prototype.context = this.bgContext;
        Background.prototype.canvasWidth = this.bgCanvas.width;
        Background.prototype.canvasHeight = this.bgCanvas.height;

        Ship.prototype.context = this.shipContext;
        Ship.prototype.canvasWidth = this.shipCanvas.width;
        Ship.prototype.canvasHeight = this.shipCanvas.height;

        Bullet.prototype.context = this.mainContext;
        Bullet.prototype.canvasWidth = this.mainCanvas.width;
        Bullet.prototype.canvasHeight = this.mainCanvas.height;

        Enemy.prototype.context = this.mainContext;
        Enemy.prototype.canvasWidth = this.mainCanvas.width;
        Enemy.prototype.canvasHeight = this.mainCanvas.height;

        // Initialize the background object
        this.background = new Background();
        this.background.init(0, 0); // draw from point 0,0 of canvas

        // Initialize the ship object
        this.ship = new Ship();

        // Set the ship start point
        let shipStartX = this.shipCanvas.width / 2 - imageRepository.spaceship.width;
        let shipStartY = 3 * this.shipCanvas.height / 4 + imageRepository.spaceship.height * 2;
        this.ship.init(shipStartX, shipStartY, imageRepository.spaceship.width, imageRepository.spaceship.height);

        // Initialize the enemy pool object
        this.enemyPool = new Pool(30);
        this.enemyPool.init("enemy");
        this.spawnWave();

        // Initialize the enemy bullet pool object
        this.enemyBulletPool = new Pool(50);
        this.enemyBulletPool.init("enemyBullet");

        return true;
    };

    // Spawn a new wave of enemies
    this.spawnWave = () => {
        let height = imageRepository.enemy.height;
        let width = imageRepository.enemy.width;
        let x = 100;
        let y = -height;
        let spacer = y * 1.5;
        for (let i = 1; i <= 24; i++) {
            this.enemyPool.get(x, y, 2);
            x += width + 25;
            if (!(i % 6)) {
                x = 100;
                y += spacer
            }
        }
    };

    // Game over
    this.gameOver = () => {
        document.getElementById('game-over').style.display = "block";
    };

    // Restart the game
    this.restart = function (option) {

        // Clear all canvases
        this.bgContext.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
        this.shipContext.clearRect(0, 0, this.shipCanvas.width, this.shipCanvas.height);
        this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);

        // Set draw point to 0,0
        this.background.init(0, 0);

        // Set the ship to start point
        this.ship.init(this.shipStartX, this.shipStartY, imageRepository.spaceship.width, imageRepository.spaceship.height);

        this.enemyPool.init("enemy");
        this.spawnWave();
        this.enemyBulletPool.init("enemyBullet");

        let lives = '';
        for (let i = 1; i <= game.playerLives; i++) {
            lives += '<img src="img/live.png" /> \n';
        }
        document.getElementById('lives').innerHTML = lives;

        this.init();

        if (option != 'still-alive') {

            document.getElementById('game-over').style.display = "none";
            this.playerScore = 0;
            this.playerLives = 3;
            this.level = 1;

            this.start();
        }
    };

    // Start the animation loop
    this.start = () => {
        this.playerScore = 0;
        this.level = 1;
        this.playerLives = 3;
        this.ship.draw(); // draw the ship only when start and later when the ship is moving
        animate();
    };
}

// The base class for all drawable objects in the game
function Drawable() {
    this.init = function (x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    };

    this.canvasWidth = 0;
    this.canvasHeight = 0;
    this.collidableWith = "";
    this.isColliding = false;
    this.type = "";
}

/*
 function Drawable() {
 this.init = function (x, y, width, height) {
 this.x = x;
 this.y = y;
 this.width = width;
 this.height = height;
 };

 this.canvasWidth = 0;
 this.canvasHeight = 0;
 this.collidableWith = "";
 this.isColliding = false;
 this.type = "";
 }
 * */

// Pool object. Holds objects to be managed to prevent garbage collection.
function Pool(maxSize) {
    let size = maxSize; // Max bullets allowed in the pool
    let pool = [];

    // Populates the pool array with the given objects
    this.init = function (object) {
        if (object == "bullet") {
            for (let i = 0; i < size; i++) {
                let bullet = new Bullet("bullet");
                bullet.init(0, 0, imageRepository.bullet.width, imageRepository.bullet.height);
                bullet.collidableWith = "enemy";
                bullet.type = "bullet";
                pool.push(bullet);
            }
        }
        else if (object == "enemy") {
            for (let i = 0; i < size; i++) {
                let enemy = new Enemy();
                enemy.init(0, 0, imageRepository.enemy.width, imageRepository.enemy.height);
                pool.push(enemy);
            }
        }
        else if (object == "enemyBullet") {
            for (let i = 0; i < size; i++) {
                let bullet = new Bullet("enemyBullet");
                bullet.init(0, 0, imageRepository.enemyBullet.width, imageRepository.enemyBullet.height);
                bullet.collidableWith = "ship";
                bullet.type = "enemyBullet";
                pool.push(bullet);
            }
        }
    };

    // Return all alive objects in the pool as an array
    this.getPool = () => {
        let obj = [];
        for (let i = 0; i < size; i++) {
            if (pool[i].alive) {
                obj.push(pool[i]);
            }
        }
        return obj;
    };

    // Grabs the last item in the array and initializes it and pushes it to the front of the array.
    this.get = function (x, y, speed) {
        if (!pool[size - 1].alive) {
            pool[size - 1].spawn(x, y, speed);
            pool.unshift(pool.pop());
        }
    };

    this.getTwo = function (x1, y1, speed1, x2, y2, speed2) {
        if (!pool[size - 1].alive && !pool[size - 2].alive) {
            this.get(x1, y1, speed1);
            this.get(x2, y2, speed2);
        }
    };

    // Draws any object in use. If a object goes off the screen, clears it and pushes it to the front of the array.
    this.animate = () => {
        for (let i = 0; i < size; i++) {
            // Draw until find a object that is not alive
            if (pool[i].alive) {
                if (pool[i].draw()) {
                    pool[i].clear();
                    pool.push(pool.splice(i, 1)[0]);
                }
            }
            else break;
        }
    };
}

function Background() {

    this.draw = () => {
        // this.y += game.level;
        this.y += 7;
        this.context.drawImage(imageRepository.background, this.x, this.y);
        // Draw another image at the top edge of the first image
        this.context.drawImage(imageRepository.background, this.x, this.y - this.canvasHeight);
        // If the image scrolled off the screen, reset
        if (this.y >= this.canvasHeight) {
            this.y = 0;
        }
    };
}
Background.prototype = new Drawable();

function Bullet(object) {
    let self = object;
    this.alive = false; // It's true if the bullet is currently in use

    this.spawn = function (x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed;
        this.alive = true;
    };

    // Returns true if the bullet moved off the screen, otherwise draws the bullet.
    this.draw = () => {
        this.context.clearRect(this.x, this.y, this.width, this.height);
        this.y -= this.speed;

        if (this.isColliding) {
            return true;
        }
        if (self == "bullet" && this.y <= -this.height) {
            return true;
        }
        else if (self == "enemyBullet" && this.y >= this.canvasHeight) {
            return true;
        }
        else {
            if (self == "bullet") {
                this.context.drawImage(imageRepository.bullet, this.x, this.y);
            }
            else if (self == "enemyBullet") {
                this.context.drawImage(imageRepository.enemyBullet, this.x, this.y);
            }
            return false;
        }
    };

    this.clear = () => {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.alive = false;
        this.isColliding = false;
    };
}
Bullet.prototype = new Drawable();

// Create the Ship object
function Ship() {
    let fireRate = 14;
    let counter = 0;
    this.speed = 3;
    this.bulletPool = new Pool(30);
    this.bulletPool.init("bullet");
    this.collidableWith = "enemyBullet";
    this.type = "ship";
    this.alive = true;

    this.draw = () => {
        this.context.drawImage(imageRepository.spaceship, this.x, this.y);
    };

    this.move = () => {
        counter++;
        if (KEY_STATUS.left || KEY_STATUS.right || KEY_STATUS.down || KEY_STATUS.up) {
            this.context.clearRect(this.x, this.y, this.width, this.height);
            if (KEY_STATUS.left) {
                this.x -= this.speed;
                if (this.x <= 0) {
                    this.x = 0;
                }
            }
            if (KEY_STATUS.right) {
                this.x += this.speed;
                if (this.x >= this.canvasWidth - this.width) {
                    this.x = this.canvasWidth - this.width;
                }
            }
            if (KEY_STATUS.up) {
                this.y -= this.speed;
                if (this.y <= this.canvasHeight / 4 * 3) {
                    this.y = this.canvasHeight / 4 * 3;
                }
            }
            if (KEY_STATUS.down) {
                this.y += this.speed;
                if (this.y >= this.canvasHeight - this.height) {
                    this.y = this.canvasHeight - this.height;
                }
            }
            if (!this.isColliding) {
                this.draw();
            }
            else {
                game.playerLives--;
                if (!game.playerLives) {
                    this.alive = false;
                    game.gameOver();
                    document.getElementById('lives').innerHTML = "";
                } else {
                    game.restart("still-alive");
                }
            }
        }
        if (KEY_STATUS.space && counter >= fireRate && !this.isColliding) {
            this.fire();
            counter = 0;
        }
    };

    this.fire = () => {
        this.bulletPool.getTwo(this.x + 4, this.y, 3, this.x + 35, this.y, 3);
    };
}
Ship.prototype = new Drawable();

// Create the Enemy ship object.
function Enemy() {
    let percentFire = .005;
    let chance = 0;
    this.alive = false;
    this.collidableWith = "bullet";
    this.type = "enemy";

    this.spawn = function (x, y, speed) {
        this.x = x;
        this.y = y;
        this.speed = speed * game.level;
        this.speedX = 0;
        this.speedY = speed;
        this.alive = true;
        this.leftEdge = this.x - 90;
        this.rightEdge = this.x + 180;
        this.bottomEdge = this.y + 180;
    };

    // Move the enemy
    this.draw = () => {
        this.context.clearRect(this.x, this.y, this.width, this.height);
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < this.leftEdge) {
            this.speedX = this.speed;
        }
        else if (this.x > this.rightEdge) {
            this.speedX = -this.speed;
        }
        if (this.y > this.bottomEdge) {
            this.speed = 1.5;
            this.speedY = 0;
            this.y = this.bottomEdge;
            this.speedX = -this.speed;
        }
        if (!this.isColliding) {
            this.context.drawImage(imageRepository.enemy, this.x, this.y);
            // Chance to shoot every movement
            chance = Math.floor(Math.random() * 400 / game.level * 2);
            if (chance / 100 < percentFire) {
                this.fire();
            }
            return false;
        }
        else {
            game.playerScore += (2 * game.level);
            return true;
        }
    };

    this.fire = () => {
        game.enemyBulletPool.get(this.x + this.width / 2, this.y + this.height, -2.5 - game.level * .5);
    };

    this.clear = () => {
        this.x = 0;
        this.y = 0;
        this.speed = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.alive = false;
        this.isColliding = false;
    };
}
Enemy.prototype = new Drawable();