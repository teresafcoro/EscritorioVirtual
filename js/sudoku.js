class Sudoku {
    constructor() {
        this.boardString = "3.4.69.5....27...49.2..4....2..85.198.9...2.551.39..6....8..5.32...46....4.75.9.6";
        // this.boardString = "23.94.67.8..3259149..76.32.1.....7925.321.4864..68.5317..1....96598721433...9...7";
        // this.boardString = "8.4.71.9.976.3....5.196....3.7495...692183...4.5726..92483591..169847...753612984";
        this.rows = 9;
        this.cols = 9;
        this.board = Array.from({ length: this.rows }, () => Array(this.cols).fill(0));
        this.selectedCell = null;
        this.start();
    }
    start() {
        let index = 0;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const char = this.boardString.charAt(index);
                if (char !== '.') {
                    this.board[i][j] = parseInt(char);
                }
                index++;
            }
        }
    }
    createStructure() {
        const mainElement = document.querySelector('main');
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const paragraph = document.createElement('p');
                paragraph.setAttribute('data-row', i);
                paragraph.setAttribute('data-col', j);
                mainElement.appendChild(paragraph);
            }
        }
    }
    paintSudoku() {
        this.createStructure();
        let index = 0;
        const paragraphs = document.querySelectorAll('main p');
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const paragraph = paragraphs[index];
                if (this.board[i][j] !== 0) {
                    paragraph.textContent = this.board[i][j];
                    paragraph.setAttribute('data-state', 'blocked');
                } else {
                    paragraph.addEventListener('click', this.handleCellClick.bind(this));
                }
                index++;
            }
        }
    }
    handleCellClick(event) {
        const cell = event.target;
        cell.dataset.state = 'clicked';
        this.selectedCell = cell;
    }
    introduceNumber(number) {
        const row = this.selectedCell.dataset.row;
        const col = this.selectedCell.dataset.col;
        if (this.isNumberValidInRow(row, number) &&
            this.isNumberValidInColumn(col, number) &&
            this.isNumberValidInSubgrid(row, col, number)) {
            this.board[row][col] = number;
            this.selectedCell.textContent = number;
            this.selectedCell.removeEventListener('click', this.handleCellClick.bind(this));
            this.selectedCell.setAttribute('data-state', 'correct');
            if (this.isSudokuComplete()) {
                alert('¡Sudoku completado!');
            }
        } else {
            alert('Número no válido para esta casilla. Por favor, elija otro número.');
        }
    }
    isNumberValidInRow(row, number) {
        return !this.board[row].includes(number);
    }
    isNumberValidInColumn(col, number) {
        const columnValues = this.board.map(row => row[col]);
        return !columnValues.includes(number);
    }
    isNumberValidInSubgrid(row, col, number) {
        const subgridRow = Math.floor(row / 3) * 3;
        const subgridCol = Math.floor(col / 3) * 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[subgridRow + i][subgridCol + j] === number) {
                    return false;
                }
            }
        }
        return true;
    }
    isSudokuComplete() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.board[i][j] === 0) {
                    return false;
                }
            }
        }
        return true;
    }
}