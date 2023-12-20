class Agenda {
    constructor(apiUrl) {
        this.apiUrl = apiUrl;
        this.last_api_call = null;
        this.last_api_result = null;
        this.apiCallInterval = 10 * 60 * 1000;
    }
    getCarrerasF1() {
        const currentTime = new Date();
        if (this.last_api_call === null || (currentTime - this.last_api_call) > this.apiCallInterval) {
            this.last_api_call = currentTime;
            const self = this;
            $.ajax({
                url: this.apiUrl,
                method: 'GET',
                dataType: 'xml',
                success: function (data) {
                    self.last_api_result = data;
                    self.getCarrerasF1DelXML();
                },
                error: function (error) {
                    console.error('Error en la petición a la API:', error);
                }
            });
        } else {
            this.getCarrerasF1DelXML();
        }
    }
    getCarrerasF1DelXML() {
        const races = $(this.last_api_result).find('Race');
        races.each(function () {
            const raceName = $(this).find('RaceName').text();
            const circuitName = $(this).find('CircuitName').text();
            const lat = $(this).find('Location').attr('lat');
            const long = $(this).find('Location').attr('long');
            const locality = $(this).find('Locality').text();
            const country = $(this).find('Country').text();
            const raceDate = $(this).find('Date').first().text();
            const raceTime = $(this).find('Time').first().text();

            const raceElement = $('<section>');
            raceElement.append(`<h4>Carrera: ${raceName}</h4>`);
            raceElement.append(`<p>Circuito: ${circuitName}</p>`);
            raceElement.append(`<p>Coordenadas: Latitud ${lat}, Longitud ${long}</p>`);
            raceElement.append(`<p>Ubicación: ${locality}, ${country}</p>`);
            raceElement.append(`<p>Fecha y Hora: ${raceDate}, ${raceTime}</p>`);
            $('input:last').after(raceElement);
        });
    }
}