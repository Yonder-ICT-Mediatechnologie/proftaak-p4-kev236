class EnemyCruiser extends Enemy {
    constructor(x, y) {
        super(x, y, enemyCruiserSprite, random(ENEMY_SPEED_MIN / 2, ENEMY_SPEED_MAX / 2), 2, 20, enemyProjectileSprite); // Langzamer, 2 levens, schiet
        this.width = 80; // Specifieke grootte voor Cruiser
        this.height = 80;
        this.shootTimer = 0;
    }

    update() {
        super.update(); // Gebruik de basis update method

        this.shootTimer++;
        if (random(1) < ENEMY_SHOOT_CHANCE && this.shootTimer > 60) { // Kans om te schieten, niet te snel
            this.shoot();
            this.shootTimer = 0;
        }
    }

    shoot() {
        // Schiet een projectiel naar beneden
        this.projectiles.push(new Projectile(this.x + this.width / 2, this.y + this.height, this.projectileSprite, ENEMY_PROJECTILE_SPEED, 1, 'enemy'));
    }
}