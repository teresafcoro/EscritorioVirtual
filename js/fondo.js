class Fondo {
    constructor(nombre, capital, coordenadasCapital) {
        this.nombre = nombre;
        this.capital = capital;
        this.coordenadasCapital = coordenadasCapital;
    }
    obtenerImagenFlickr() {
        const flickrApiUrl = 'https://api.flickr.com/services/rest/';
        const flickrApiParams = {
          // flickr.photos.getWithGeoData requiere autenticación por lo que emplee el siguiente método:
          method: 'flickr.photos.search', // no requiere autenticación
          api_key: 'c30a3964da6dd7d0ee0551917aae4026',
          format: 'json',
          tags: this.capital + ' ' + this.nombre,
          lat: this.coordenadasCapital[0],
          lon: this.coordenadasCapital[1],
          nojsoncallback: 1
        };
        $.ajax({
            url: flickrApiUrl,
            data: flickrApiParams,
            dataType: 'json',
            success: function(data) {
                if (data.photos && data.photos.photo.length > 0) {
                    const photo = data.photos.photo[0];
                    const imageUrl = `https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}.jpg`;
                    $('body').css({
                        'background-image': `url(${imageUrl})`,
                        'background-size': 'cover'
                    });
                } else {
                    console.log('No se encontraron imágenes para la capital: ', this.nombreCapital);
                }
            },
            error: function(error) {
                console.error('Error al realizar la consulta a la API de Flickr: ', error);
            }
        });
    }
}