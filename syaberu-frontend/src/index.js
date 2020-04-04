import RSocketHandler from "./RSocketHandler";
import syaberuInvoker from "./SyaberuInvoker";

document.addEventListener('DOMContentLoaded', () => {
    const start = document.getElementById('start');
    const send = document.getElementById('send');
    const url = document.getElementById('url');
    const subscriptionId = document.getElementById('subscriptionId');
    const text = document.getElementById('text');
    const speaker = document.getElementById('speaker');
    const emotion = document.getElementById('emotion');
    const apiKey = document.getElementById('apiKey');

    const params = new URLSearchParams(document.location.search);

    if (params.has('url')) {
        url.value = params.get('url');
    }
    if (params.has('subscriptionId')) {
        subscriptionId.value = params.get('subscriptionId');
    }
    if (params.has('text')) {
        text.value = params.get('text');
    }
    if (params.has('speaker')) {
        speaker.value = params.get('speaker');
    }
    if (params.has('emotion')) {
        emotion.value = params.get('emotion');
    }
    if (params.has('apiKey')) {
        apiKey.value = params.get('apiKey');
    }

    start.addEventListener('click', e => {
        start.innerText = 'Connecting...';
        start.disabled = true;
        new RSocketHandler({
            url: url.value,
            subscriptionId: subscriptionId.value,
            handleOnConnected: () => {
                start.innerText = 'Connected.';
            },
            handleOnClosed: () => {
                start.innerText = 'Connection closed.';
            },
            handleOnReconnecting: () => {
                start.innerText = 'Reconnecting...';
            }
        });
    });

    send.addEventListener('click', e => {
        if (!text.value || text.value === '') {
            alert('"Text" is empty!');
            return;
        }
        if (!speaker.value || speaker.value === '') {
            alert('"Speaker" is empty!');
            return;
        }
        if (!apiKey.value || apiKey.value === '') {
            alert('"ApiKey" is empty!');
            return;
        }
        const params = {
            url: url.value
                .replace(/^ws/, 'http')
                .replace(/\/rsocket$/, `/proxy/${subscriptionId.value}`),
            text: text.value,
            speaker: speaker.value,
            emotion: emotion.value,
            apiKey: apiKey.value
        };
        syaberuInvoker.invoke(params);
    });
});