class Player {
    constructor() {
        this.x = PLAYER_START_X;
        this.y = PLAYER_START_Y;
        this.width = 100;
        this.height = 70;
        this.speed = PLAYER_SPEED;
        this.lives = 3;
        this.projectiles = []; // Array om actieve projectielen bij te houden
        this.isInvincible = false;
        this.invincibleTimer = 0;

        // Power-up statussen
        this.activePowerUps = {}; // { type: { duration: N, startTime: M } }
    }

    takeDamage() {
        if (this.activePowerUps[POWERUP_TYPE.SHIELD]) {
            delete this.activePowerUps[POWERUP_TYPE.SHIELD];
            game.startScreenShake(SHAKE_MAGNITUDE / 3, SHAKE_DURATION / 3); // Kleinere shake voor geabsorbeerde hit
            return;
        }

        if (!this.isInvincible) {
            playerHitSound.play();
            this.lives--;
            game.startScreenShake(SHAKE_MAGNITUDE, SHAKE_DURATION); // Grotere shake bij leven verloren
            this.isInvincible = true;
            this.invincibleTimer = 0;
            if (this.lives < 0) {
                this.lives = 0;
            }
        }
    }

    update() {
        // Speler beweging
        if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { // A key
            this.x -= this.speed;
        }
        if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { // D key
            this.x += this.speed;
        }
        if (keyIsDown(UP_ARROW) || keyIsDown(87)) { // W key
            this.y -= this.speed;
        }
        if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) { // S key
            this.y += this.speed;
        }

        // Zorg dat speler binnen scherm blijft
        this.x = constrain(this.x, 0, CANVAS_WIDTH - this.width);
        this.y = constrain(this.y, 0, CANVAS_HEIGHT - this.height);

        // Update speler projectielen
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].update();
            if (this.projectiles[i].isOffscreen()) {
                this.projectiles.splice(i, 1); // Verwijder projectiel buiten scherm
            }
        }

        // Update invincibility timer
        if (this.isInvincible) {
            this.invincibleTimer++;
            if (this.invincibleTimer > PLAYER_INVINCIBILITY_TIME) {
                this.isInvincible = false;
                this.invincibleTimer = 0;
            }
        }
    }

    display() {
        // Teken speler sprite
        if (this.isInvincible && floor(this.invincibleTimer / 10) % 2 === 0) {
            tint(255, 100); // Knipper effect tijdens invincibility
        } else if (this.activePowerUps[POWERUP_TYPE.SHIELD]) {
            // Transparant schild om speler als shield actief is
            tint(150, 200, 255, 150); // Blauw-witte tint
        }
        image(playerSprite, this.x, this.y, this.width, this.height);
        noTint(); // Reset tint voor de volgende frame

        // Teken speler projectielen
        for (let proj of this.projectiles) {
            proj.display();
        }
    }

    shoot() {
        // Schiet een projectiel
        if (shootSound.isLoaded()) {
            shootSound.play();
        }

        if (this.activePowerUps[POWERUP_TYPE.DOUBLEDRAW]) {
            // Dubbelschot: twee projectielen
            this.projectiles.push(new Projectile(this.x + this.width / 4, this.y, playerProjectileSprite, PLAYER_PROJECTILE_SPEED, -1, 'player'));
            this.projectiles.push(new Projectile(this.x + this.width * 3 / 4, this.y, playerProjectileSprite, PLAYER_PROJECTILE_SPEED, -1, 'player'));
        } else {
            // Enkel schot
            this.projectiles.push(new Projectile(this.x + this.width / 2, this.y, playerProjectileSprite, PLAYER_PROJECTILE_SPEED, -1, 'player'));
        }
    }

    takeDamage() {
        if (this.activePowerUps[POWERUP_TYPE.SHIELD]) {
            // Schild absorbeert schade
            delete this.activePowerUps[POWERUP_TYPE.SHIELD];
            return; // Geen leven verloren
        }

        if (!this.isInvincible) {
            playerHitSound.play(); // Speel speler geraakt geluid
            this.lives--;
            this.isInvincible = true;
            this.invincibleTimer = 0;
            if (this.lives < 0) { // Zorg dat levens niet onder 0 gaan
                this.lives = 0;
            }
        }
    }

    // Power-up methoden
    activatePowerUp(type) {
        if (powerupCollectSound.isLoaded()) {
            powerupCollectSound.play();
        }
        this.activePowerUps[type] = {
            startTime: frameCount
        };

        // Pas direct effecten toe
        if (type === POWERUP_TYPE.SPEED) {
            this.speed = PLAYER_SPEED * 1.5; // 50% sneller
            this.activePowerUps[type].duration = POWERUP_DURATION_SPEED;
        } else if (type === POWERUP_TYPE.DOUBLEDRAW) {
            this.activePowerUps[type].duration = POWERUP_DURATION_DOUBLEDRAW;
        } else if (type === POWERUP_TYPE.SHIELD) {
            // Schild heeft geen duur, maar wordt verwijderd na één hit
        }
    }

    updatePowerUps() {
        // Loop door actieve power-ups en deactiveer ze na hun duur
        for (let type in this.activePowerUps) {
            if (type !== POWERUP_TYPE.SHIELD) { // Schild is speciaal
                let pu = this.activePowerUps[type];
                if (frameCount - pu.startTime >= pu.duration) {
                    delete this.activePowerUps[type];
                    // Reset effecten als power-up afgelopen is
                    if (type === POWERUP_TYPE.SPEED) {
                        this.speed = PLAYER_SPEED;
                    }
                }
            }
        }
    }
}