/**
 * General class for interfacing with the CT API.
 */
class APIHelper {
  /**
   * Sends GET request to the given endpoint,
   * parsing the response as JSON and returning it.
   * @param {String} endpoint API endpoint to request.
   */
  static fetchDataFromEndpoint(endpoint) {
    const baseURL = 'https://ct-tacoapi.azurewebsites.net';
    const urlToFetch = `${baseURL}/${endpoint}`;

    return fetch(urlToFetch, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json()
        .then((blob) => Promise.resolve(blob))
        .catch((error) => Promise.reject(error)))
      .catch((error) => Promise.reject(error));
  }
}

export default APIHelper;
