/* globals RavelryApi */

RavelryApi = function(base, authUsername, authPassword) {
  this.base = base;
  this.authUsername = authUsername;
  this.authPassword = authPassword;
  this.debugFunction = null;
};


RavelryApi.prototype.get = function(url) {
  const headers = new Headers();
  const debugFunction = this.debugFunction;
  // This is the HTTP header that you need add in order to access api.ravelry.com with a read only API key
  // `btoa` will base 64 encode a string: https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/Base64_encoding_and_decoding
  
  headers.append('Authorization', 'Basic ' + btoa(this.authUsername + ":" + this.authPassword));
  
  return fetch(url, { method: 'GET', headers: headers }).then(function(response) {
    return response.json();
  }).then(function(json) { 
    if (debugFunction) debugFunction(json);
    return json; 
  });
};

// Retrieve a list of projects for a user: https://www.ravelry.com/api#projects_list
// Pagination is optional, default is no pagination

RavelryApi.prototype.projectsList = function(username, page) {
  const pageSize = 25;
  const url = this.base + '/projects/' + username + '/list.json?page=' + page + '&page_size=' + pageSize;
  return this.get(url);
};

// The above is all we need to get some JSON from the API!   The rest makes the example page do stuff:

/* globals ApiDemo */

ApiDemo = function() {
  this.ravelryApiClient = null;
  this.currentProjectPage = null;
  
  
  this.addEventListeners();
};

ApiDemo.prototype.createApiClient = function(authUsername, authPassword) {
  this.ravelryApiClient = new RavelryApi('https://api.ravelry.com', authUsername, authPassword);
//   this.ravelryApiClient.debugFunction = function(json) {
//     var inspector = document.getElementById('json-inspector');
//     inspector.style.display = 'block';
//     inspector.value = JSON.stringify(json, null, 2);
//     console.log(json);
//   };
};


ApiDemo.prototype.addEventListeners = function() {
  const projectListForm = document.getElementById('projects-list-form');

    const submitProjectSearch = function() {
    const username = projectListForm.querySelector("input[name='username']").value;
    this.renderProjects(username, this.currentProjectPage);
  }.bind(this);


  // create an API client when the page is loaded
    const usernameKey = "read-84bca6d13528b8b3e477d9a019e00417";
    const passwordKey = "ojGJolAV/FA3qMQs74mZlL0TvVqAG27uERZ607VL";

    this.createApiClient(usernameKey, passwordKey);

    document.getElementById('api-request').style.display = 'block';
    this.currentProjectPage = 1;
    submitProjectSearch();

    
  projectListForm.onsubmit = function() {
    this.currentProjectPage = 1;
    submitProjectSearch();
    return false;
  }.bind(this);

  // const previousLink = document.getElementById('pagination-previous');
  // const nextLink = document.getElementById('pagination-next');

  // nextLink.addEventListener('click', function() {
  //   this.currentProjectPage += 1;
  //   submitProjectSearch();
  // }.bind(this));

  // previousLink.addEventListener('click', function() {
  //   this.currentProjectPage -= 1;
  //   submitProjectSearch();
  // }.bind(this));

};


ApiDemo.prototype.renderProjects = function(username, page) {
  document.getElementById('loading_indicator').style.display = 'inline-block';

  this.ravelryApiClient.projectsList(username, page).then(function(json) {
    document.getElementById('loading_indicator').style.display = 'none';

    const rootElement = document.getElementById('projects-list-results');
    // rootElement.innerHTML = '<h2>' + json.paginator.results + ' projects found</h2>' + 
    //   '<p> page ' + json.paginator.page + ' of ' + json.paginator.last_page + '</p>';

    // const previousPageLink = document.getElementById('pagination-previous');
    // previousPageLink.style.display = json.paginator.page > 1 ? 'block' : 'none';

    // const nextPageLink = document.getElementById('pagination-next');
    // nextPageLink.style.display = json.paginator.page < json.paginator.last_page ? 'block' : 'none';

    json.projects.forEach(function(project) {
      const child = document.createElement('div');
      child.className = 'project__result';

      const img = project.first_photo ? project.first_photo.square_url : "";
      child.style.backgroundImage = 'url(' + img + ')';

      const title = document.createElement('a');
      const titleText = document.createElement('p');
      titleText.className = 'project__title';

      title.href = project.links.self.href;
      titleText.innerText = project.name;
      title.appendChild(titleText);
      // titleText.innerHTML = project.name;
      // title.innerText = project.name;
      // title.appendChild(innerText);
      child.appendChild(title);

      rootElement.appendChild(child);
    });
  });  
};

// render content when ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function() {
    new ApiDemo();
  });
} else {
  new ApiDemo();
}