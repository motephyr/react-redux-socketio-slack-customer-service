function status(response) {
    if (response.status >= 200 && response.status < 300) {
        return Promise.resolve(response)
    } else {
        return response.json().then((reason) => {
            return Promise.reject(new Error(reason.error));
        });
    }
}

function json(response) {
    return response.json()
}

module.exports = function(endpoint, params) {
    return fetch(endpoint, params).then(status).then(json);
}
