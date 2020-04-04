import RsocketFactory from './RSocketFactory';
import {Single} from 'rsocket-flowable';
import syaberuInvoker from './SyaberuInvoker';
import player from "./Player";

export default class RSocketHandler {
    constructor({
                    url,
                    subscriptionId,
                    handleOnConnected,
                    handleOnClosed,
                    handleOnReconnecting,
                    handleBeforeInvoke,
                    handleAfterInvoke
                }) {
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
        this.handleBeforeInvoke = handleBeforeInvoke;
        this.handleAfterInvoke = handleAfterInvoke;
    }

    async requestResponse(payload) {
        const message = JSON.parse(payload.data);
        message.url = 'syaberu.mp3';
        this.handleBeforeInvoke();
        syaberuInvoker.invoke(message)
            .then(txt => player.playMp3(txt))
            .finally(() => this.handleAfterInvoke());
        return Single.of({data: 'WEB'});
    }
}