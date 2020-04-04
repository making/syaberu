import RSocketHandler from "./RSocketHandler";

document.addEventListener('DOMContentLoaded', () => {
    const start = document.getElementById('start');
    const url = document.getElementById('url');
    const subscriptionId = document.getElementById('subscriptionId');
    const params = new URLSearchParams(document.location.search);
    if (params.has('url')) {
        url.value = params.get('url');
        subscriptionId.value = params.get('subscriptionId');
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
});