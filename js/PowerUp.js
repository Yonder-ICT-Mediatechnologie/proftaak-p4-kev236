class PowerUp {
    constructor(x, y, type) {
        this.x = x - (20 / 2); // Grootte 20x20
        this.y = y;
        this.type = type; // e.g., 'speed', 'shield', 'doubledraw'
        this.width = 40;
        this.height = 40;
        this.speed = 1.5; // Beweegt langzaam naar beneden

        // Kies de juiste sprite
        switch(this.type) {
            case POWERUP_TYPE.SPEED:
                this.sprite = powerupSpeedSprite;
                break;
            case POWERUP_TYPE.SHIELD:
                this.sprite = powerupShieldSprite;
                break;
            case POWERUP_TYPE.DOUBLEDRAW:
                this.sprite = powerupDoubleShotSprite;
                break;
            default:
                this.sprite = null; // Voor het geval type niet matcht
        }
    }

    update() {
        this.y += this.speed;
    }

    display() {
        if (this.sprite) {
            image(this.sprite, this.x, this.y, this.width, this.height);
        } else {
            // Fallback: teken een gekleurd vierkantje als sprite niet gevonden
            fill(255, 0, 255);
            rect(this.x, this.y, this.width, this.height);
        }
    }

    isOffscreen() {
        return this.y > CANVAS_HEIGHT + this.height;
    }
}