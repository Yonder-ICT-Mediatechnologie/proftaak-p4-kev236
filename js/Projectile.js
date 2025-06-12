class Projectile {
    constructor(x, y, sprite, speed, direction, owner) {
        this.x = x - (sprite.width / 2); // Centraal het projectiel op de x-as
        this.y = y;
        this.sprite = sprite;
        this.width = sprite.width;
        this.height = sprite.height;
        this.speed = speed;
        this.direction = direction; // -1 voor omhoog (speler), 1 voor omlaag (vijand)
        this.owner = owner; // 'player' of 'enemy'
    }

    update() {
        this.y += this.speed * this.direction;
    }

    display() {
        image(this.sprite, this.x, this.y, this.width, this.height);
    }

    isOffscreen() {
        // Controleer of projectiel buiten het scherm is
        return this.y < -this.height || this.y > CANVAS_HEIGHT + this.height;
    }
}