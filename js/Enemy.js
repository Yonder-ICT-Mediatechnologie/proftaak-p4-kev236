class Enemy {
    constructor(x, y, sprite, speed, lives, points, projectileSprite = null) {
        this.x = x;
        this.y = y;
        this.sprite = sprite;
        this.width = sprite.width;
        this.height = sprite.height;
        this.speed = speed;
        this.lives = lives;
        this.points = points;
        this.projectiles = []; // Voor vijanden die schieten
        this.projectileSprite = projectileSprite;
    }

    update() {
        this.y += this.speed; // Basis: beweeg naar beneden

        // Update vijandelijke projectielen
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            this.projectiles[i].update();
            if (this.projectiles[i].isOffscreen()) {
                this.projectiles.splice(i, 1);
            }
        }
    }

    display() {
        image(this.sprite, this.x, this.y, this.width, this.height);
        // Teken vijandelijke projectielen
        for (let proj of this.projectiles) {
            proj.display();
        }
    }

    takeDamage() {
        this.lives--;
    }

    isOffscreen() {
        return this.y > CANVAS_HEIGHT + this.height; // Is buiten beeld onderaan
    }
}