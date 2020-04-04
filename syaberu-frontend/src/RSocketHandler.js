import RsocketFactory from './RSocketFactory';
import {Single} from 'rsocket-flowable';
import syaberuInvoker from './SyaberuInvoker';
import player from "./Player";

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
        message.url = 'syaberu.mp3';
        syaberuInvoker.invoke(message)
            .then(txt => player.playMp3(txt));
        return Single.of({data: 'WEB'});
    }
}