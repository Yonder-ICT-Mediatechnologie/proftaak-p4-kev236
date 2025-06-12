// Algemene game constanten
const CANVAS_WIDTH = 480;
const CANVAS_HEIGHT = 640;
const FONT_SIZE = 16;
const PLAYER_START_X = CANVAS_WIDTH / 2;
const PLAYER_START_Y = CANVAS_HEIGHT - 60;
const PLAYER_SPEED = 4;
const PLAYER_PROJECTILE_SPEED = 8;
const PLAYER_COOLDOWN = 15; // Frames tussen schoten (60 frames/sec = 4 schoten/sec)
const PLAYER_INVINCIBILITY_TIME = 120; // Frames (2 seconden)

// Vijand constanten
const ENEMY_SPAWN_INTERVAL = 60; // Frames tussen vijand spawns (1 seconde)
const ENEMY_SPEED_MIN = 1;
const ENEMY_SPEED_MAX = 3;
const ENEMY_PROJECTILE_SPEED = 4;
const ENEMY_SHOOT_CHANCE = 0.005; // Kans dat een Cruiser schiet per frame

// Power-up constanten
const POWERUP_DURATION_SPEED = 5 * 60; // 5 seconden in frames
const POWERUP_DURATION_DOUBLEDRAW = 7 * 60; // 7 seconden in frames
const POWERUP_DROP_CHANCE = 0.1; // 10% kans dat een vijand een power-up dropt

// Game States
const GAME_STATE = {
    MENU: 'menu',
    PLAYING: 'playing',
    GAME_OVER: 'game_over',
    CONTROLS: 'controls',
    HIGH_SCORES: 'high_scores'
};

// Power-up types
const POWERUP_TYPE = {
    SPEED: 'speed',
    SHIELD: 'shield',
    DOUBLEDRAW: 'doubledraw'
};

// Nieuwe constanten voor retro effecten
const SHAKE_MAGNITUDE = 5; // Hoe sterk de schermtrilling is
const SHAKE_DURATION = 15; // Hoe lang de schermtrilling duurt (in frames)