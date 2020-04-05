import RSocketHandler from "./RSocketHandler";
import syaberuInvoker from "./SyaberuInvoker";
import scheduledCallService from "./ScheduledCallService";

const now = (plusMills) => {
    const now = new Date(new Date().getTime() + (plusMills || 0));
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    return year + '-' +
        (month < 10 ? '0' + month.toString() : month) + '-' +
        (day < 10 ? '0' + day.toString() : day) + 'T' +
        (hour < 10 ? '0' + hour.toString() : hour) + ':' +
        (minute < 10 ? '0' + minute.toString() : minute) +
        ':00';
};

document.addEventListener('DOMContentLoaded', () => {
    const start = document.getElementById('start');
    const send = document.getElementById('send');
    const schedule = document.getElementById('schedule');
    const url = document.getElementById('url');
    const subscriptionId = document.getElementById('subscriptionId');
    const text = document.getElementById('text');
    const speaker = document.getElementById('speaker');
    const emotion = document.getElementById('emotion');
    const apiKey = document.getElementById('apiKey');
    const scheduledCalls = document.getElementById('scheduledCalls');
    const scheduledAt = document.getElementById('scheduledAt');
    scheduledAt.value = now(5 * 60 * 1000);

    const params = new URLSearchParams(document.location.search);

    const httpUrl = () => url.value
        .replace(/^ws/, 'http')
        .replace(/\/rsocket$/, '');

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

    const loadScheduledCalls = () => {
        if (!url.value || url.value === '') {
            return;
        }
        if (!subscriptionId.value || subscriptionId.value === '') {
            return;
        }
        scheduledCallService.getScheduledCalls(httpUrl(), subscriptionId.value)
            .then(data => data.map(call => {
                let alert;
                switch (call.state) {
                    case 'SUCCEEDED': {
                        alert = 'success';
                        break;
                    }
                    case 'FAILED': {
                        alert = 'error';
                        break;
                    }
                    default: {
                        alert = 'info';
                        break;
                    }
                }
                return `<tr><td>${call.scheduledAt}</td><td>${call.text}</td><td>${call.speaker}</td><td>${call.emotion || ''}</td><td><span class="pui-alert pui-alert-${alert}">${call.state}</span></td></tr>`
            }).join(''))
            .then(html => scheduledCalls.innerHTML = html);
    };

    loadScheduledCalls();
    setInterval(loadScheduledCalls, 60000);

    start.addEventListener('click', e => {
        if (!url.value || url.value === '') {
            alert('"URL" is empty!');
            return;
        }
        if (!subscriptionId.value || subscriptionId.value === '') {
            alert('"SubscriptionId" is empty!');
            return;
        }

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
        loadScheduledCalls();
    });

    const doInvoke = () => {
        if (!url.value || url.value === '') {
            alert('"URL" is empty!');
            return;
        }
        if (!subscriptionId.value || subscriptionId.value === '') {
            alert('"SubscriptionId" is empty!');
            return;
        }
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
            url: `${httpUrl()}/proxy/${subscriptionId.value}`,
            text: text.value,
            speaker: speaker.value,
            emotion: emotion.value,
            apiKey: apiKey.value
        };
        send.innerText = 'Sending ...';
        send.disabled = true;
        text.disabled = true;
        syaberuInvoker.invoke(params)
            .finally(() => {
                send.disabled = false;
                send.innerText = 'Send';
                text.disabled = false;
            });
    };

    send.addEventListener('click', doInvoke);
    text.addEventListener('keypress', e => {
        if (e.key === 'Enter') {
            doInvoke();
        }
    });
    schedule.addEventListener('click', () => {
        if (!url.value || url.value === '') {
            alert('"URL" is empty!');
            return;
        }
        if (!subscriptionId.value || subscriptionId.value === '') {
            alert('"SubscriptionId" is empty!');
            return;
        }
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
        if (!scheduledAt.value || scheduledAt.value === '') {
            alert('"ScheduledAt" is empty!');
            return;
        }
        const params = {
            subscriptionId: subscriptionId.value,
            text: text.value,
            speaker: speaker.value,
            emotion: emotion.value,
            apiKey: apiKey.value,
            scheduledAt: new Date(scheduledAt.value).getTime()
        };
        scheduledAt.disabled = true;
        schedule.disabed = true;
        schedule.innerText = 'Scheduling...';
        scheduledCallService.postScheduledCalls(httpUrl(), params)
            .then(json => {
                if (json.error) {
                    throw json;
                }
            })
            .then(loadScheduledCalls)
            .catch(e => {
                alert(JSON.stringify(e.details.map(x => x.defaultMessage)));
            })
            .finally(() => {
                schedule.disabed = false;
                scheduledAt.disabled = false;
                schedule.innerText = 'Schedule';
            });
    });
});