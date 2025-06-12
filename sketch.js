// Globale variabelen
let game;

// Sprites
let playerSprite, enemyScoutSprite, enemyCruiserSprite;
let playerProjectileSprite, enemyProjectileSprite;
let powerupSpeedSprite, powerupShieldSprite, powerupDoubleShotSprite;

// Geluiden
let shootSound, enemyExplosionSound, playerHitSound, powerupCollectSound, gameoverSound;
let backgroundMusic;

// Nieuw: Voor pixel font
let pixelFont;

function preload() {
    // Laad alle afbeeldingen
    playerSprite = loadImage('assets/images/player_ship.gif');
    enemyScoutSprite = loadImage('assets/images/enemy_scout.png');
    enemyCruiserSprite = loadImage('assets/images/enemy_cruiser.png');
    playerProjectileSprite = loadImage('assets/images/player_projectile.gif');
    enemyProjectileSprite = loadImage('assets/images/enemy_projectile.png');
    powerupSpeedSprite = loadImage('assets/images/powerup_speed.png');
    powerupShieldSprite = loadImage('assets/images/powerup_shield.png');
    powerupDoubleShotSprite = loadImage('assets/images/powerup_doubleshot.png');

    // Laad alle geluiden
    shootSound = loadSound('assets/sounds/shoot_sfx.wav');
    enemyExplosionSound = loadSound('assets/sounds/explosion_sfx.wav');
    playerHitSound = loadSound('assets/sounds/player_hit_sfx.wav');
    powerupCollectSound = loadSound('assets/sounds/powerup_sfx.wav');
    gameoverSound = loadSound('assets/sounds/gameover_sfx.wav');
    backgroundMusic = loadSound('assets/sounds/background_music.mp3');

    // Laad pixel font
    pixelFont = loadFont('assets/fonts/retro_font.ttf');
}

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    pixelDensity(1); // Belangrijk voor scherpe pixel-art
    frameRate(60); // Stel de framerate in op 60 FPS

    game = new Game(); // Instantieer de Game klasse
}

function draw() {
    background(0); // Zwarte achtergrond (ruimte)

    // Stel het font in voor de UI
    textFont(pixelFont); // Gebruik het geladen pixel font
    textSize(FONT_SIZE); // Standaard font size

    // Pas schermtrilling toe indien actief
    translate(game.screenShake.x, game.screenShake.y);

    game.update(); // Update game logica
    game.display(); // Teken alles
    
    // Reset de translatie voor de volgende frame als je UI elementen niet meetrillen
    // of je past het schermtrilling effect toe op alles. Voor nu: alles trilt mee.

    // Teken scanlines over de hele canvas voor retro effect
    drawScanlines();
}

function keyPressed() {
    game.handleKeyPress(keyCode);
    // Om muziek te starten bij de eerste interactie, vanwege browser policies
    // Zorg ervoor dat het geluid alleen start als het in het speelgedeelte komt
    if (game.state === GAME_STATE.PLAYING && !backgroundMusic.isPlaying()) {
        backgroundMusic.loop();
        backgroundMusic.setVolume(0.3);
    }
}

function keyReleased() {
    game.handleKeyRelease(keyCode);
}

// Functie om scanlines te tekenen
function drawScanlines() {
    stroke(0, 0, 0, 50); // Zwarte lijnen, licht transparant
    strokeWeight(1);
    for (let y = 0; y < CANVAS_HEIGHT; y += 2) {
        line(0, y, CANVAS_WIDTH, y);
    }
}