class Memoria {
    constructor() {
        this.elements = [
            { element: "HTML5", source: "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg" },
            { element: "HTML5", source: "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg" },
            { element: "CSS3", source: "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg" },
            { element: "CSS3", source: "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg" },
            { element: 'JS', source: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg' },
            { element: 'JS', source: 'https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg' },
            { element: 'PHP', source: 'https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg' },
            { element: 'PHP', source: 'https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg' },
            { element: 'SVG', source: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg' },
            { element: 'SVG', source: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg' },
            { element: 'W3C', source: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg' },
            { element: 'W3C', source: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg' },
        ];
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
        this.shuffleElements();
        this.createElements();
        this.addEventListeners();
    }
    shuffleElements() {
        for (let i = this.elements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
    }
    unflipCards() {
        this.lockBoard = true;
        setTimeout(() => {
            this.firstCard.dataset.state = 'flip';
            this.secondCard.dataset.state = 'flip';
            this.firstCard.dataset.flipped = 'false';
            this.secondCard.dataset.flipped = 'false';
            setTimeout(() => {
                this.resetBoard();
            }, 1000);
        }, 1000);
    }
    resetBoard() {
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlippedCard = false;
        this.lockBoard = false;
    }
    checkForMatch() {
        const isMatch = this.firstCard.dataset.element === this.secondCard.dataset.element;
        isMatch ? this.disableCards() : this.unflipCards();
    }
    disableCards() {
        this.firstCard.dataset.state = 'revealed';
        this.secondCard.dataset.state = 'revealed';
        this.resetBoard();
    }
    createCardElement(card) {
        const cardElement = document.createElement('article');
        cardElement.dataset.element = card.element;
        const h3Element = document.createElement('h3');
        h3Element.textContent = 'Tarjeta de Memoria';
        const imgElement = document.createElement('img');
        imgElement.src = card.source;
        imgElement.alt = card.element;
        cardElement.appendChild(h3Element);
        cardElement.appendChild(imgElement);
        return cardElement;
    }
    createElements() {
        const gameContainer = document.querySelector('section:nth-of-type(2)');
        this.elements.forEach(element => {
            const cardElement = this.createCardElement(element);
            gameContainer.appendChild(cardElement);
        });
    }
    addEventListeners() {
        const cards = document.querySelectorAll('article');
        cards.forEach(card => {
            card.addEventListener('click', this.flipCard.bind(card, this));
        });
    }
    flipCard(game) {
        if (this.dataset.state === 'revealed') return;
        if (game.lockBoard) return;
        if (this === game.firstCard) return;

        this.dataset.flipped = 'true';
        this.dataset.state = 'flip';

        if (!game.hasFlippedCard) {
            game.hasFlippedCard = true;
            game.firstCard = this;
        } else {
            game.secondCard = this;
            game.checkForMatch();
        }
    }
}