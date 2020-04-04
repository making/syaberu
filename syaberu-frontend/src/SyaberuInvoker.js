class SyaberuInvoker {
    invoke({url, apiKey, text, speaker, emotion}) {
        const params = new URLSearchParams();
        if (text) {
            params.set('text', text);
        }
        if (speaker) {
            params.set('speaker', speaker);
        }
        if (emotion) {
            params.set('emotion', emotion);
        }
        return fetch(url, {
            method: 'POST',
            body: params.toString(),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Api-Key': apiKey
            }
        })
            .then(x => x.text())
            .catch(e => alert(e.toString()));
    }
}

export default new SyaberuInvoker();