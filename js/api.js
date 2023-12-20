class API {
    constructor() {
    }
    load() {
        this.archivo = document.querySelector("input").files;
        if (this.archivo.length > 0) {
            this.archivo = this.archivo[0];
            if (this.archivo.type.match(/video\/mp4$/)) {
                const video = document.createElement("video");
                video.src = URL.createObjectURL(this.archivo);
                video.controls = true;
                video.preload = 'auto';
                document.body.appendChild(video);
            }
            else {
                console.error('Imposible leer archivo, formato no permitido.');
            }
        } else {
            console.error('Seleccione un archivo de vídeo.');
        }
    }
    loadFullScreen() {
        const video = document.querySelector("video");
        if (!document.fullscreenElement && !document.webkitFullscreenElement) {
            if (video.requestFullscreen) {
                video.requestFullscreen();
            } else if (video.webkitRequestFullscreen) {
                video.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    }
    loadSubtitles() {
        const video = document.querySelector("video");
        const track = video.addTextTrack("captions", "English", "en");
        track.mode = "showing";
        track.addCue(new VTTCue(0, 2, "Welcome to the rusting Replit course."));
        track.addCue(new VTTCue(3, 4, "This course will introduce you to the Rust programming language."));
        track.addCue(new VTTCue(5, 10, "With it in the description there are links to various materials used and mentioned in this course."));
        track.addCue(new VTTCue(11, 18, "Specifically, there is a one click link to the interactive course powered by rapid which allows you to learn Rust completely within your browser."));
        track.addCue(new VTTCue(19, 23, "There is also a link to the slides mentioned, which can be used as a cheat sheet to us."));
        track.addCue(new VTTCue(24, 31, "Finally, there is a link to an article written by yours truly, which walks through Rust and the interactive projects."));
    }
}