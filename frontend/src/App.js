import RsocketFactory from './RSocketFactory';
import {Single} from 'rsocket-flowable';

const routingMetadata = (route) => {
    return String.fromCharCode(route.length) + route;
};

export default class App {
    constructor({url, subscriptionId, handleOnConnected, handleOnClosed, handleOnReconnecting}) {
        new RsocketFactory({
            url: url,
            subscriptionId: subscriptionId,
            responder: {
                requestResponse: this.requestResponse.bind(this)
            },
            handleOnConnected: handleOnConnected,
            handleOnClosed: handleOnClosed,
            handleOnReconnecting: handleOnReconnecting
        });
        this.audio = new Audio();
    }

    requestResponse(payload) {
        const message = JSON.parse(payload.data);
        const params = new URLSearchParams();
        if (message.text) {
            params.set('text', message.text);
        }
        if (message.speaker) {
            params.set('speaker', message.speaker);
        }
        if (message.emotion) {
            params.set('emotion', message.emotion);
        }
        fetch('syaberu.mp3', {
            method: 'POST',
            body: params.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Api-Key': message.apiKey
            }
        })
            .then(x => x.text())
            .then(txt => this.audio.src = `data:audio/mp3;base64,${txt}`)
            .then(() => this.audio.play())
            .catch(e => alert(e.toString()));
        return Single.of({data: 'WEB'});
    }
}