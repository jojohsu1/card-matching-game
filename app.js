class AudioController {
    constructor() {
        this.flipSound = new Audio('./audio/flip.wav');
        this.matchSound = new Audio('./audio/match.wav');
        this.gameOverSound = new Audio('./audio/gameOver.wav');
        this.victorySound = new Audio('./audio/victory.wav');
    }
    flip() {
        this.flipSound.play();
    }
    match() {
        this.matchSound.play();
    }
    gameOver() {
        this.gameOverSound.play();
    }
    victory() {
        this.victorySound.play();
    }
}

class MixOrMatch {
    constructor(totalTime, cards) {
        this.totalTime = totalTime;
        this.cardsArray = cards;
        this.timeRemaining = this.totalTime;
        this.timer = document.getElementById('time-remaining');
        this.ticker = document.getElementById('flips');
        this.audioController = new AudioController();
    }

    startGame() {
        this.totalClicks = 0;
        this.cardToCheck = null;
        this.matchedCards = [];
        this.timeRemaining = this.totalTime;
        this.busy = true;

        setTimeout(_ => {
            this.countDown = this.startCountDown();
            this.shuffleCards();
            this.busy = false;
        }, 500);
        this.timer.innerText = this.timeRemaining;
        this.ticker.innerText = this.totalClicks;
        this.hideCards();
    }

    hideCards() {
        this.cardsArray.forEach(card => {
            card.classList.remove('visible');
            card.classList.remove('matched');
        })
    }

    flipCard(card) {
        if (this.canFlipCard(card)) {
            this.audioController.flip();
            this.totalClicks++;
            this.ticker.innerText = this.totalClicks;
            card.classList.add('visible');

            if (this.cardToCheck)
                this.checkForCardMatch(card);
            else
                this.cardToCheck = card;
        }
    }

    checkForCardMatch(card) {
        if (this.getCardType(card) === this.getCardType(this.cardToCheck))
            this.cardMatch(card, this.cardToCheck);
        else
            this.cardMisMatch(card, this.cardToCheck);

        this.cardToCheck = null;
    }
    cardMatch(card1, card2) {
        this.matchedCards.push(card1);
        this.matchedCards.push(card2);
        card1.classList.add('matched');
        card2.classList.add('matched');
        this.audioController.match();
        if (this.matchedCards.length === this.cardsArray.length)
            this.victoryGame();
    }
    cardMisMatch(card1, card2) {
        this.busy = true;
        setTimeout(_ => {
            card1.classList.remove('visible');
            card2.classList.remove('visible');
            this.busy = false;
        }, 800);

    }

    getCardType(card) {
        const cardSource = card.querySelector('.card-value');
        return cardSource.src;
    }

    startCountDown() {
        return setInterval(_ => {
            this.timeRemaining--;
            this.timer.innerText = this.timeRemaining;
            if (this.timeRemaining === 0) {
                this.gameOver();
            }
        }, 1000);
    }

    gameOver() {
        const gameOverText = document.getElementById('game-over-text');
        clearInterval(this.countDown);
        this.audioController.gameOver();
        gameOverText.classList.add('visible');
    }

    victoryGame() {
        const victoryText = document.getElementById('victory-text');
        clearInterval(this.countDown);
        this.audioController.victory();
        victoryText.classList.add('visible');
    }

    shuffleCards() {
        for (let i = this.cardsArray.length - 1; i > 0; i--) {
            let randomIndex = Math.floor(Math.random() * (i));
            this.cardsArray[randomIndex].style.order = i;
            this.cardsArray[i].style.order = randomIndex;
        }
    }

    canFlipCard(card) {
        return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck);
    }
}

const ready = _ => {
    let overlays = Array.from(document.querySelectorAll('.overlay-text'));
    let cards = Array.from(document.querySelectorAll('.card'));
    let game = new MixOrMatch(100, cards);

    overlays.forEach(overlay => {
        overlay.addEventListener('click', _ => {
            overlay.classList.remove('visible');
            game.startGame();
        })
    })
    cards.forEach(card => {
        card.addEventListener('click', _ => {
            card.classList.add('visible');
            game.flipCard(card);
        })
    })
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready())
} else {
    ready();
}