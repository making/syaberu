import {RSocketClient} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client";

const routingMetadata = (route) => {
    return String.fromCharCode(route.length) + route;
};

export default class RSocketFactory {
    constructor({url, subscriptionId, responder, handleOnConnected, handleOnClosed, handleOnReconnecting}) {
        this.url = url;
        this.subscriptionId = subscriptionId;
        this.responder = responder;
        this.handleOnConnected = handleOnConnected;
        this.handleOnClosed = handleOnClosed;
        this.handleOnReconnecting = handleOnReconnecting;
        this._initClient();
        const connect = (async () => {
            try {
                this.rsocket = await this.getRSocket();
            } catch (error) {
                throw error;
            }
        });
        connect();
        // Auto Reconnect
        setInterval(() => {
            if (this.rsocket) {
                const availability = this.rsocket.availability();
                if (availability === 0) {
                    console.log('Reconnecting...');
                    this.handleOnReconnecting();
                    connect();
                }
            }
        }, 1000);
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
                keepAlive: 1000,
                lifetime: 3000
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
            if (!this.rsocket) {
                console.log('Connecting RSocket...');
            }
            this.rsocket = await this.client.connect();
            console.log('Connected');
            this.handleOnConnected();
            return this.rsocket;
        } catch (error) {
            this.handleOnClosed();
            throw error;
        }
    }
}