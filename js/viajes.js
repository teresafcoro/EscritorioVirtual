class Viajes {
    constructor() {
        this.apiKey = "key=AIzaSyBVLkjIOBgAfTCtVVzdSeLLRyXfu_bvK7E"; // Google Maps API Key
        this.latitud = 0;
        this.longitud = 0;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
        } else {
            console.error('Tu navegador no soporta la geolocalización');
        }
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            console.log("El navegador soporta el API File.");
        } else {
            console.error("El navegador no soporta el API File.");
        }
    }
    getPosicion(posicion) {
        this.longitud = posicion.coords.longitude;
        this.latitud = posicion.coords.latitude;
    }
    verErrores(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                console.error("No se han dado permisos de geolocalización");
                break;
            case error.POSITION_UNAVAILABLE:
                console.error("Información de geolocalización no disponible");
                break;
            case error.TIMEOUT:
                console.error("La petición de geolocalización ha caducado");
                break;
            case error.UNKNOWN_ERROR:
                console.error("Se ha producido un error desconocido");
                break;
        }
    }
    cargarMapaEstatico() {
        const url = "https://maps.googleapis.com/maps/api/staticmap?";
        const centro = "center=" + this.latitud + "," + this.longitud;
        const zoom = "&zoom=15";
        const tam = "&size=800x600";
        const marcador = "&markers=color:red%7Clabel:Y%7C" + this.latitud + "," + this.longitud;
        const sensor = "&sensor=false";
        const mapa = url + centro + zoom + tam + marcador + sensor + "&" + this.apiKey;
        $('#mapaEstatico').html("<img src=\"" + mapa + "\" alt=\"Mapa estático\" />");
    }
    cargarMapaDinamico() {
        const url = "https://maps.googleapis.com/maps/api/js?" + this.apiKey + "&callback=viajes.initMap";
        $('#mapaDinamico').html("<script async defer src=\"" + url + "\"></script>");
    }
    initMap() {
        const centro = { lat: this.latitud, lng: this.longitud };
        // Se requiere el id para insertar el mapa dinámico
        const mapa = new google.maps.Map(document.getElementById('mapaDinamico'), {
            zoom: 15,
            center: centro
        });
        const marker = new google.maps.Marker({
            position: centro,
            map: mapa
        });
    }
    procesarXML(fileInput) {
        if (fileInput && fileInput.name.toLowerCase().endsWith('.xml')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const articleElement = $('<article>');
                const pElement = $('<p>');
                pElement.text(reader.result);
                articleElement.html(pElement);
                $('input[name="fileXML"]').after(articleElement);
            };
            reader.readAsText(fileInput);
        } else {
            console.error("Se espera un objeto de tipo XML.");
        }
    }
    procesarKML(files) {
        // Se requiere el id para insertar el mapa dinámico
        const map = new google.maps.Map(document.getElementById('mapaKML'), {
            zoom: 15,
            center: { lat: 18.50012, lng: -69.98857 }
        });

        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file && file.name.toLowerCase().endsWith('.kml')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const kmlContent = e.target.result;
                    const kmlLayer = new google.maps.KmlLayer({
                        map: map,
                        url: 'data:application/vnd.google-earth.kml+xml;base64,' + btoa(kmlContent)
                    });
                };
                reader.readAsText(file);
            } else {
                console.error("Se espera objetos de tipo KML.");
            }
        }
    }
    procesarSVG(files) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file && file.name.toLowerCase().endsWith('.svg')) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const svgContent = e.target.result;
                    const articleElement = $('<article>');
                    articleElement.html(svgContent);
                    $('input[name="filesSVG"]').after(articleElement);
                };
                reader.readAsText(file);
            } else {
                console.error("Se espera objetos de tipo SVG.");
            }
        }
    }
}