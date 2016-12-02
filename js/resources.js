/**
 * Created by lykolettem on 25.11.2016.
 */

function ImageRepository() {
    this.background = new Image();
    this.spaceship = new Image();
    this.bullet = new Image();
    this.enemy = new Image();
    this.enemyBullet = new Image();

    this.background.src = "img/bg.png";
    this.spaceship.src = "img/ship.png";
    this.bullet.src = "img/bullet.png";
    this.enemy.src = "img/enemy.png";
    this.enemyBullet.src = "img/bullet_enemy.png";

    // negating the race condition
    let numImages = 5;
    let numLoaded = 0;

    function imageLoaded() {
        numLoaded++;
        if (numLoaded == numImages) {
            init();
        }
    }

    this.background.onload = () => imageLoaded();
    this.spaceship.onload = () => imageLoaded();
    this.bullet.onload = () => imageLoaded();
    this.enemy.onload = () => imageLoaded();
    this.enemyBullet.onload = () => imageLoaded();
}

let imageRepository = new ImageRepository;