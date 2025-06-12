class Game {
    constructor() {
        this.state = GAME_STATE.MENU;
        this.player = new Player();
        this.enemies = [];
        this.powerUps = [];
        this.score = 0;
        this.waveTimer = 0;
        this.enemySpawnCounter = 0;
        this.ui = new UI();
        this.lastShotTime = 0; // Voor speler cooldown

        // Nieuw: Voor schermtrilling
        this.screenShake = {
            x: 0,
            y: 0,
            duration: 0,
            magnitude: 0
        };
    }

    resetGame() {
        this.player = new Player();
        this.enemies = [];
        this.powerUps = [];
        this.score = 0;
        this.waveTimer = 0;
        this.enemySpawnCounter = 0;
        this.screenShake = { x: 0, y: 0, duration: 0, magnitude: 0 }; // Reset shake
        
        if (gameoverSound.isPlaying()) {
            gameoverSound.stop();
        }
        if (!backgroundMusic.isPlaying()) {
            backgroundMusic.loop();
            backgroundMusic.setVolume(0.3);
        }
    }

    update() {
        // Nieuw: Update schermtrilling
        if (this.screenShake.duration > 0) {
            this.screenShake.x = random(-this.screenShake.magnitude, this.screenShake.magnitude);
            this.screenShake.y = random(-this.screenShake.magnitude, this.screenShake.magnitude);
            this.screenShake.duration--;
        } else {
            this.screenShake.x = 0;
            this.screenShake.y = 0;
        }

        switch (this.state) {
            case GAME_STATE.MENU:
                // Menu logic (geen update, alleen display)
                break;
            case GAME_STATE.PLAYING:
                this.player.update();

                this.enemySpawnCounter++;
                // Pas spawn interval aan om progressief moeilijker te worden
                let currentSpawnInterval = max(ENEMY_SPAWN_INTERVAL - floor(this.score / 100), 30);
                if (this.enemySpawnCounter >= currentSpawnInterval) {
                    this.spawnEnemy();
                    this.enemySpawnCounter = 0;
                }

                for (let i = this.enemies.length - 1; i >= 0; i--) {
                    this.enemies[i].update();
                    if (this.enemies[i].isOffscreen()) {
                        this.enemies.splice(i, 1);
                    } else if (this.enemies[i].lives <= 0) {
                        this.score += this.enemies[i].points;
                        enemyExplosionSound.play();
                        this.startScreenShake(SHAKE_MAGNITUDE / 2, SHAKE_DURATION / 2); // Kleinere shake bij vijand explosie
                        if (random(1) < POWERUP_DROP_CHANCE) {
                            this.spawnPowerUp(this.enemies[i].x + this.enemies[i].width / 2, this.enemies[i].y + this.enemies[i].height / 2); // Drop in midden
                        }
                        this.enemies.splice(i, 1);
                    }
                }

                for (let i = this.powerUps.length - 1; i >= 0; i--) {
                    this.powerUps[i].update();
                    if (this.powerUps[i].isOffscreen()) {
                        this.powerUps.splice(i, 1);
                    }
                }

                // Collision detection
                CollisionManager.checkCollisions(this.player, this.enemies, this.powerUps);
                
                // Update actieve power-ups van speler
                this.player.updatePowerUps();

                if (this.player.lives <= 0) {
                    this.state = GAME_STATE.GAME_OVER;
                    backgroundMusic.stop();
                    gameoverSound.play();
                }
                break;
            case GAME_STATE.GAME_OVER:
                // Game over logic
                break;
            case GAME_STATE.CONTROLS:
                // Controls screen logic
                break;
            case GAME_STATE.HIGH_SCORES:
                // High scores screen logic
                break;
        }
    }

    display() {
        switch (this.state) {
            case GAME_STATE.MENU:
                this.ui.drawMenu(this.score);
                break;
            case GAME_STATE.PLAYING:
                // Teken speler
                this.player.display();
                // Teken vijanden
                for (let enemy of this.enemies) {
                    enemy.display();
                }
                // Teken power-ups
                for (let pu of this.powerUps) {
                    pu.display();
                }
                // Teken UI (score, levens, power-up status)
                this.ui.drawHUD(this.score, this.player.lives, this.player.activePowerUps);
                break;
            case GAME_STATE.GAME_OVER:
                this.ui.drawGameOver(this.score);
                break;
            case GAME_STATE.CONTROLS:
                this.ui.drawControls();
                break;
            case GAME_STATE.HIGH_SCORES:
                this.ui.drawHighScores();
                break;
        }
    }

    handleKeyPress(keyCode) {
        if (this.state === GAME_STATE.MENU) {
            if (keyCode === ENTER) {
                this.state = GAME_STATE.PLAYING;
                this.resetGame();
            } else if (keyCode === 67) { // C key for Controls
                this.state = GAME_STATE.CONTROLS;
            } else if (keyCode === 72) { // H key for High Scores
                this.state = GAME_STATE.HIGH_SCORES;
            }
        } else if (this.state === GAME_STATE.PLAYING) {
            if (keyCode === 32) { // Spatiebalk om te schieten
                if (frameCount - this.lastShotTime > PLAYER_COOLDOWN) {
                    this.player.shoot();
                    this.lastShotTime = frameCount;
                }
            }
        } else if (this.state === GAME_STATE.GAME_OVER) {
            if (keyCode === ENTER) {
                this.state = GAME_STATE.PLAYING;
                this.resetGame();
            } else if (keyCode === ESCAPE) { // ESC key to go back to menu
                this.state = GAME_STATE.MENU;
                this.resetGame();
            }
        } else if (this.state === GAME_STATE.CONTROLS || this.state === GAME_STATE.HIGH_SCORES) {
            if (keyCode === ESCAPE) { // ESC key to go back to menu
                this.state = GAME_STATE.MENU;
            }
        }
    }

    handleKeyRelease(keyCode) {
        // Momenteel niet veel nodig hier
    }

    spawnEnemy() {
        let randX = random(50, CANVAS_WIDTH - 50);
        let enemyType = random() < 0.7 ? 'scout' : 'cruiser';
        let newEnemy;

        if (enemyType === 'scout') {
            newEnemy = new EnemyScout(randX, -50);
        } else {
            newEnemy = new EnemyCruiser(randX, -50);
        }
        this.enemies.push(newEnemy);
    }

    spawnPowerUp(x, y) {
        let randType = random(1);
        let type;
        if (randType < 0.33) {
            type = POWERUP_TYPE.SPEED;
        } else if (randType < 0.66) {
            type = POWERUP_TYPE.SHIELD;
        } else {
            type = POWERUP_TYPE.DOUBLEDRAW;
        }
        this.powerUps.push(new PowerUp(x, y, type));
    }

    gameOver() {
        this.state = GAME_STATE.GAME_OVER;
        // Opslaan high score gebeurt nu in UI.drawGameOver
    }

    // Nieuw: Schermtrilling functie
    startScreenShake(magnitude, duration) {
        this.screenShake.magnitude = magnitude;
        this.screenShake.duration = duration;
    }
}