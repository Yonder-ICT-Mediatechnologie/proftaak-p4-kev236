class EnemyScout extends Enemy {
    constructor(x, y) {
        super(x, y, enemyScoutSprite, random(ENEMY_SPEED_MIN, ENEMY_SPEED_MAX), 1, 10);
        this.width = 48; // Specifieke grootte voor Scout
        this.height = 48;
    }

    update() {
        super.update(); // Gebruik de basis update method
        // Geen specifieke schiet- of complexe bewegingslogica voor Scouts
    }
}