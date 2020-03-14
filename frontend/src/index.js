import App from "./App";

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
        const app = new App({
            url: url.value,
            subscriptionId: subscriptionId.value
        });
        start.disabled = true;
        start.innerText = 'Started';
    });
});