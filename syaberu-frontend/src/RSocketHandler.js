import RsocketFactory from './RSocketFactory';
import {Single} from 'rsocket-flowable';
import player from './Player';

export default class RSocketHandler {
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
            .then(txt => player.playMp3(txt))
            .catch(e => alert(e.toString()));
        return Single.of({data: 'WEB'});
    }
}