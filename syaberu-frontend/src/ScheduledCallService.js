class ScheduledCallService {
    getScheduledCalls(httpUrl, subscriptionId) {
        return fetch(`${httpUrl}/scheduled_calls/subscriptions/${subscriptionId}`)
            .then(res => res.json());
    }

    postScheduledCalls(httpUrl, params) {
        return fetch(`${httpUrl}/scheduled_calls`, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            return res.json();
        });
    }

    deleteScheduledCall(httpUrl, id) {
        return fetch(`${httpUrl}/scheduled_calls/${id}`, {
            method: 'DELETE'
        });
    }
}

export default new ScheduledCallService();