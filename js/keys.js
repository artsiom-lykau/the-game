/**
 * Created by lykovartem on 28.11.2016.
 */

const KEY_CODES = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
};

let KEY_STATUS = {};
for (code in KEY_CODES) {
    KEY_STATUS[KEY_CODES[code]] = false;
}

document.onkeydown = function (e) {
    let keyCode = e.keyCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = true;
    }
};

document.onkeyup = function (e) {
    let keyCode = e.keyCode;
    if (KEY_CODES[keyCode]) {
        e.preventDefault();
        KEY_STATUS[KEY_CODES[keyCode]] = false;
    }
};

document.onkeypress = function (e) {
    //restart if the player is dead
    if ((e.which == 114 || e.which == 82 || e.which == 1082 || e.which == 1050)
        && game.ship.alive == false) {
        e.preventDefault();
        game.restart();
    }
};