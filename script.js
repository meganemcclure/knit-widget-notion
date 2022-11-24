import { RavelryApi } from './scripts/RavelryApi.js'

let ApiDemo = function () {
  this.ravelryApiClient = null;
  this.currentProjectPage = null;

  // create an API client when the page is loaded
  const usernameKey = "read-84bca6d13528b8b3e477d9a019e00417";
  const passwordKey = "ojGJolAV/FA3qMQs74mZlL0TvVqAG27uERZ607VL";
  this.ravelryApiClient = new RavelryApi('https://api.ravelry.com', usernameKey, passwordKey);

  // initialize starting window
  if (localStorage['username']) {
    document.getElementById('username-box').style.display = 'none';
    document.getElementById('api-request').style.display = 'block';

    this.currentProjectPage = 1;
    this.renderProjects(localStorage['username'], this.currentProjectPage);
  } else {
    document.getElementById('username-box').style.display = 'flex';
    document.getElementById('api-request').style.display = 'none';
  }

  // add event listeners to the page
  this.addEventListeners();
};

ApiDemo.prototype.addEventListeners = function () {
  const projectListForm = document.getElementById('projects-list-form');
  const projectListFormStart = document.getElementById('projects-list-form-start')

  const submitProjectSearch = function (form) {
    this.currentProjectPage = 1;
    const username = form.querySelector("input[name='username']").value;
    localStorage['username'] = username;
    this.renderProjects(username, this.currentProjectPage);
  }.bind(this);

  projectListForm.onsubmit = function () {
    submitProjectSearch(projectListForm);
    return false;
  }.bind(this);

  projectListFormStart.onsubmit = function() {
    submitProjectSearch(projectListFormStart);
    document.getElementById('username-box').style.display = 'none';
    document.getElementById('api-request').style.display = 'block';
    return false;
  }.bind(this);

};

ApiDemo.prototype.renderProjects = function (username, page) {
  document.getElementById('loading_indicator').style.display = 'inline-block';

  this.ravelryApiClient.projectsList(username, page).then(function (json) {
    document.getElementById('loading_indicator').style.display = 'none';

    const rootElement = document.getElementById('projects-list-results');
    rootElement.innerHTML = ""; // clear any previous project entries

    json.projects.forEach(function (project) {
      const child = document.createElement('div');
      child.className = 'project__result';

      const img = project.first_photo ? project.first_photo.square_url : "./knit-icon.jpg";
      child.style.backgroundImage = 'url(' + img + ')';

      const title = document.createElement('a');
      const titleText = document.createElement('p');
      titleText.className = 'project__title';

      title.href = project.links.self.href;
      titleText.innerText = project.name;
      title.appendChild(titleText);
      child.appendChild(title);

      rootElement.appendChild(child);
    });
  });

  document.getElementById('no-results').style.display = 'none';
};

// render content when ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", function () {
    new ApiDemo();
  });
} else {
  new ApiDemo();
}