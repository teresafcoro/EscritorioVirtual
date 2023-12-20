class País {
    constructor(nombre, capital, poblacion) {
        this.nombre = nombre;
        this.capital = capital;
        this.poblacion = poblacion;
        this.formaDeGobierno = '';
        this.coordenadasCapital = {};
        this.religionMayoritaria = '';
    }
    // Método para rellenar el valor del resto de atributos
    setInformacionCompleta(formaDeGobierno, coordenadasCapital, religionMayoritaria) {
        this.formaDeGobierno = formaDeGobierno;
        this.coordenadasCapital = coordenadasCapital;
        this.religionMayoritaria = religionMayoritaria;
    }
    // Métodos que devuelven información principal en forma de cadena de texto
    getNombre() {
        return this.nombre;
    }
    getCapital() {
        return this.capital;
    }
    // Método que devuelve información secundaria en forma de lista HTML5
    getInformacionSecundariaHTML() {
        return '<ul><li>Población: ' + this.poblacion + ' habitantes</li><li>Forma de Gobierno: ' + this.formaDeGobierno + '</li><li>Religión Mayoritaria: ' + this.religionMayoritaria + '</li></ul>';
    }
    // Método para escribir en el documento HTML la información de coordenadas de la capital
    escribirCoordenadasEnHTML() {
        document.write('<p>Coordenadas de Santo Domingo: Latitud ' + this.coordenadasCapital.latitud + ' y Longitud ' + this.coordenadasCapital.longitud + '.</p>');
    }
    consultaMeteorologia() {
        $.ajax({
            url: 'https://api.openweathermap.org/data/2.5/forecast',
            method: 'GET',
            dataType: 'json',
            data: {
                q: `${this.capital}, ${this.nombre}`,
                appid: '9bf2b95ab24b1a479a41561c9d7dd6ce',
                units: 'metric'
            },
            success: function (response) {
                const pronostico = response.list;
                for (let i = 0; i < pronostico.length; i += 8) {
                    const dia = pronostico[i];
                    const fecha = new Date(dia.dt * 1000);
                    const elementoDia = $('<section>');
                    elementoDia.html(`
                        <h4>${fecha.toDateString()}</h4>
                        <p>Temperatura Máxima: ${dia.main.temp_max}°C</p>
                        <p>Temperatura Mínima: ${dia.main.temp_min}°C</p>
                        <p>Humedad: ${dia.main.humidity}%</p>
                        <p>Cantidad de Lluvia: ${dia.rain ? dia.rain['3h'] : 0} mm</p>
                    `);
                    const iconoTiempo = $('<img>');
                    iconoTiempo.attr({
                        'src': `https://openweathermap.org/img/w/${dia.weather[0].icon}.png`,
                        'alt': dia.weather[0].description
                    });
                    elementoDia.append(iconoTiempo);
                    $('article').append(elementoDia);
                }
            }, error: function (error) {
                console.error('Error en la llamada AJAX:', error);
            }
        });
    }
}