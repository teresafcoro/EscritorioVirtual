class Crucigrama {
    constructor() {
        // Nivel fácil:
        this.board = "4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,-,.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=,20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,-,#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16";
        this.nivel = "fácil";
        // Nivel intermedio:
        // this.board = "12,*,.,=,36,#,#,#,15,#,#,*,#,/,#,#,#,*,.,-,.,=,.,#,55,#,.,*,#,=,#,=,#,/,#,=,.,#,15,#,9,*,.,=,45,=,#,#,#,#,#,=,#,#,72,#,20,-,.,=,11,#,.,#,#,-,#,+,#,#,#,*,56,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,12,#,16,*,.,=,32";
        // this.nivel = "intermedio";
        // Nivel difícil:
        // this.board = "4,.,.,=,36,#,#,#,25,#,#,*,#,.,#,#,#,.,.,-,.,=,.,#,15,#,.,*,#,=,#,=,#,.,#,=,.,#,18,#,6,*,.,=,30,=,#,#,#,#,#,=,#,#,56,#,9,-,.,=,3,#,.,#,#,*,#,+,#,#,#,*,20,.,.,=,18,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,18,#,24,.,.,=,72";
        // this.nivel = "difícil";
        this.cols = 9;
        this.rows = 11;
        this.init_time = null;
        this.end_time = null;
        this.boardArray = new Array(this.rows).fill(0).map(() => new Array(this.cols).fill(0));
        this.selectedCell = null;
        this.start();
    }
    start() {
        const boardValues = this.board.split(',');
        let index = 0;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                const char = boardValues[index];
                if (char === '#') {
                    this.boardArray[i][j] = -1;
                }
                else if (char === '.') {
                    this.boardArray[i][j] = 0;
                }
                else {
                    this.boardArray[i][j] = char;
                }
                index++;
            }
        }
    }
    paintMathword() {
        for (let i = 0; i < this.rows; i++) {
            const boardValues = this.boardArray[i];
            for (let j = 0; j < this.cols; j++) {
                const paragraph = $('<p>').attr({
                    'data-row': i,
                    'data-col': j
                });
                if (boardValues[j] === 0) {
                    paragraph.on('click', this.handleCellClick.bind(this));
                }
                else if (boardValues[j] === -1) {
                    paragraph.attr('data-state', 'empty');
                }
                else {
                    paragraph.text(boardValues[j]).attr('data-state', 'blocked');
                }
                $('main').append(paragraph);
            }
        }
        this.init_time = new Date();
    }
    handleCellClick(event) {
        const cell = $(event.target);
        cell.attr('data-state', 'clicked');
        this.selectedCell = cell;
    }
    check_win_condition() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.boardArray[i][j] === 0) {
                    return false;
                }
            }
        }
        return true;
    }
    calculate_date_difference() {
        if (!this.init_time || !this.end_time) {
            console.error('Init_time o End_time no están definidos correctamente.');
            return 'Tiempo no disponible';
        }
        const timeDifference = this.end_time - this.init_time;
        const seconds = Math.floor((timeDifference / 1000) % 60);
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        const hours = Math.floor((timeDifference / (1000 * 60 * 60)) % 24);
        return `${hours}:${minutes}:${seconds}`;
    }
    introduceElement(element) {
        let expression_row = true;
        let expression_col = true;
        const row = this.selectedCell.attr('data-row');
        const col = this.selectedCell.attr('data-col');
        this.boardArray[row][col] = element;
        expression_row = this.validateHorizontalExpression(row, col);
        expression_col = this.validateVerticalExpression(row, col);
        if (expression_row && expression_col) {
            this.selectedCell.text(element).attr('data-state', 'correct').off('click');
        } else {
            this.boardArray[row][col] = 0;
            this.selectedCell.text(0).attr('data-state', '');
            this.selectedCell = null;
            alert('El elemento introducido no es correcto para la casilla seleccionada.');
        }
        if (this.check_win_condition()) {
            this.end_time = new Date();
            const timeDifference = this.calculate_date_difference();
            alert(`Has completado el crucigrama en ${timeDifference}. ¡Enhorabuena!`);
            this.createRecordForm();
        }
    }
    validateHorizontalExpression(row, col) {
        let expression_row = true;
        if (col + 1 < this.cols && this.boardArray[row][col + 1] !== -1) {
            let nextCol = col + 1;
            while (nextCol < this.cols && this.boardArray[row][nextCol] !== '=') {
                nextCol++;
            }
            if (nextCol < this.cols) {
                const first_number = parseInt(this.boardArray[row][nextCol - 3]);
                const second_number = parseInt(this.boardArray[row][nextCol - 1]);
                const expression = this.boardArray[row][nextCol - 2];
                const result = parseInt(this.boardArray[row][nextCol + 1]);
                if (first_number !== 0 && second_number !== 0 && result !== 0) {
                    const mathExpression = [first_number, expression, second_number].join('');
                    const evalResult = eval(mathExpression);
                    if (evalResult !== result) {
                        expression_row = false;
                    }
                }
            }
        }
        return expression_row;
    }
    validateVerticalExpression(row, col) {
        let expression_col = true;
        if (row + 1 < this.rows && this.boardArray[row + 1][col] !== -1) {
            let nextRow = row + 1;
            while (nextRow < this.rows && this.boardArray[nextRow][col] !== '=') {
                nextRow++;
            }
            if (nextRow < this.rows) {
                const first_number = parseInt(this.boardArray[nextRow - 3][col]);
                const second_number = parseInt(this.boardArray[nextRow - 1][col]);
                const expression = this.boardArray[nextRow - 2][col];
                const result = parseInt(this.boardArray[nextRow + 1][col]);

                if (first_number !== 0 && second_number !== 0 && result !== 0) {
                    const mathExpression = [first_number, expression, second_number].join('');
                    const evalResult = eval(mathExpression);

                    if (evalResult !== result) {
                        expression_col = false;
                    }
                }
            }
        }
        return expression_col;
    }
    createRecordForm() {
        const section = $("<section>");
        const tituloForm = $("<h4>Registro de un nuevo record</h4>");
        section.append(tituloForm);
        var formulario = $("<form action='#' method='post'>");
        formulario.append('<label>Nombre de la persona:</label><input type="text" name="nombre" required />');
        formulario.append('<label>Apellidos:</label><input type="text" name="apellidos" required />');
        formulario.append('<label>Nivel:</label><input type="text" name="nivel" value="' + this.nivel + '" readonly />');
        formulario.append('<label>Tiempo empleado:</label><input type="text" name="tiempo" value="' + this.calculate_date_difference() + '" readonly />');
        formulario.append('<input type="submit" value="Enviar" />');
        formulario.on('submit', this.handleFormSubmit.bind(this));
        section.append(formulario);
        $('main').after(section);
    }
    handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        const formattedTime = this.init_time.getTime();
        formData.append('tiempo', formattedTime);
        fetch('crucigrama.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .catch(error => {
            console.error('Error al enviar el formulario:', error);
        });
    }
}