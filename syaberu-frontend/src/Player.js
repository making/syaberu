class Player {

    constructor() {
        this.audio = new Audio();
    }

    playMp3(base64EncodedAudio) {
        this.audio.src = `data:audio/mp3;base64,${base64EncodedAudio}`;
        return this.audio.play();
    }
}

export default new Player();