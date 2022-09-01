export class HttpService {
  get(url) {
    return fetch(url)
      .then(this._handleErrors)
      .then((response) => response.json())
  }

  post(url, dado) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dado),
    }).then(this._handleErrors)
  }

  _handleErrors(response) {
    if (!response.ok) throw new Error(response.statusText)
    return response
  }
}
