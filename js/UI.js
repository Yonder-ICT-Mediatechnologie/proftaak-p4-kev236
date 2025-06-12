class UI {
    constructor() {
        this.highScores = this.loadHighScores(); // Voor persistente high scores
    }

    drawHUD(score, lives, activePowerUps) {
        fill(255); // Wit
        noStroke();
        textAlign(LEFT, TOP);
        text(`SCORE: ${nf(score, 5)}`, 10, 10); // nf(score, 5) formatteert met leading zeros

        textAlign(RIGHT, TOP);
        text(`LIVES: ${lives}`, CANVAS_WIDTH - 10, 10);

        // Teken actieve power-ups
        let powerUpText = "";
        for (let type in activePowerUps) {
            if (type === POWERUP_TYPE.SHIELD) {
                powerUpText += "SHIELD ACTIVE! ";
            } else {
                let timeLeft = ceil((activePowerUps[type].duration - (frameCount - activePowerUps[type].startTime)) / 60);
                powerUpText += `${type.toUpperCase()}: ${timeLeft}s `;
            }
        }
        textAlign(CENTER, TOP);
        text(powerUpText, CANVAS_WIDTH / 2, 10);
    }

drawMenu(lastScore = 0) {
        background(0);
        fill(255);
        textAlign(CENTER, CENTER);

        textSize(FONT_SIZE * 2);
        text("PUSSIEBLAST!", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3);

        textSize(FONT_SIZE);
        // Knipperende "PRESS ENTER" tekst
        if (frameCount % 60 < 30) { // Knippert elke seconde (30 frames aan, 30 frames uit)
            text("PRESS ENTER TO START", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        }
        text("PRESS C FOR CONTROLS", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + FONT_SIZE * 2);
        text("PRESS H FOR HIGH SCORES", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + FONT_SIZE * 4);

        if (lastScore > 0) {
            textSize(FONT_SIZE * 1.5);
            text(`LAST SCORE: ${nf(lastScore, 5)}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3 + FONT_SIZE * 3);
        }
    }

    drawGameOver(finalScore) {
        background(0, 0, 0, 200);
        fill(255, 0, 0);
        textAlign(CENTER, CENTER);
        textSize(FONT_SIZE * 3);
        // Knipperende "GAME OVER" tekst
        if (frameCount % 60 < 30) {
            text("GAME OVER", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3);
        }

        fill(255);
        textSize(FONT_SIZE * 2);
        text(`YOUR SCORE: ${nf(finalScore, 5)}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);

        textSize(FONT_SIZE);
        // Knipperende "PRESS ENTER" tekst
        if (frameCount % 60 < 30) {
            text("PRESS ENTER TO RESTART", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + FONT_SIZE * 3);
        }
        text("PRESS ESC TO MAIN MENU", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + FONT_SIZE * 4.5);
        
        this.saveHighScore(finalScore);
    }

    drawControls() {
        background(0);
        fill(255);
        textAlign(CENTER, CENTER);

        textSize(FONT_SIZE * 2);
        text("CONTROLS", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 3);

        textSize(FONT_SIZE);
        text("MOVE: ARROW KEYS / WASD", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
        text("SHOOT: SPACEBAR", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + FONT_SIZE * 2);
        text("PRESS ESC TO GO BACK", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + FONT_SIZE * 4);
    }

    drawHighScores() {
        background(0);
        fill(255);
        textAlign(CENTER, CENTER);

        textSize(FONT_SIZE * 2);
        text("HIGH SCORES", CANVAS_WIDTH / 2, CANVAS_HEIGHT / 4);

        textSize(FONT_SIZE);
        let yPos = CANVAS_HEIGHT / 4 + FONT_SIZE * 3;
        if (this.highScores.length === 0) {
            text("NO HIGH SCORES YET!", CANVAS_WIDTH / 2, yPos);
        } else {
            this.highScores.forEach((scoreObj, index) => {
                text(`${index + 1}. ${nf(scoreObj.score, 5)}`, CANVAS_WIDTH / 2, yPos + index * FONT_SIZE * 1.5);
            });
        }
        text("PRESS ESC TO GO BACK", CANVAS_WIDTH / 2, CANVAS_HEIGHT - FONT_SIZE * 2);
    }

    // High Score functionaliteit (gebruikt localStorage)
    saveHighScore(score) {
        if (score === 0) return; // Sla 0 scores niet op

        this.highScores.push({ score: score, date: new Date().toISOString() });
        this.highScores.sort((a, b) => b.score - a.score); // Sorteer aflopend
        this.highScores = this.highScores.slice(0, 5); // Houd top 5

        localStorage.setItem('pussieblaster_highscores', JSON.stringify(this.highScores));
    }

    loadHighScores() {
        const storedScores = localStorage.getItem('pussieblaster_highscores');
        return storedScores ? JSON.parse(storedScores) : [];
    }
}