/* 
  GLOBALS RAVELRYAPI -------------------------------------------------------------------------------------------------
*/

export class RavelryApi {
    constructor(base, authUsername, authPassword) {
        this.base = base
        this.authUsername = authUsername
        this.authPassword = authPassword
        this.debugFunction = null
    }

    async get(url) {
        const headers = new Headers()
        const debugFunction = this.debugFunction
        // This is the HTTP header that you need add in order to access api.ravelry.com with a read only API key
        // `btoa` will base 64 encode a string: https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
      
        headers.append('Authorization', 'Basic ' + btoa(this.authUsername + ":" + this.authPassword))
      
        return fetch(url, { method: 'GET', headers: headers }).then(function (response) {
          return response.json()
        }).then(function (json) {
          if (debugFunction) debugFunction(json)
          return json
        }).catch(function (e) {
          document.getElementById('no-results').style.display = 'flex'
        }); 
    }

    // Retrieve a list of projects for a user: https://www.ravelry.com/api#projects_list
    // Pagination is optional, default is no pagination
    async projectsList(username, page) {
        const pageSize = 25;
        const url = this.base + '/projects/' + username + '/list.json?page=' + page + '&page_size=' + pageSize;
        return this.get(url);
    }
}