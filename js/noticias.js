class Noticias {
    constructor() {
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            console.log("El navegador soporta el API File.");
        } else {
            console.error("El navegador no soporta el API File.");
        }
    }
    readInputFile(fileInput) {
        if (fileInput instanceof File) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const content = e.target.result;
                content.split('\n').forEach((line) => {
                    const [titular, entradilla, texto, autor] = line.split('_');
                    this.showNews(titular, entradilla, texto, autor);
                });
            }.bind(this); // Para mantener el contexto de 'this'
            reader.readAsText(fileInput);
        } else {
            console.error("Se espera un objeto de tipo File.");
        }
    }
    showNews(titular, entradilla, texto, autor) {
        const noticiaElemento = $('<section>');
        noticiaElemento.append($('<h3>').text(titular));
        noticiaElemento.append($('<p>').html('Autor: ' + autor));
        noticiaElemento.append($('<p>').html('Entradilla: ' + entradilla));
        noticiaElemento.append($('<p>').text(texto));
        $('h2:last').before(noticiaElemento);
    }
    addNews() {
        const titular = $('input[name=titular]').val();
        const entradilla = $('input[name=entradilla]').val();
        const texto = $('textarea[name=texto]').val();
        const autor = $('input[name=autor]').val();
        if (titular && entradilla && texto && autor) {
            $('input[name=titular]').val('');
            $('input[name=entradilla]').val('');
            $('textarea[name=texto]').val('');
            $('input[name=autor]').val('');
            this.showNews(titular, entradilla, texto, autor);
        } else {
            console.error("Por favor, complete todos los campos del formulario.");
        }
    }
}