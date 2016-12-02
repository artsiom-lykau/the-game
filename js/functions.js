/**
 * Created by lykovartem on 28.11.2016.
 */

function init() {
    if (game.init()) {
        game.start()
    }
}

function animate() {
    document.getElementById('score').innerHTML = game.playerScore;
    document.getElementById('lvl').innerHTML = game.level;

    game.iShip = game.ship;
    game.iShipBulletPool = game.ship.bulletPool.getPool();
    game.iEnemyBulletPool = game.enemyBulletPool.getPool();
    game.iEnemyPool = game.enemyPool.getPool();

    detectCollision();

    // No more enemies
    if (!game.enemyPool.getPool().length) {
        game.level++;
        game.spawnWave();
    }

    // Animate game objects
    if (game.ship.alive) {
        requestAnimationFrame(animate);
        game.background.draw();
        game.ship.move();
        game.ship.bulletPool.animate();
        game.enemyPool.animate();
        game.enemyBulletPool.animate();
    }
}

function detectCollision() {
    for (var x = 0; x < game.iShipBulletPool.length; x++) {
        for (var y = 0; y < game.iEnemyPool.length; y++) {
            if (game.iShipBulletPool[x].collidableWith == game.iEnemyPool[y].type &&
                (game.iShipBulletPool[x].x < game.iEnemyPool[y].x + game.iEnemyPool[y].width &&
                game.iShipBulletPool[x].x + game.iShipBulletPool[x].width > game.iEnemyPool[y].x &&
                game.iShipBulletPool[x].y < game.iEnemyPool[y].y + game.iEnemyPool[y].height &&
                game.iShipBulletPool[x].y + game.iShipBulletPool[x].height > game.iEnemyPool[y].y)) {
                game.iShipBulletPool[x].isColliding = true;
                game.iEnemyPool[y].isColliding = true;
                //explosion here
            }
        }
    }

    for (var k = 0; k < game.iEnemyBulletPool.length; k++) {
        if (game.iEnemyBulletPool[k].collidableWith == game.iShip.type &&
            (game.iEnemyBulletPool[k].x < game.iShip.x + game.iShip.width &&
            game.iEnemyBulletPool[k].x + game.iEnemyBulletPool[k].width > game.iShip.x &&
            game.iEnemyBulletPool[k].y < game.iShip.y + game.iShip.height &&
            game.iEnemyBulletPool[k].y + game.iEnemyBulletPool[k].height > game.iShip.y)) {
            game.iEnemyBulletPool[k].isColliding = true;
            game.iShip.isColliding = true;
        }
    }
}