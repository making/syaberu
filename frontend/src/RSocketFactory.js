import {RSocketClient} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client";

const routingMetadata = (route) => {
    return String.fromCharCode(route.length) + route;
};

export default class RSocketFactory {
    constructor({url, subscriptionId, responder}) {
        this.url = url;
        this.subscriptionId = subscriptionId;
        this.responder = responder;
        this._initClient();
        (async () => {
            try {
                this.rsocket = await this.getRSocket();
            } catch (error) {
                throw error;
            }
        })();
    }

    _initClient() {
        this.client = new RSocketClient({
            transport: new RSocketWebSocketClient({url: this.url}),
            setup: {
                payload: {
                    metadata: routingMetadata(`subscribe.${this.subscriptionId}`)
                },
                dataMimeType: 'application/json',
                metadataMimeType: 'message/x.rsocket.routing.v0',
                keepAlive: 10000,
                lifetime: 20000
            },
            responder: this.responder
        })
    }

    async getRSocket() {
        try {
            if (this.rsocket) {
                if (this.rsocket.availability() !== 0) {
                    return this.rsocket;
                }
                this.rsocket.close();
                this.client.close();
                this._initClient();
            }
            console.log('Connecting RSocket...');
            this.rsocket = await this.client.connect();
            console.log('Connected');
            return this.rsocket;
        } catch (error) {
            throw error;
        }
    }
}