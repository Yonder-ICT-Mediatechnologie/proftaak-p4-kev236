class CollisionManager {
    static checkCollisions(player, enemies, powerUps) {
        // Player Projectile vs Enemy
        for (let i = player.projectiles.length - 1; i >= 0; i--) {
            let projectile = player.projectiles[i];
            for (let j = enemies.length - 1; j >= 0; j--) {
                let enemy = enemies[j];
                if (CollisionManager.isColliding(projectile, enemy)) {
                    enemy.takeDamage();
                    player.projectiles.splice(i, 1); // Verwijder projectiel
                    break; // Ga naar volgende speler projectiel
                }
            }
        }

        // Enemy Projectile vs Player
        for (let i = enemies.length - 1; i >= 0; i--) {
            let enemy = enemies[i];
            for (let j = enemy.projectiles.length - 1; j >= 0; j--) {
                let enemyProjectile = enemy.projectiles[j];
                if (CollisionManager.isColliding(enemyProjectile, player)) {
                    player.takeDamage();
                    enemy.projectiles.splice(j, 1); // Verwijder vijand projectiel
                }
            }
        }

        // Player vs Enemy
        for (let i = enemies.length - 1; i >= 0; i--) {
            let enemy = enemies[i];
            if (CollisionManager.isColliding(player, enemy)) {
                player.takeDamage();
                enemy.takeDamage(); // Vijand krijgt ook schade bij aanraking
            }
        }

        // Player vs PowerUp
        for (let i = powerUps.length - 1; i >= 0; i--) {
            let powerUp = powerUps[i];
            if (CollisionManager.isColliding(player, powerUp)) {
                player.activatePowerUp(powerUp.type);
                powerUps.splice(i, 1); // Verwijder power-up na oppakken
            }
        }
    }

    // Algemene AABB (Axis-Aligned Bounding Box) collision detection
    static isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
}